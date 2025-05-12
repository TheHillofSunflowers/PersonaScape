import React, { useState, useRef, useEffect } from 'react';
import { Comment } from '../types/comments';
import { getComponentBgClass } from '../lib/themeUtils';

interface CommentFormProps {
  profileId: number;
  parentId?: number | null;
  editComment?: Comment | null;
  initialValue?: string;
  onSubmit: (content: string, parentId?: number | null) => Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
  theme?: string;
}

export default function CommentForm({
  parentId = null,
  editComment = null,
  initialValue = '',
  onSubmit,
  onCancel,
  isEdit = false,
  theme = 'default'
}: CommentFormProps) {
  const [content, setContent] = useState<string>(initialValue);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = isEdit || !!editComment;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editComment) {
      setContent(editComment.content);
    } else if (initialValue) {
      setContent(initialValue);
    }
    if (textareaRef.current) {
      textareaRef.current.focus();
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
          ref={textareaRef}
          className={`w-full p-3 ${getComponentBgClass(theme)} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            isEditing ? 'Update' : 'Post'
          )}
        </button>
      </div>
    </form>
  );
} 