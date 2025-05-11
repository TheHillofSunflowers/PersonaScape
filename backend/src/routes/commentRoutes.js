const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// Get all comments for a profile (public)
router.get('/profile/:profileId', commentController.getProfileComments);

// Get a specific comment and its replies (public)
router.get('/:commentId', commentController.getComment);

// Protected routes (require authentication)
router.post('/', auth, commentController.createComment);
router.put('/:commentId', auth, commentController.updateComment);
router.delete('/:commentId', auth, commentController.deleteComment);

// Comment likes
router.post('/:commentId/like', auth, commentController.toggleCommentLike);
router.get('/:commentId/like', auth, commentController.checkCommentLike);

module.exports = router; 