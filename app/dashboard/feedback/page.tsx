'use client';

import { useState } from 'react';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { COLORS, SUCCESS_MESSAGES, ERROR_MESSAGES, TIMING } from '@/src/lib/constants';

interface FeedbackState {
  loading: boolean;
  success: boolean;
  error: string | null;
}

export default function FeedbackPage() {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');
  const [state, setState] = useState<FeedbackState>({
    loading: false,
    success: false,
    error: null,
  });

  const resetForm = () => {
    setFeedback('');
    setRating(5);
    setCategory('general');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!feedback.trim()) {
      setState({ loading: false, success: false, error: 'Please enter your feedback' });
      setTimeout(() => setState({ loading: false, success: false, error: null }), TIMING.TOAST_DURATION);
      return;
    }

    if (rating < 1 || rating > 5) {
      setState({ loading: false, success: false, error: 'Please select a rating' });
      setTimeout(() => setState({ loading: false, success: false, error: null }), TIMING.TOAST_DURATION);
      return;
    }

    setState({ loading: true, success: false, error: null });

    try {
      // TODO: Replace with actual API call to submit feedback to database
      // For now, simulating the API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, you would call:
      // const response = await fetch('/api/feedback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ rating, feedback, category })
      // });

      console.log('✅ Feedback submitted:', { rating, feedback, category });
      
      setState({ loading: false, success: true, error: null });
      resetForm();
      
      // Clear success message after timeout
      setTimeout(() => {
        setState(prev => ({ ...prev, success: false }));
      }, TIMING.TOAST_DURATION);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : ERROR_MESSAGES.FEEDBACK_ERROR;
      setState({ loading: false, success: false, error: errorMsg });
      
      // Clear error message after timeout
      setTimeout(() => {
        setState(prev => ({ ...prev, error: null }));
      }, TIMING.TOAST_DURATION);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <Breadcrumbs items={[
        { label: 'Dashboard', href: '/dashboard' }, 
        { label: 'Feedback', href: '#', active: true }
      ]} />
      
      <div className="bg-gradient-to-r from-[#FF6B4A] to-[#FF8A6B] text-white p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">Send Feedback</h1>
        <p className="opacity-90">Help us improve by sharing your feedback</p>
      </div>

      {/* Success Message */}
      {state.success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-green-800 dark:text-green-200 font-semibold">{SUCCESS_MESSAGES.FEEDBACK_SUBMITTED}</p>
            <p className="text-green-700 dark:text-green-300 text-sm mt-1">We appreciate your input and will use it to improve our service.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {state.error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-red-800 dark:text-red-200 font-semibold">Error</p>
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">{state.error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-semibold mb-2">Feedback Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={state.loading}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 disabled:opacity-50"
          >
            <option value="general">General Feedback</option>
            <option value="product">Product Quality</option>
            <option value="shipping">Shipping & Delivery</option>
            <option value="customer_service">Customer Service</option>
            <option value="website">Website & UI</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold mb-4">How would you rate us? ({rating}/5)</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                disabled={state.loading}
                className={`text-4xl transition-transform hover:scale-110 disabled:opacity-50 ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                }`}
                aria-label={`Rate ${star} stars`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Text */}
        <div>
          <label className="block text-sm font-semibold mb-2">Your Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what you think... (minimum 10 characters)"
            maxLength={1000}
            disabled={state.loading}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 min-h-40 disabled:opacity-50 resize-none"
            required
          />
          <p className="text-xs text-gray-500 mt-1">{feedback.length}/1000 characters</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={state.loading}
          className="w-full bg-[#FF6B4A] text-white py-3 rounded-lg hover:bg-[#E55A3A] font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {state.loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit Feedback
            </>
          )}
        </button>
      </form>
    </div>
  );
}
