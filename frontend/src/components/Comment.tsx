import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Comment as CommentType } from '../types/comments';
import { toggleCommentLike, deleteComment } from '../lib/api/comments';
import Image from 'next/image';

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
    <div className={`relative p-4 ${isReply ? 'ml-8 mt-2' : 'border-b'} bg-white dark:bg-gray-800 rounded-lg`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {comment.user.profile?.profilePicture ? (
            <Image 
              src={comment.user.profile.profilePicture} 
              alt={comment.user.username}
              width={40} 
              height={40} 
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600">{comment.user.username.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {comment.user.username}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          
          <p className="text-sm text-gray-800 dark:text-gray-200 break-words">
            {comment.content}
          </p>
          
          <div className="mt-2 flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`text-xs flex items-center ${
                liked ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
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
              {likesCount > 0 && likesCount}
            </button>
            
            {!isReply && (
              <button 
                onClick={() => onReply(comment.id)}
                className="text-xs text-gray-500 dark:text-gray-400 flex items-center"
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
                  className="text-xs text-gray-500 dark:text-gray-400 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                
                <button 
                  onClick={handleDelete}
                  className="text-xs text-red-500 dark:text-red-400 flex items-center"
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
            <div className="mt-3">
              <button 
                onClick={toggleReplies}
                className="text-xs text-blue-500 font-medium flex items-center"
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
                <div className="mt-2 space-y-2">
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