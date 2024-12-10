const express = require("express");
const router = express.Router();
const db = require("../models");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, "./uploads/thumbnail/");
    } else if (file.fieldname === "banner") {
      cb(null, "./uploads/banner/");
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, file.fieldname + Date.now() + file.originalname);
    } else if (file.fieldname === "banner") {
      cb(null, file.fieldname + Date.now() + file.originalname);
    }
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "image") {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    }
  } else if (file.fieldname === "banner") {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    }
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: fileFilter,
}).fields([
  { name: "image", maxCount: 1 },
  { name: "banner", maxCount: 1 },
]);

// create new post
router.post("/create", upload, (req, res) => {
  console.log(req.body);
  db.Post.create({
    title1: req.body.title1,
    title2: req.body.title2,
    image: req.files.image[0].path.replace(/\\/g, "/"),
    banner: req.files.banner[0].path.replace(/\\/g, "/"),
    content: req.body.content,
    klik: 0,
    status: "published",
    CategoryId: req.body.CategoryId,
    UserId: req.body.UserId,
  })
    .then((post) =>
      res.status(200).json({
        message: "Post has been published",
        data: post,
      })
    )
    .catch((err) => res.send(err));
});

// get all posts
router.get("/", (req, res) => {
  db.Post.findAll()
    .then((posts) => res.status(200).send(posts))
    .catch((err) => res.send(err));
});

// get all published posts
router.get("/published", (req, res) => {
  db.Post.findAll({ where: { status: "published" } })
    .then((posts) => res.status(200).send(posts))
    .catch((err) => res.send(err));
});

// get single post
router.get("/single/:id", (req, res) => {
  db.Post.findOne({
    where: { id: req.params.id },
    include: [db.User, db.Category],
  })
    .then((post) => res.status(200).send(post))
    .catch((err) => res.send(err));
});

module.exports = router;
