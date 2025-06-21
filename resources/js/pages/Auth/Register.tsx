import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Rocket, Mail, Lock, User, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface Props {
  errors: {
    message?: string;
    name?: string[];
    email?: string[];
    password?: string[];
  };
}

export default function Register({ errors }: Props) {
  const { register, handleSubmit, watch, formState: { errors: formErrors, isSubmitting } } = useForm<RegisterForm>();
  const password = watch('password');
  const [isHovered, setIsHovered] = useState(false);

  const onSubmit = (data: RegisterForm) => {
    router.post('/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation
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
              Join the Adventure
            </h2>
            <p className="mt-2 text-center text-sm text-purple-200/70">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
                Sign in here
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
                <label htmlFor="name" className="block text-sm font-medium text-purple-200">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-purple-500" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    required
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters',
                      },
                    })}
                    className={`pl-10 bg-black/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300/30 focus:border-purple-400 ${
                      errors.name || formErrors.name ? 'border-red-500/50' : ''
                    }`}
                  />
                  {(errors.name?.[0] || formErrors.name?.message) && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.name?.[0] || formErrors.name?.message}
                    </p>
                  )}
                </div>
              </div>

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
                    autoComplete="new-password"
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

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-purple-200">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-purple-500" />
                  </div>
                  <Input
                    id="password_confirmation"
                    type="password"
                    autoComplete="new-password"
                    required
                    {...register('password_confirmation', {
                      required: 'Please confirm your password',
                      validate: value =>
                        value === password || 'The passwords do not match',
                    })}
                    className={`pl-10 bg-black/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300/30 focus:border-purple-400 ${
                      formErrors.password_confirmation ? 'border-red-500/50' : ''
                    }`}
                  />
                  {formErrors.password_confirmation?.message && (
                    <p className="mt-1 text-sm text-red-400">
                      {formErrors.password_confirmation.message}
                    </p>
                  )}
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
              Create Account
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
} 