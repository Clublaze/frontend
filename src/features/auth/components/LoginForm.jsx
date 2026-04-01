import { zodResolver } from '@hookform/resolvers/zod';
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

      <Input
        autoComplete="current-password"
        error={errors.password?.message}
        label="Password"
        placeholder="Enter your password"
        type="password"
        {...register('password')}
      />

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
