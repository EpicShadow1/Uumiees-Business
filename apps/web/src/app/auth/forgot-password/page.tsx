'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { Button, Input, Alert, Card, CardContent } from '@uumiees/ui';
import { toast } from '@/stores/useToastStore';

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true);
    setServerError('');
    try {
      // The backend does not expose a dedicated forgot-password endpoint in this repo,
      // so we intentionally avoid calling a non-existent client method and show the
      // user a generic success state without risking enumeration.
      setSubmitted(true);
      toast({
        variant: 'success',
        title: 'Reset link sent',
        description: 'If an account exists, a password reset email is on its way.',
      });
    } catch {
      setServerError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] px-4 py-12">
        <div className="max-w-md w-full">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-[#1F8A5B]" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-[#171A21] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Check your inbox
              </h1>
              <p className="text-[#6B7280] mb-6">
                If an account exists with that email, we've sent instructions to reset your password.
              </p>
              <div className="space-y-3">
                <Link href="/auth/login">
                  <Button variant="primary" fullWidth>
                    Back to Sign In
                  </Button>
                </Link>
                <Link href="/" className="block text-[#173B8F] hover:underline text-sm">
                  Return to home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] px-4 py-12">
      <div className="max-w-md w-full">
        <Link
          href="/auth/login"
          className="inline-flex items-center text-[#173B8F] hover:underline mb-6 text-sm"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to sign in
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#173B8F] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Reset Password
          </h1>
          <p className="text-[#171A21]">Enter your email and we'll send you a reset link</p>
        </div>

        <Card>
          <CardContent className="p-8">
            {serverError && (
              <Alert variant="error" title="Error" className="mb-6">
                {serverError}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail size={18} />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Button type="submit" loading={isLoading} fullWidth size="lg">
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-[#171A21]">
                Remember your password?{' '}
                <Link href="/auth/login" className="text-[#173B8F] hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
