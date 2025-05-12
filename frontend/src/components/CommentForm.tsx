import React, { useState, useEffect } from 'react';
import { Comment } from '../types/comments';

interface CommentFormProps {
  profileId: number;
  parentId?: number | null;
  editComment?: Comment | null;
  initialValue?: string;
  onSubmit: (content: string, parentId?: number | null) => Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
}

export default function CommentForm({
  parentId = null,
  editComment = null,
  initialValue = '',
  onSubmit,
  onCancel,
  isEdit = false
}: CommentFormProps) {
  const [content, setContent] = useState<string>(initialValue);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = isEdit || !!editComment;

  useEffect(() => {
    if (editComment) {
      setContent(editComment.content);
    } else if (initialValue) {
      setContent(initialValue);
    }
  }, [editComment, initialValue]);

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
      if (!isEditing) {
        setContent(''); // Clear the form after successful submission (only if not editing)
      }
    } catch (err) {
      setError('Failed to submit comment. Please try again.');
      console.error('Error submitting comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          className="w-full px-4 py-3 text-accent-700 dark:text-white bg-white dark:bg-accent-800 border border-accent-200 dark:border-accent-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 resize-none transition-colors"
          rows={3}
          placeholder={isEditing ? "Edit your comment..." : parentId ? "Write a reply..." : "Share your thoughts..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        ></textarea>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-accent-600 dark:text-accent-300 bg-accent-100 dark:bg-accent-700 rounded-md hover:bg-accent-200 dark:hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-500 dark:focus:ring-accent-400 transition-colors shadow-button"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-button"
          disabled={isSubmitting || !content.trim()}
        >
          {isSubmitting ? 'Submitting...' : isEditing ? 'Update' : 'Post'}
        </button>
      </div>
    </form>
  );
} 