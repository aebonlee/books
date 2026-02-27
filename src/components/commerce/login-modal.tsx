'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useToast } from '@/components/ui/toast';
import { signInWithGoogle, signInWithKakao, signInWithEmail } from '@/lib/auth';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
  const locale = useLocale();
  const { toast } = useToast();
  const [step, setStep] = useState<'method' | 'email'>('method');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 모달 열릴 때 폼 초기화
  useEffect(() => {
    if (open) {
      setStep('method');
      setEmail('');
      setPassword('');
      setError('');
    }
  }, [open]);

  const handleSocialLogin = async (provider: 'google' | 'kakao') => {
    setError('');
    try {
      if (provider === 'google') await signInWithGoogle();
      else await signInWithKakao();
      // OAuth는 리다이렉트 방식이므로 여기서 onClose 안 함
    } catch (err) {
      setError(
        err instanceof Error ? err.message
          : locale === 'ko' ? '로그인 중 오류가 발생했습니다' : 'Login error',
      );
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError('');
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      toast(
        locale === 'ko' ? '로그인되었습니다' : 'Logged in successfully',
        'success',
      );
      onClose();
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message
          : locale === 'ko' ? '이메일 또는 비밀번호가 올바르지 않습니다' : 'Invalid email or password',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>
          {locale === 'ko' ? '로그인' : 'Login'}
        </DialogTitle>
        <DialogDescription>
          {locale === 'ko'
            ? 'DreamIT Biz 계정으로 로그인하세요'
            : 'Sign in with your DreamIT Biz account'}
        </DialogDescription>
      </DialogHeader>

      {step === 'method' ? (
        <div className="space-y-3">
          {/* Google */}
          <button
            onClick={() => handleSocialLogin('google')}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>

          {/* Kakao */}
          <button
            onClick={() => handleSocialLogin('kakao')}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-yellow-300 bg-[#FEE500] px-4 py-2.5 text-sm font-medium text-[#3C1E1E] shadow-sm transition-colors hover:bg-[#FADA0A]"
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.8 5.22 4.52 6.6-.2.74-.72 2.68-.82 3.1-.13.5.18.49.38.36.16-.1 2.5-1.7 3.5-2.4.78.12 1.58.18 2.42.18 5.52 0 10-3.58 10-7.9S17.52 3 12 3z" fill="#3C1E1E" />
            </svg>
            Kakao
          </button>

          {/* Email */}
          <button
            onClick={() => setStep('email')}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            <Mail className="h-[18px] w-[18px]" />
            Email
          </button>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Separator className="my-2" />

          <p className="text-center text-sm text-gray-500">
            {locale === 'ko' ? '계정이 없으신가요?' : "Don't have an account?"}{' '}
            <a
              href="https://www.dreamitbiz.com/register"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {locale === 'ko' ? '회원가입' : 'Register'}
            </a>
          </p>
        </div>
      ) : (
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <Label htmlFor="login-email">
              {locale === 'ko' ? '이메일' : 'Email'}
            </Label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="login-password">
              {locale === 'ko' ? '비밀번호' : 'Password'}
            </Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => { setStep('method'); setError(''); }}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              {locale === 'ko' ? '뒤로' : 'Back'}
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {locale === 'ko' ? '로그인' : 'Login'}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500">
            {locale === 'ko' ? '계정이 없으신가요?' : "Don't have an account?"}{' '}
            <a
              href="https://www.dreamitbiz.com/register"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {locale === 'ko' ? '회원가입' : 'Register'}
            </a>
          </p>
        </form>
      )}
    </Dialog>
  );
}
