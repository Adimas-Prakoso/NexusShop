import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Rocket, Mail, Lock, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

interface Props {
  errors: {
    message?: string;
    email?: string[];
    password?: string[];
  };
}

export default function Login({ errors }: Props) {
  const { register, handleSubmit, formState: { errors: formErrors, isSubmitting } } = useForm<LoginForm>();
  const [isHovered, setIsHovered] = useState(false);

  const onSubmit = (data: LoginForm) => {
    router.post('/login', {
      email: data.email,
      password: data.password,
      remember: data.remember || false
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-md w-full space-y-8 p-8 bg-black/40 backdrop-blur-xl border border-purple-500/20 shadow-lg shadow-purple-500/10">
          <div>
            <motion.div 
              className="flex justify-center"
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <Rocket 
                className="h-12 w-12 text-purple-500"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
            </motion.div>
            <h2 className="mt-6 text-center text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500">
              Welcome Back
            </h2>
            <p className="mt-2 text-center text-sm text-purple-200/70">
              Don't have an account?{' '}
              <Link href="/register" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
                Create one now
              </Link>
            </p>
          </div>
          
          {errors.message && (
            <Alert variant="destructive" className="mb-4 bg-red-900/50 border border-red-500/50 text-red-200">
              {errors.message}
            </Alert>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-purple-200">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-purple-500" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className={`pl-10 bg-black/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300/30 focus:border-purple-400 ${
                      errors.email || formErrors.email ? 'border-red-500/50' : ''
                    }`}
                  />
                  {(errors.email?.[0] || formErrors.email?.message) && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.email?.[0] || formErrors.email?.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-purple-200">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-purple-500" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters',
                      },
                    })}
                    className={`pl-10 bg-black/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300/30 focus:border-purple-400 ${
                      errors.password || formErrors.password ? 'border-red-500/50' : ''
                    }`}
                  />
                  {(errors.password?.[0] || formErrors.password?.message) && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.password?.[0] || formErrors.password?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 bg-black/50 border-purple-500/30 text-purple-500 focus:ring-purple-400 rounded"
                    {...register('remember')}
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-purple-200">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              Sign in
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
} 