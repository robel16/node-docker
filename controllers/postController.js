const Post = require("../models/postModels");

exports.createPost = async (req, res, next) => {
	try {
		const postBody = req.body;
		if (!postBody.title || !postBody.body) {
			return res.status(400).json({
				statusCode: 400,
				success: false,
				message: "post must have a title and body",
			});
		}

		const post = await Post.create(postBody);
        console.log("created post", post);
		if (!post) {
			return res.status(400).json({
				statusCode: 400,
				success: false,
				message: "post not created",
			});
		}
        return res.status(201).json({
            statusCode: 201,
            success: true,
            message: "post created",
            data: {
                post
            }
            
        })
        
	} catch (error) {}
};

exports.getAllPosts = async (req, res, next) => {
	try {
		const posts = await Post.find();
		return res.status(200).json({
			statusCode: 200,
			success: true,
			results: posts.length,
			data: {
				posts,
			},
		});
	} catch (error) {
		console.log("errors getting post", error);
		return res.status(400).json({
			statusCode: 400,
			success: false,
			message: error.message,
		});
	}
};

exports.getPostById = async (req, res, next) => {
	try {
		const postId = req.params.id;

		if (!postId) {
			return res.status(400).json({
				statusCode: 400,
				success: false,
				message: "post id is required",
			});
		}
		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({
				statusCode: 404,
				success: false,
				message: "post not found",
			});
		}
		return res.status(200).json({
			statusCode: 200,
			success: true,
			data: {
				post,
			},
		});
	} catch (error) {
		console.log("error", error);
		return res.status(400).json({
			statusCode: 400,
			success: false,
			message: error.message,
		});
	}
};

exports.updatePost = async (req, res, next) => {
	try {
		const postId = req.params.id;
        const updateBody = req.body

		if (!postId) {
			return res.status(400).json({
				statusCode: 400,
				success: false,
				message: "post id is required",
			});
		}
        const filters = {_id:postId}
		const updatedPost = await Post.findOneAndUpdate(filters,updateBody, {
            new: true,
            runValidators:true
        } );
		if (!updatedPost) {
			return res.status(404).json({
				statusCode: 404,
				success: false,
				message: "post not found",
			});
		}
		return res.status(200).json({
			statusCode: 200,
			success: true,
			data: {
				updatedPost,
			},
		});
	} catch (error) {
		console.log("error", error);
		return res.status(400).json({
			statusCode: 400,
			success: false,
			message: error.message,
		});
	}
};

exports.deletePost = async (req, res, next) => {
	try {
		const postId = req.params.id;

		if (!postId) {
			return res.status(400).json({
				statusCode: 400,
				success: false,
				message: "post id is required",
			});
		}
		const post = await Post.findOneAndDelete(postId);
		if (!post) {
			return res.status(404).json({
				statusCode: 404,
				success: false,
				message: "post not found",
			});
		}
		return res.status(200).json({
			statusCode: 200,
			success: true,
			message: "post deleted"
		});
	} catch (error) {
		console.log("error", error);
		return res.status(400).json({
			statusCode: 400,
			success: false,
			message: error.message,
		});
	}
};