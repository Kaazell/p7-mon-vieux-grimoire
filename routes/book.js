const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const multer = require("../middlewares/multer-config");

const bookCtrl = require("../controllers/book");

router.post("/", auth, multer, bookCtrl.createBook);
router.get("/:id", bookCtrl.getOneBook);
router.put("/:id", auth, multer, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.get("/", bookCtrl.getAllBooks);

module.exports = router;
