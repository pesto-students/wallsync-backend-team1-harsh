const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
	cloud_name: "wallsync",
	api_key: "734138985989871",
	api_secret: "xppRkrFusRVzORS3QQ6zkiLWNBY",
});

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "uploads",
		allowed_formats: ["png", "jpg", "jpeg"],
		transformation: [{ width: 500, height: 500, crop: "limit" }],
	},
});

const upload = multer({
	storage: storage,
	limit: { fileSize: 2000000 },
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype === "image/png" ||
			file.mimetype === "image/jpg" ||
			file.mimetype === "image/jpeg"
		) {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
		}
	},
}).single("profilePicture");

module.exports = upload;
