import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import Button from '@ds/components/Button';
import Input from '@ds/components/Input';
import { useLogin } from '@auth/hooks/useLogin';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  return (
    <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit((values) => loginMutation.mutate(values))}>
      <Input
        autoComplete="email"
        error={errors.email?.message}
        label="Email"
        placeholder="you@university.edu"
        {...register('email')}
      />

      <label className="block space-y-2">
        <span className="text-sm font-medium text-[var(--color-text-primary)]">Password</span>
        <div className="relative">
          <input
            autoComplete="current-password"
            className="min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 pr-12 text-base text-[var(--color-text-primary)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-brand)] sm:text-sm"
            placeholder="Enter your password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
          />
          <button
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            onClick={() => setShowPassword((current) => !current)}
            type="button"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password ? <p className="text-sm text-[var(--color-danger)]">{errors.password.message}</p> : null}
      </label>

      <Button className="w-full" isLoading={loginMutation.isPending} size="lg" type="submit">
        Sign In
      </Button>

      <p className="px-2 text-center text-sm leading-6 text-[var(--color-text-secondary)]">
        Don&apos;t have an account?{' '}
        <Link className="font-semibold text-[var(--color-brand)]" to="/signup">
          Sign up
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
