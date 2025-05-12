import api from '../api';
import { Comment, CommentResponse, CommentLikeResponse } from '../../types/comments';

/**
 * Get comments for a profile
 * @param profileId Profile ID
 * @param page Page number (defaults to 1)
 * @param limit Number of comments per page (defaults to 10)
 * @returns Comments and pagination data
 */
export async function getProfileComments(
  profileId: number, 
  page: number = 1, 
  limit: number = 10
): Promise<CommentResponse> {
  const response = await api.get(`/api/comments/profile/${profileId}?page=${page}&limit=${limit}`);
  return response.data;
}

/**
 * Create a new comment
 * @param profileId Profile ID
 * @param content Comment content
 * @param parentId Optional parent comment ID for replies
 * @returns The created comment
 */
export async function createComment(
  profileId: number, 
  content: string, 
  parentId?: number
): Promise<Comment> {
  const response = await api.post('/api/comments', {
    profileId,
    content,
    parentId
  });
  return response.data;
}

/**
 * Update an existing comment
 * @param commentId Comment ID
 * @param content New comment content
 * @returns The updated comment
 */
export async function updateComment(
  commentId: number, 
  content: string
): Promise<Comment> {
  const response = await api.put(`/api/comments/${commentId}`, {
    content
  });
  return response.data;
}

/**
 * Delete a comment
 * @param commentId Comment ID
 * @returns Success response
 */
export async function deleteComment(commentId: number): Promise<{ success: boolean }> {
  const response = await api.delete(`/api/comments/${commentId}`);
  return response.data;
}

/**
 * Toggle like status for a comment
 * @param commentId Comment ID
 * @returns New like status
 */
export async function toggleCommentLike(commentId: number): Promise<CommentLikeResponse> {
  const response = await api.post(`/api/comments/${commentId}/like`);
  return response.data;
}

/**
 * Get replies for a comment
 * @param commentId Comment ID
 * @returns Reply comments
 */
export async function getCommentReplies(commentId: number): Promise<Comment[]> {
  const response = await api.get(`/api/comments/${commentId}/replies`);
  return response.data;
} 