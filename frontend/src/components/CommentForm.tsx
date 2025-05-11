import React, { useState, useEffect } from 'react';
import { Comment } from '../types/comments';

interface CommentFormProps {
  profileId: number;
  parentId?: number | null;
  editComment?: Comment | null;
  onSubmit: (content: string, parentId?: number | null) => Promise<void>;
  onCancel?: () => void;
}

export default function CommentForm({
  profileId,
  parentId = null,
  editComment = null,
  onSubmit,
  onCancel
}: CommentFormProps) {
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!editComment;

  useEffect(() => {
    if (editComment) {
      setContent(editComment.content);
    }
  }, [editComment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSubmit(content, parentId);
      setContent(''); // Clear the form after successful submission (only if not editing)
    } catch (err) {
      setError('Failed to submit comment. Please try again.');
      console.error('Error submitting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <textarea
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none resize-none dark:bg-gray-800 dark:text-white dark:border-gray-700"
          rows={3}
          placeholder={isEditing ? "Edit your comment..." : parentId ? "Write a reply..." : "Write a comment..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        ></textarea>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
      
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? 'Submitting...' : isEditing ? 'Update' : 'Post'}
        </button>
      </div>
    </form>
  );
} 