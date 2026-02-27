'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/toast';
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  getCustomRequests,
  createCustomRequest,
  deleteCustomRequest,
  type CustomRequest,
  type CreateCustomRequestData,
} from '@/lib/api/custom-requests';
import {
  Plus,
  FileText,
  ChevronDown,
  ChevronUp,
  Trash2,
  Clock,
  Search,
  CheckCircle,
  XCircle,
  User,
} from 'lucide-react';

const REQUEST_TYPES = ['ebook', 'textbook', 'material', 'lecture', 'other'] as const;

function getTypeLabel(type: string, locale: string): string {
  const labels: Record<string, Record<string, string>> = {
    ebook: { ko: '전자출판', en: 'E-Publishing' },
    textbook: { ko: '교재', en: 'Textbook' },
    material: { ko: '교육자료', en: 'Educational Material' },
    lecture: { ko: '강의안', en: 'Lecture Notes' },
    other: { ko: '기타', en: 'Other' },
  };
  return labels[type]?.[locale] || type;
}

function getStatusBadge(status: string, locale: string) {
  const config: Record<string, { label: Record<string, string>; color: string; icon: React.ReactNode }> = {
    pending: {
      label: { ko: '접수', en: 'Pending' },
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Clock className="h-3 w-3" />,
    },
    reviewing: {
      label: { ko: '검토중', en: 'Reviewing' },
      color: 'bg-blue-100 text-blue-800',
      icon: <Search className="h-3 w-3" />,
    },
    completed: {
      label: { ko: '완료', en: 'Completed' },
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle className="h-3 w-3" />,
    },
    cancelled: {
      label: { ko: '취소', en: 'Cancelled' },
      color: 'bg-gray-100 text-gray-600',
      icon: <XCircle className="h-3 w-3" />,
    },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.color}`}>
      {c.icon}
      {c.label[locale] || status}
    </span>
  );
}

export default function CustomOrderPage() {
  const locale = useLocale();
  const router = useRouter();
  const { user, profile, isLoggedIn, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<CreateCustomRequestData>({
    title: '',
    request_type: 'other',
    content: '',
    quantity: 1,
    deadline: '',
    author_name: '',
    author_email: '',
    author_phone: '',
  });

  const loadRequests = useCallback(async () => {
    setLoading(true);
    const { data } = await getCustomRequests();
    setRequests(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // Auto-fill contact info from user profile
  useEffect(() => {
    if (user && profile) {
      setForm((prev) => ({
        ...prev,
        author_name: prev.author_name || profile.display_name || '',
        author_email: prev.author_email || user.email || profile.email || '',
      }));
    }
  }, [user, profile]);

  const handleWriteClick = () => {
    if (!isLoggedIn) {
      router.push('/login?from=/custom-order');
      return;
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    setSubmitting(true);
    try {
      await createCustomRequest({
        ...form,
        title: form.title.trim(),
        content: form.content.trim(),
        author_name: form.author_name.trim(),
        author_email: form.author_email.trim(),
        author_phone: form.author_phone?.trim() || undefined,
        deadline: form.deadline || undefined,
      });
      toast(
        locale === 'ko' ? '제작 의뢰가 등록되었습니다' : 'Your request has been submitted',
        'success',
      );
      setShowForm(false);
      setForm({
        title: '',
        request_type: 'other',
        content: '',
        quantity: 1,
        deadline: '',
        author_name: profile?.display_name || '',
        author_email: user?.email || profile?.email || '',
        author_phone: '',
      });
      loadRequests();
    } catch (err) {
      toast(
        err instanceof Error ? err.message : locale === 'ko' ? '등록에 실패했습니다' : 'Failed to submit',
        'error',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const msg = locale === 'ko' ? '이 의뢰를 삭제하시겠습니까?' : 'Are you sure you want to delete this request?';
    if (!confirm(msg)) return;
    try {
      await deleteCustomRequest(id);
      toast(locale === 'ko' ? '삭제되었습니다' : 'Deleted', 'success');
      loadRequests();
    } catch {
      toast(locale === 'ko' ? '삭제에 실패했습니다' : 'Failed to delete', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {locale === 'ko' ? '맞춤 제작의뢰' : 'Custom Request'}
          </h1>
          <p className="mt-2 text-gray-600">
            {locale === 'ko'
              ? '원하시는 교재, 전자출판, 교육 자료의 맞춤 제작을 의뢰하세요'
              : 'Request custom-made textbooks, e-publications, and educational materials'}
          </p>
        </div>
        <Button onClick={handleWriteClick} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          {locale === 'ko' ? '제작 의뢰하기' : 'Submit Request'}
        </Button>
      </div>

      {/* Login notice */}
      {!authLoading && !isLoggedIn && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          {locale === 'ko'
            ? '제작 의뢰를 등록하려면 로그인해주세요'
            : 'Please log in to submit a request'}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="py-20 text-center text-gray-400">
          {locale === 'ko' ? '로딩 중...' : 'Loading...'}
        </div>
      ) : requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="h-16 w-16 text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold text-gray-600">
            {locale === 'ko' ? '등록된 제작 의뢰가 없습니다' : 'No requests yet'}
          </h2>
          <p className="mt-2 text-gray-400">
            {locale === 'ko' ? '첫 번째 맞춤 제작을 의뢰해보세요' : 'Be the first to submit a custom request'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const isExpanded = expandedId === req.id;
            const isOwner = user?.id === req.user_id;
            return (
              <div
                key={req.id}
                className="rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-sm"
              >
                {/* Row header */}
                <button
                  className="flex w-full items-center gap-3 p-4 text-left"
                  onClick={() => setExpandedId(isExpanded ? null : req.id)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-gray-900">{req.title}</span>
                      {getStatusBadge(req.status, locale)}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {req.author_name}
                      </span>
                      <span>{getTypeLabel(req.request_type, locale)}</span>
                      <span>{new Date(req.created_at).toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US')}</span>
                    </div>
                  </div>
                  {isExpanded
                    ? <ChevronUp className="h-5 w-5 shrink-0 text-gray-400" />
                    : <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />}
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-4">
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          {locale === 'ko' ? '상세 내용' : 'Details'}
                        </span>
                        <p className="mt-1 whitespace-pre-wrap text-gray-600">{req.content}</p>
                      </div>

                      <div className="flex flex-wrap gap-4 text-gray-500">
                        {req.quantity > 1 && (
                          <span>{locale === 'ko' ? '수량' : 'Qty'}: {req.quantity}</span>
                        )}
                        {req.deadline && (
                          <span>{locale === 'ko' ? '희망 납기일' : 'Deadline'}: {req.deadline}</span>
                        )}
                      </div>

                      {req.admin_reply && (
                        <div className="rounded-md bg-green-50 p-3">
                          <span className="text-xs font-medium text-green-800">
                            {locale === 'ko' ? '관리자 답변' : 'Admin Reply'}
                          </span>
                          <p className="mt-1 text-sm text-green-700">{req.admin_reply}</p>
                        </div>
                      )}

                      {isOwner && (
                        <div className="flex justify-end pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(req.id)}
                          >
                            <Trash2 className="mr-1 h-4 w-4" />
                            {locale === 'ko' ? '삭제' : 'Delete'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Write Form Modal */}
      <Dialog open={showForm} onClose={() => setShowForm(false)} className="max-w-lg !p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="border-b border-gray-100 px-6 pt-6 pb-4 !mb-0">
            <DialogTitle>
              {locale === 'ko' ? '제작 의뢰하기' : 'Submit Request'}
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[60vh] space-y-4 overflow-y-auto px-6 py-4">
            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {locale === 'ko' ? '제목' : 'Title'} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Request Type */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {locale === 'ko' ? '의뢰 유형' : 'Request Type'}
              </label>
              <select
                value={form.request_type}
                onChange={(e) =>
                  setForm({ ...form, request_type: e.target.value as CreateCustomRequestData['request_type'] })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {REQUEST_TYPES.map((type) => (
                  <option key={type} value={type}>{getTypeLabel(type, locale)}</option>
                ))}
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {locale === 'ko' ? '상세 내용' : 'Details'} <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder={
                  locale === 'ko'
                    ? '제작하고 싶은 콘텐츠의 주제, 분량, 특이사항 등을 상세히 적어주세요'
                    : 'Please describe the topic, scope, and any special requirements'
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Quantity + Deadline row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {locale === 'ko' ? '수량' : 'Quantity'}
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {locale === 'ko' ? '희망 납기일' : 'Desired Deadline'}
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {locale === 'ko' ? '이름' : 'Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.author_name}
                  onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  {locale === 'ko' ? '연락처' : 'Phone'}
                </label>
                <input
                  type="tel"
                  value={form.author_phone}
                  onChange={(e) => setForm({ ...form, author_phone: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {locale === 'ko' ? '이메일' : 'Email'} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={form.author_email}
                onChange={(e) => setForm({ ...form, author_email: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              {locale === 'ko' ? '취소' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? (locale === 'ko' ? '등록 중...' : 'Submitting...')
                : (locale === 'ko' ? '의뢰 등록' : 'Submit Request')}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
