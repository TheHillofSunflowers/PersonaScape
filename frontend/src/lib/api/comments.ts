import api from '../api';
import { Comment, CommentsResponse, CommentLikeResponse } from '../../types/comments';

// Get comments for a profile with pagination
export async function getProfileComments(profileId: number, page = 1, limit = 10): Promise<CommentsResponse> {
  const response = await api.get(`/comments/profile/${profileId}?page=${page}&limit=${limit}`);
  return response.data;
}

// Get a specific comment with its replies
export async function getComment(commentId: number): Promise<Comment> {
  const response = await api.get(`/comments/${commentId}`);
  return response.data;
}

// Create a new comment or reply
export async function createComment(profileId: number, content: string, parentId?: number): Promise<Comment> {
  const response = await api.post(
    `/comments`,
    { profileId, content, parentId }
  );
  return response.data;
}

// Update a comment
export async function updateComment(commentId: number, content: string): Promise<Comment> {
  const response = await api.put(
    `/comments/${commentId}`,
    { content }
  );
  return response.data;
}

// Delete a comment
export async function deleteComment(commentId: number): Promise<{ message: string }> {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
}

// Like/unlike a comment
export async function toggleCommentLike(commentId: number): Promise<CommentLikeResponse> {
  const response = await api.post(
    `/comments/${commentId}/like`,
    {}
  );
  return response.data;
}

// Check if the current user has liked a comment
export async function checkCommentLike(commentId: number): Promise<{ liked: boolean }> {
  const response = await api.get(`/comments/${commentId}/like`);
  return response.data;
} 