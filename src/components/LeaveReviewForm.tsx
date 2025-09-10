'use client';

import { useState } from 'react';
import { createReview } from '@/actions/reviewActions';
import { Star } from 'lucide-react';
import { Button } from './ui/button';

interface LeaveReviewFormProps {
  transactionId: string;
  sellerId: string;
  reviewerId: string;
  carInfo: string;
}

export default function LeaveReviewForm({
  transactionId,
  sellerId,
  reviewerId,
  carInfo,
}: LeaveReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setMessage('Please select a rating.');
      return;
    }
    setIsSubmitting(true);
    setMessage('');
    try {
      await createReview(transactionId, rating, comment, reviewerId, sellerId);
      setMessage('Review submitted successfully!');
      // Optionally, you can hide the form or disable it after submission
    } catch (error) {
      setMessage('Failed to submit review. Please try again.');
      console.error(error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="border rounded-lg p-4 my-4">
      <h3 className="font-semibold">Leave a review for your purchase of the {carInfo}</h3>
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  (hoverRating || rating) >= star
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
              />
            </button>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          className="w-full p-2 border rounded-md"
          rows={4}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
        {message && <p className="text-sm mt-2">{message}</p>}
      </form>
    </div>
  );
}
