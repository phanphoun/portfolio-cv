'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;
type SubmissionStatus = 'idle' | 'loading' | 'success' | 'handoff' | 'error';

interface ContactApiResponse {
  status?: 'sent' | 'handoff';
  message?: string;
  error?: string;
  fallbackUrl?: string;
}

export function ContactForm() {
  const [status, setStatus] = useState<SubmissionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus('loading');
    setStatusMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = (await response.json().catch(() => null)) as ContactApiResponse | null;

      if (!response.ok) {
        throw new Error(result?.error || 'Failed to send message');
      }

      if (result?.status === 'handoff' && result.fallbackUrl) {
        setStatus('handoff');
        setStatusMessage(
          result.message ||
            'Your email app should open with this message pre-filled.'
        );
        window.location.href = result.fallbackUrl;
        return;
      }

      setStatus('success');
      setStatusMessage(result?.message || 'Message sent successfully.');
      reset();
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again later.'
      );
    }
  };

  if (status === 'success' || status === 'handoff') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          {status === 'success' ? (
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          ) : (
            <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {status === 'success' ? 'Message Sent!' : 'Finish In Your Email App'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {statusMessage}
        </p>
        <Button onClick={() => setStatus('idle')} variant="outline">
          {status === 'success' ? 'Send Another Message' : 'Edit Message'}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={cn(
              'w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
              errors.name
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            )}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={cn(
              'w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
              errors.email
                ? 'border-red-300 dark:border-red-700'
                : 'border-gray-300 dark:border-gray-700'
            )}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          {...register('subject')}
          className={cn(
            'w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
            errors.subject
              ? 'border-red-300 dark:border-red-700'
              : 'border-gray-300 dark:border-gray-700'
          )}
          placeholder="What is this about?"
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...register('message')}
          className={cn(
            'w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none',
            errors.message
              ? 'border-red-300 dark:border-red-700'
              : 'border-gray-300 dark:border-gray-700'
          )}
          placeholder="Your message..."
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" disabled={status === 'loading'} className="w-full sm:w-auto">
        {status === 'loading' ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
