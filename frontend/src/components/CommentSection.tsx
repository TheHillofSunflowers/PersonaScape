import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { Comment as CommentType } from '../types/comments';
import { 
  getProfileComments, 
  createComment, 
  updateComment as updateCommentApi 
} from '../lib/api/comments';
import { useAuth } from '../context/AuthContext';

interface CommentSectionProps {
  profileId: number;
}

export default function CommentSection({ profileId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [editComment, setEditComment] = useState<CommentType | null>(null);
  
  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId, page]);
  
  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await getProfileComments(profileId, page);
      
      if (page === 1) {
        setComments(response.comments);
      } else {
        setComments(prev => [...prev, ...response.comments]);
      }
      
      setHasMore(response.pagination.hasMore);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  
  const handleCreateComment = async (content: string, parentId?: number | null) => {
    try {
      const newComment = await createComment(profileId, content, parentId || undefined);
      
      if (!parentId) {
        // Add new root comment to the top
        setComments(prev => [newComment, ...prev]);
      } else {
        // Add reply to the parent comment
        setComments(prev => 
          prev.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newComment],
                _count: {
                  ...(comment._count || { likes: 0, replies: 0 }),
                  replies: ((comment._count?.replies || 0) + 1)
                }
              } as CommentType;
            }
            return comment;
          })
        );
      }
      
      // Reset reply state
      setReplyToId(null);
    } catch (err) {
      console.error('Error creating comment:', err);
      throw err;
    }
  };
  
  const handleUpdateComment = async (content: string) => {
    if (!editComment) return;
    
    try {
      const updatedComment = await updateCommentApi(editComment.id, content);
      
      // Update the comment in state
      setComments(prev => 
        prev.map(comment => {
          // If this is the comment being edited
          if (comment.id === updatedComment.id) {
            return { ...comment, content: updatedComment.content } as CommentType;
          }
          
          // Check if the edited comment is a reply
          if (comment.replies) {
            return {
              ...comment,
              replies: comment.replies.map(reply => 
                reply.id === updatedComment.id 
                  ? { ...reply, content: updatedComment.content } as CommentType
                  : reply
              )
            } as CommentType;
          }
          
          return comment;
        })
      );
      
      // Reset edit state
      setEditComment(null);
    } catch (err) {
      console.error('Error updating comment:', err);
      throw err;
    }
  };
  
  const handleDeleteComment = (commentId: number) => {
    // Remove the comment from state
    setComments(prev => {
      // First check if it's a root comment
      const isRootComment = prev.some(comment => comment.id === commentId);
      
      if (isRootComment) {
        return prev.filter(comment => comment.id !== commentId);
      }
      
      // Must be a reply, update the parent
      return prev.map(comment => {
        if (comment.replies && comment.replies.some(reply => reply.id === commentId)) {
          return {
            ...comment,
            replies: comment.replies.filter(reply => reply.id !== commentId),
            _count: {
              ...(comment._count || { likes: 0, replies: 0 }),
              replies: Math.max(0, (comment._count?.replies || 1) - 1)
            }
          } as CommentType;
        }
        return comment;
      });
    });
  };
  
  const handleReply = (commentId: number) => {
    setReplyToId(commentId);
    setEditComment(null);
  };
  
  const handleEdit = (comment: CommentType) => {
    setEditComment(comment);
    setReplyToId(null);
  };
  
  const handleCancelReply = () => {
    setReplyToId(null);
  };
  
  const handleCancelEdit = () => {
    setEditComment(null);
  };
  
  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Comments</h2>
      
      {user ? (
        <div className="mb-6">
          <CommentForm 
            profileId={profileId} 
            onSubmit={handleCreateComment} 
          />
        </div>
      ) : (
        <div className="p-4 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
          <p className="text-gray-700 dark:text-gray-300">
            Please <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">log in</a> to leave a comment.
          </p>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {loading && page === 1 ? (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading comments...</p>
        </div>
      ) : (
        <>
          {comments.length === 0 ? (
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => (
                <React.Fragment key={comment.id}>
                  <Comment
                    comment={comment}
                    currentUserId={user ? parseInt(user.id) : null}
                    onReply={handleReply}
                    onEdit={handleEdit}
                    onDelete={handleDeleteComment}
                  />
                  
                  {replyToId === comment.id && (
                    <div className="ml-12 mt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Replying to <span className="font-bold">{comment.user.username}</span>
                      </p>
                      <CommentForm
                        profileId={profileId}
                        parentId={comment.id}
                        onSubmit={handleCreateComment}
                        onCancel={handleCancelReply}
                      />
                    </div>
                  )}
                </React.Fragment>
              ))}
              
              {loading && page > 1 && (
                <div className="text-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              )}
              
              {hasMore && !loading && (
                <div className="text-center pt-2">
                  <button
                    onClick={handleLoadMore}
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-blue-400 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    Load More Comments
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      {editComment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Edit Comment</h3>
            <CommentForm
              profileId={profileId}
              editComment={editComment}
              onSubmit={handleUpdateComment}
              onCancel={handleCancelEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
} 