/**
 * Types for the comment system
 */

export interface User {
  id: number;
  username: string;
  profile?: {
    profilePicture?: string | null;
  };
}

export interface CommentLike {
  id: number;
  commentId: number;
  userId: number;
  createdAt: string;
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  profileId: number;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  replies?: Comment[];
  _count?: {
    likes: number;
    replies: number;
  };
  likesCount?: number;
}

export interface CommentPagination {
  currentPage: number;
  totalPages: number;
  totalComments: number;
  hasMore: boolean;
}

export interface CommentResponse {
  comments: Comment[];
  pagination: CommentPagination;
}

export interface CommentLikeResponse {
  liked: boolean;
  likesCount: number;
} 