const express = require('express')
const protect  = require("../middleware/authMiddleware")
const {createPost, getAllPosts, getPostById, updatePost, deletePost} = require('../controllers/postController')

const router = express()


router.route('/').get(getAllPosts).post(protect,createPost)
router.route('/:id').get(getPostById).put(updatePost).delete(deletePost)

module.exports = router