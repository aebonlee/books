import { useEffect, useState, useCallback } from 'react';
import { Loader2, Search, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getBooksSiteMembers, type MemberProfile } from '@/lib/api/members';
import { SEOHead } from '@/components/SEOHead';

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(
    locale === 'ko' ? 'ko-KR' : 'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' },
  );
}

function providerLabel(provider: string | null) {
  if (!provider) return '-';
  const map: Record<string, string> = {
    google: 'Google',
    kakao: 'Kakao',
    email: 'Email',
  };
  return map[provider] ?? provider;
}

export default function AdminMembersPage() {
  const { language } = useLanguage();
  const ko = language === 'ko';
  const { isLoggedIn, isAdmin, isLoading: authLoading } = useAuth();

  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadMembers = useCallback(async () => {
    setLoading(true);
    const data = await getBooksSiteMembers();
    setMembers(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) loadMembers();
  }, [isAdmin, loadMembers]);

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {ko ? '접근 권한 없음' : 'Access Denied'}
        </h1>
        <p className="text-gray-500">
          {ko ? '관리자만 접근할 수 있습니다.' : 'Only administrators can access this page.'}
        </p>
      </div>
    );
  }

  const query = search.toLowerCase();
  const filtered = query
    ? members.filter(
        (m) =>
          m.display_name?.toLowerCase().includes(query) ||
          m.email?.toLowerCase().includes(query),
      )
    : members;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SEOHead title={ko ? '회원 관리' : 'Member Management'} />

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {ko ? '회원 관리' : 'Member Management'}
          </h1>
          <Badge variant="secondary" className="text-xs">
            {filtered.length}
            {query && members.length !== filtered.length
              ? ` / ${members.length}`
              : ''}
          </Badge>
        </div>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={ko ? '이름 또는 이메일 검색' : 'Search name or email'}
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          {ko ? '회원이 없습니다' : 'No members found'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                  {ko ? '이름' : 'Name'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                  {ko ? '이메일' : 'Email'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                  {ko ? '가입 방법' : 'Provider'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                  {ko ? '역할' : 'Role'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                  {ko ? '가입일' : 'Joined'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {filtered.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                        {(member.display_name || member.email || '?').charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {member.display_name || '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {member.email}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">
                      {providerLabel(member.provider)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={member.role === 'admin' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {member.role || 'user'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {member.created_at ? formatDate(member.created_at, language) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
