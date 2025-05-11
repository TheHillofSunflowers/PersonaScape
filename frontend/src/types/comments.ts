export interface User {
  id: number;
  username: string;
  profile?: {
    profilePicture?: string;
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
  profileId: number;
  userId: number;
  parentId: number | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  replies?: Comment[];
  likes?: CommentLike[];
  likesCount: number;
  _count?: {
    likes: number;
    replies: number;
  };
}

export interface CommentPagination {
  currentPage: number;
  totalPages: number;
  totalComments: number;
  hasMore: boolean;
}

export interface CommentsResponse {
  comments: Comment[];
  pagination: CommentPagination;
}

export interface CommentLikeResponse {
  liked: boolean;
  likesCount: number;
} 