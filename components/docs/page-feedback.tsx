'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Check, Send, X, MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { useI18nStore } from '@/lib/i18n-client';

export function PageFeedback() {
  const pathname = usePathname();
  const { t } = useI18nStore();
  const [rating, setRating] = useState<'helpful' | 'unhelpful' | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (selectedRating: 'helpful' | 'unhelpful') => {
    setRating(selectedRating);
    setShowModal(true);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!rating) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname || '/',
          rating,
          comments: comments.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setShowModal(false);
        toast.success(t('thankYouFeedback'));
      } else {
        toast.error(data.error || 'Failed to send feedback.');
      }
    } catch (err) {
      console.error('Feedback error:', err);
      toast.error('Network error. Failed to submit feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="my-8 p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300 flex items-center justify-center gap-2 text-sm font-medium animate-in fade-in duration-300">
        <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
        <span>{t('thankYouFeedback')}</span>
      </div>
    );
  }

  return (
    <div className="my-10 border-t border-fd-border pt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-fd-card border border-fd-border/70 shadow-xs">
        <div className="flex items-center gap-2.5 text-sm font-medium text-fd-foreground">
          <MessageSquare className="w-4 h-4 text-fd-muted-foreground" />
          <span>{t('wasThisHelpful')}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleRating('helpful')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
              rating === 'helpful'
                ? 'border-green-500 bg-green-500/15 text-green-600 dark:text-green-400 ring-2 ring-green-500/30'
                : 'border-fd-border bg-fd-background text-fd-foreground hover:bg-fd-accent hover:border-green-500/50 hover:text-green-600 dark:hover:text-green-400'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{t('helpful')}</span>
          </button>

          <button
            type="button"
            onClick={() => handleRating('unhelpful')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 ${
              rating === 'unhelpful'
                ? 'border-red-500 bg-red-500/15 text-red-600 dark:text-red-400 ring-2 ring-red-500/30'
                : 'border-fd-border bg-fd-background text-fd-foreground hover:bg-fd-accent hover:border-red-500/50 hover:text-red-600 dark:hover:text-red-400'
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>{t('unhelpful')}</span>
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-fd-popover border border-fd-border rounded-xl p-5 shadow-xl text-fd-popover-foreground relative animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 p-1 rounded-md text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-semibold mb-1 flex items-center gap-2">
              {rating === 'helpful' ? (
                <ThumbsUp className="w-4 h-4 text-green-500" />
              ) : (
                <ThumbsDown className="w-4 h-4 text-red-500" />
              )}
              <span>{t('feedback')}</span>
            </h3>
            <p className="text-xs text-fd-muted-foreground mb-4">
              {rating === 'helpful'
                ? 'What did you like about this page?'
                : 'How can we improve this page?'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={t('leaveComment')}
                rows={3}
                className="w-full text-xs p-3 rounded-lg border border-fd-border bg-fd-background text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-ring resize-none"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-fd-border hover:bg-fd-accent transition-colors"
                >
                  {t('close')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-lg bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90 transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <span>{t('submitting')}</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{t('sendFeedback')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
