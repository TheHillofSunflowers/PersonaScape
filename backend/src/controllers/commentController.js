const { PrismaClient } = require('@prisma/client');
const prisma = require('../prismaClient');

// Get all comments for a specific profile (paginated with newest first)
exports.getProfileComments = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    
    // Get only root comments (no parentId) and order by newest first
    const comments = await prisma.comment.findMany({
      where: {
        profileId: parseInt(profileId),
        parentId: null // Only root comments
      },
      orderBy: {
        createdAt: 'desc' // Newest first
      },
      skip: (parsedPage - 1) * parsedLimit,
      take: parsedLimit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                profilePicture: true
              }
            }
          }
        },
        replies: {
          orderBy: {
            createdAt: 'asc' // Chronological order for replies
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profile: {
                  select: {
                    profilePicture: true
                  }
                }
              }
            },
            _count: {
              select: {
                likes: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      }
    });
    
    // Get total count of root comments for pagination
    const totalComments = await prisma.comment.count({
      where: {
        profileId: parseInt(profileId),
        parentId: null
      }
    });
    
    const totalPages = Math.ceil(totalComments / parsedLimit);
    
    return res.status(200).json({
      comments,
      pagination: {
        currentPage: parsedPage,
        totalPages,
        totalComments,
        hasMore: parsedPage < totalPages
      }
    });
  } catch (error) {
    console.error('Error getting profile comments:', error);
    return res.status(500).json({ error: 'Failed to get comments' });
  }
};

// Get a specific comment and its replies
exports.getComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const comment = await prisma.comment.findUnique({
      where: {
        id: parseInt(commentId)
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                profilePicture: true
              }
            }
          }
        },
        replies: {
          orderBy: {
            createdAt: 'asc'
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profile: {
                  select: {
                    profilePicture: true
                  }
                }
              }
            },
            _count: {
              select: {
                likes: true
              }
            }
          }
        },
        _count: {
          select: {
            likes: true,
            replies: true
          }
        }
      }
    });
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    return res.status(200).json(comment);
  } catch (error) {
    console.error('Error getting comment:', error);
    return res.status(500).json({ error: 'Failed to get comment' });
  }
};

// Create a new comment or reply
exports.createComment = async (req, res) => {
  try {
    const { profileId, content, parentId } = req.body;
    const userId = req.user.id; // From auth middleware
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }
    
    // Check if the profile exists
    const profile = await prisma.profile.findUnique({
      where: { id: parseInt(profileId) }
    });
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // If this is a reply, check if parent comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parseInt(parentId) }
      });
      
      if (!parentComment) {
        return res.status(404).json({ error: 'Parent comment not found' });
      }
      
      // Ensure the parent comment is for the same profile
      if (parentComment.profileId !== parseInt(profileId)) {
        return res.status(400).json({ error: 'Parent comment must be from the same profile' });
      }
    }
    
    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        profileId: parseInt(profileId),
        userId,
        parentId: parentId ? parseInt(parentId) : null
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                profilePicture: true
              }
            }
          }
        }
      }
    });
    
    return res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({ error: 'Failed to create comment' });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id; // From auth middleware
    
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Comment content cannot be empty' });
    }
    
    // Check if comment exists and belongs to the user
    const existingComment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) }
    });
    
    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (existingComment.userId !== userId) {
      return res.status(403).json({ error: 'You can only edit your own comments' });
    }
    
    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { content },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profile: {
              select: {
                profilePicture: true
              }
            }
          }
        }
      }
    });
    
    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    return res.status(500).json({ error: 'Failed to update comment' });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id; // From auth middleware
    
    // Check if comment exists
    const existingComment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) }
    });
    
    if (!existingComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Check if user owns the comment
    if (existingComment.userId !== userId) {
      // Also check if the user owns the profile the comment is on
      const profile = await prisma.profile.findUnique({
        where: { id: existingComment.profileId }
      });
      
      if (!profile || profile.userId !== userId) {
        return res.status(403).json({ error: 'You can only delete your own comments or comments on your profile' });
      }
    }
    
    // Delete the comment (this will cascade to likes and replies)
    await prisma.comment.delete({
      where: { id: parseInt(commentId) }
    });
    
    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ error: 'Failed to delete comment' });
  }
};

// Like/unlike a comment
exports.toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id; // From auth middleware
    
    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) }
    });
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    // Check if user already liked the comment
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId: parseInt(commentId),
          userId
        }
      }
    });
    
    // Transaction to either create or delete the like and update the count
    if (existingLike) {
      // Unlike the comment
      await prisma.$transaction([
        // Delete the like
        prisma.commentLike.delete({
          where: {
            id: existingLike.id
          }
        }),
        // Decrement the likes count
        prisma.comment.update({
          where: { id: parseInt(commentId) },
          data: {
            likesCount: {
              decrement: 1
            }
          }
        })
      ]);
      
      return res.status(200).json({ liked: false, likesCount: comment.likesCount - 1 });
    } else {
      // Like the comment
      await prisma.$transaction([
        // Create the like
        prisma.commentLike.create({
          data: {
            commentId: parseInt(commentId),
            userId
          }
        }),
        // Increment the likes count
        prisma.comment.update({
          where: { id: parseInt(commentId) },
          data: {
            likesCount: {
              increment: 1
            }
          }
        })
      ]);
      
      return res.status(200).json({ liked: true, likesCount: comment.likesCount + 1 });
    }
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return res.status(500).json({ error: 'Failed to toggle comment like' });
  }
};

// Check if a user has liked a comment
exports.checkCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id; // From auth middleware
    
    const like = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId: parseInt(commentId),
          userId
        }
      }
    });
    
    return res.status(200).json({ liked: !!like });
  } catch (error) {
    console.error('Error checking comment like:', error);
    return res.status(500).json({ error: 'Failed to check comment like' });
  }
}; 