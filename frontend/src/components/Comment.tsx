import React, { useState } from 'react';
// Remove the date-fns import
import { Comment as CommentType } from '../types/comments';
import { toggleCommentLike, deleteComment } from '../lib/api/comments';
import Image from 'next/image';

// Simple date formatter function
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
};

interface CommentProps {
  comment: CommentType;
  currentUserId?: number | null;
  onReply: (commentId: number) => void;
  onEdit: (comment: CommentType) => void;
  onDelete: (commentId: number) => void;
  isReply?: boolean;
}

export default function Comment({ 
  comment, 
  currentUserId, 
  onReply, 
  onEdit, 
  onDelete,
  isReply = false 
}: CommentProps) {
  const [liked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(comment.likesCount);
  const [showReplies, setShowReplies] = useState<boolean>(false);
  
  const isAuthor = currentUserId === comment.userId;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const replyCount = comment._count?.replies || 0;
  
  const handleLike = async () => {
    try {
      const response = await toggleCommentLike(comment.id);
      setLiked(response.liked);
      setLikesCount(response.likesCount);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(comment.id);
        onDelete(comment.id);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };
  
  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };
  
  return (
    <div className={`relative p-5 ${isReply ? 'ml-10 mt-3' : 'border-b border-accent-300 dark:border-accent-700'} 
      bg-accent-100 dark:bg-accent-700 rounded-xl transition-all ${!isReply && 'shadow-soft'} hover:shadow-lg`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {comment.user.profile?.profilePicture ? (
            <Image 
              src={comment.user.profile.profilePicture} 
              alt={comment.user.username}
              width={40} 
              height={40} 
              className="rounded-full shadow-soft"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-200 dark:bg-primary-800 flex items-center justify-center shadow-soft">
              <span className="text-primary-700 dark:text-primary-300 font-semibold">{comment.user.username.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-accent-900 dark:text-white">
              {comment.user.username}
            </p>
            <span className="text-xs text-accent-700 dark:text-accent-300">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          
          <p className="text-accent-800 dark:text-accent-100 break-words leading-relaxed">
            {comment.content}
          </p>
          
          <div className="mt-3 flex items-center space-x-4 pt-1">
            <button
              onClick={handleLike}
              className={`text-xs flex items-center transition-colors cursor-pointer ${
                liked ? 'text-secondary-700 dark:text-secondary-400' : 'text-accent-700 dark:text-accent-300 hover:text-secondary-600 dark:hover:text-secondary-400'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1" 
                fill={liked ? "currentColor" : "none"} 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              {likesCount > 0 && <span className="font-medium">{likesCount}</span>}
            </button>
            
            {!isReply && (
              <button 
                onClick={() => onReply(comment.id)}
                className="text-xs text-accent-700 dark:text-accent-300 hover:text-primary-700 dark:hover:text-primary-300 flex items-center transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Reply
              </button>
            )}
            
            {isAuthor && (
              <>
                <button 
                  onClick={() => onEdit(comment)}
                  className="text-xs text-accent-700 dark:text-accent-300 hover:text-primary-700 dark:hover:text-primary-300 flex items-center transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                
                <button 
                  onClick={handleDelete}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </>
            )}
          </div>
          
          {!isReply && hasReplies && (
            <div className="mt-4 pt-2 border-t border-accent-200 dark:border-accent-600">
              <button 
                onClick={toggleReplies}
                className="text-xs text-primary-700 dark:text-primary-300 hover:text-primary-800 dark:hover:text-primary-200 font-medium flex items-center transition-colors cursor-pointer"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 mr-1 transition-transform ${showReplies ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {showReplies ? 'Hide' : 'Show'} {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
              </button>
              
              {showReplies && comment.replies && (
                <div className="mt-3 space-y-3 animate-fade-in">
                  {comment.replies.map((reply) => (
                    <Comment
                      key={reply.id}
                      comment={reply}
                      currentUserId={currentUserId}
                      onReply={onReply}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isReply={true}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 