const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");
const sharpImg = require("../middlewares/sharp-config");

const bookCtrl = require("../controllers/book");

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRating);
router.get("/:id", bookCtrl.getOneBook);
router.post("/", auth, multer, sharpImg, bookCtrl.createBook);
router.put("/:id", auth, multer, sharpImg, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.post("/:id/rating", auth, bookCtrl.rateBook);

module.exports = router;
