const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const multer = require("../middlewares/multer-config");

const bookCtrl = require("../controllers/book");

router.get("/bestrating", bookCtrl.getBestRating); // Route spécifique d'abord
router.post("/", auth, multer, bookCtrl.createBook); // Route pour création de livres
router.post("/:id/rating", auth, bookCtrl.rateBook); // Route pour noter un livre
router.get("/:id", bookCtrl.getOneBook); // Route dynamique pour récupérer un livre par ID
router.put("/:id", auth, multer, bookCtrl.modifyBook); // Route pour modifier un livre
router.delete("/:id", auth, bookCtrl.deleteBook); // Route pour supprimer un livre
router.get("/", bookCtrl.getAllBooks); // Route pour récupérer tous les livres (en dernier)

module.exports = router;
