'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/toast';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Loader2 } from 'lucide-react';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
  const locale = useLocale();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login({ email, password });
      toast(
        locale === 'ko' ? '로그인되었습니다' : 'Logged in successfully',
        'success',
      );
      onClose();
      onSuccess?.();
    } catch {
      setError(
        locale === 'ko'
          ? '이메일 또는 비밀번호가 올바르지 않습니다'
          : 'Invalid email or password',
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
            ? '구매를 위해 로그인해주세요'
            : 'Please login to continue with your purchase'}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">
            {locale === 'ko' ? '이메일' : 'Email'}
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="password">
            {locale === 'ko' ? '비밀번호' : 'Password'}
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="mr-2 h-4 w-4" />
          )}
          {locale === 'ko' ? '로그인' : 'Login'}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
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
    </Dialog>
  );
}
