import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { User, Mail, Lock, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileForm {
  name: string;
  email: string;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

interface Props {
  user: {
    name: string;
    email: string;
  };
}

export default function Profile({ user }: Props) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ProfileForm>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const password = watch('password');

  const onSubmit = async (data: ProfileForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage('Profile updated successfully');
        setError('');
        // Reset password fields
        reset({
          ...data,
          current_password: '',
          password: '',
          password_confirmation: '',
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update profile');
        setMessage('');
      }
    } catch {
      setError('An error occurred while updating profile');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head title="Profile Settings" />
      
      <div className="min-h-screen py-12 bg-[#0a0a0f] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 bg-black/40 backdrop-blur-xl border border-purple-500/20 shadow-lg shadow-purple-500/10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500">
                  Profile Settings
                </h2>
                <p className="mt-2 text-purple-200/70">
                  Update your account's profile information and password.
                </p>
              </div>

              {message && (
                <Alert className="mb-6 bg-emerald-900/50 border-emerald-500/50 text-emerald-200 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  {message}
                </Alert>
              )}

              {error && (
                <Alert className="mb-6 bg-red-900/50 border-red-500/50 text-red-200 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-purple-200">
                    Name
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-purple-500" />
                    </div>
                    <Input
                      id="name"
                      type="text"
                      className={`pl-10 bg-black/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300/30 focus:border-purple-400 ${
                        errors.name ? 'border-red-500/50' : ''
                      }`}
                      {...register('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters',
                        },
                      })}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-purple-200">
                    Email
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-purple-500" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      className={`pl-10 bg-black/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300/30 focus:border-purple-400 ${
                        errors.email ? 'border-red-500/50' : ''
                      }`}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-purple-500/20 pt-6">
                  <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                    Change Password
                  </h3>
                  <p className="mt-2 text-purple-200/70">
                    Leave the password fields empty if you don't want to change it.
                  </p>

                  <div className="mt-6 space-y-6">
                    <div>
                      <label htmlFor="current_password" className="block text-sm font-medium text-purple-200">
                        Current Password
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Shield className="h-5 w-5 text-purple-500" />
                        </div>
                        <Input
                          id="current_password"
                          type="password"
                          className={`pl-10 bg-black/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300/30 focus:border-purple-400 ${
                            errors.current_password ? 'border-red-500/50' : ''
                          }`}
                          {...register('current_password', {
                            required: {
                              value: !!watch('password'),
                              message: 'Current password is required to set a new password',
                            },
                          })}
                        />
                        {errors.current_password && (
                          <p className="mt-1 text-sm text-red-400">{errors.current_password.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-purple-200">
                        New Password
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-purple-500" />
                        </div>
                        <Input
                          id="password"
                          type="password"
                          className={`pl-10 bg-black/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300/30 focus:border-purple-400 ${
                            errors.password ? 'border-red-500/50' : ''
                          }`}
                          {...register('password', {
                            minLength: {
                              value: 8,
                              message: 'Password must be at least 8 characters',
                            },
                          })}
                        />
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password_confirmation" className="block text-sm font-medium text-purple-200">
                        Confirm New Password
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-purple-500" />
                        </div>
                        <Input
                          id="password_confirmation"
                          type="password"
                          className={`pl-10 bg-black/50 border-purple-500/30 text-purple-100 placeholder:text-purple-300/30 focus:border-purple-400 ${
                            errors.password_confirmation ? 'border-red-500/50' : ''
                          }`}
                          {...register('password_confirmation', {
                            validate: value =>
                              !password || value === password || 'The passwords do not match',
                          })}
                        />
                        {errors.password_confirmation && (
                          <p className="mt-1 text-sm text-red-400">{errors.password_confirmation.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
} 