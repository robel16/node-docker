const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
	try {
		const { username, password } = req.body;
		const hashPassword = await bcrypt.hash(password, 12);
		const newUser = await User.create({
			username,
			password: hashPassword,
		});
        req.session.user = newUser;
		return res.status(201).json({
			statusCode: 201,
			success: true,
			message: "user created",
			data: {
				user: newUser,
			},
		});
	} catch (error) {
		console.log("error when creating user", error);
		return res.status(400).json({
			statusCode: 400,
			success: false,
			message: error.message,
		});
	}
};

exports.signIn = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(400).json({
				statusCode: 400,
				success: false,
				message: "user not found",
			});
		}
		const checkPassword = await bcrypt.compare(password, user.password);
		if (!checkPassword) {
			return res.status(400).json({
				statusCode: 400,
				success: false,
				message: "password not match",
			});
		}
		if (checkPassword) {
			req.session.user = user;
			return res.status(200).json({
				statusCode: 200,
				success: true,
				message: "user signed in",
				data: {
					user,
				},
			});
		}
	} catch (error) {
		console.log("error when sign in", error);
		return res.status(400).json({
			statusCode: 400,
			success: false,
			message: error.message,
		});
	}
};
