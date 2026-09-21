'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Alert, Card, CardContent } from '@uumiees/ui';
import { authSchemas } from '@uumiees/validation';
import { initApi } from '@/lib/api';
import { toast } from '@/stores/useToastStore';
import type { AuthResponse } from '@uumiees/types';

const registerSchema = authSchemas.register
  .extend({
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    setServerError('');
    try {
      const api = initApi();
      const result: AuthResponse = await api.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      localStorage.setItem('token', result.token);
      localStorage.setItem('sessionToken', result.sessionToken);
      localStorage.setItem('user', JSON.stringify(result.user));

      toast({
        variant: 'success',
        title: 'Welcome to Uumiees!',
        description: `Your account has been created, ${result.user.name.split(' ')[0]}.`,
      });
      router.push('/');
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      const msg = e?.response?.data?.error || e?.message || 'Registration failed';
      setServerError(msg);
      toast({ variant: 'error', title: 'Could not create account', description: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF7] px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#173B8F] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Create Account
          </h1>
          <p className="text-[#171A21]">Join Uumiees today</p>
        </div>

        <Card>
          <CardContent className="p-8">
            {serverError && (
              <Alert variant="error" title="Registration failed" className="mb-6" dismissible onDismiss={() => setServerError('')}>
                {serverError}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                leftIcon={<User size={18} />}
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail size={18} />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock size={18} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="text-[#6B7280] hover:text-[#173B8F] transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                error={errors.password?.message}
                helperText="At least 8 characters"
                {...register('password')}
              />

              <Input
                label="Confirm Password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock size={18} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                    className="text-[#6B7280] hover:text-[#173B8F] transition"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button type="submit" loading={isLoading} fullWidth size="lg">
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-[#171A21]">
                Already have an account?{' '}
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
