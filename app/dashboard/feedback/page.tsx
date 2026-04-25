'use client';

import { useState } from 'react';
import { Breadcrumbs } from '@/src/components/Breadcrumbs';
import { Send } from 'lucide-react';

export default function FeedbackPage() {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!feedback.trim()) {
      alert('Please enter your feedback');
      return;
    }
    alert('Thank you for your feedback!');
    setFeedback('');
    setRating(5);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
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

      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-4">How would you rate us?</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl transition-transform hover:scale-110 ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Your Feedback</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us what you think..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 min-h-40"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#FF6B4A] text-white py-3 rounded-lg hover:bg-[#E55A3A] font-semibold flex items-center justify-center gap-2"
        >
          <Send className="h-4 w-4" />
          Submit Feedback
        </button>
      </div>
    </div>
  );
}
