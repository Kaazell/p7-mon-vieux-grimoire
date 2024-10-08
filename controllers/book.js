const Book = require("../models/book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id; // Cote MongoDB / Si un utilisateur soumettait une requête avec un champ _id dans req.body, il pourrait potentiellement essayer d'écraser ou de réutiliser l'identifiant d'un autre document.
  delete bookObject._userId; // Cote serveur / Un utilisateur malveillant pourrait essayer de créer ou de modifier un livre au nom d'un autre utilisateur en falsifiant cet identifiant dans la requête.
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Livre enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};
exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      }
      if (req.file) {
        const oldFilename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${oldFilename}`, (err) => {
          if (err) {
            console.error("Erreur lors de la suppression de l'image : ", err);
          }
        });
      }
      Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Livre modifié!" }))
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
exports.rateBook = (req, res, next) => {
  const user = req.body.userId;
  if (user !== req.auth.userId) {
    res.status(401).json({ message: "Non autorisé" });
  } else {
    Book.findOne({ _id: req.params.id })
      .then((book) => {
        if (book.ratings.find((rating) => rating.userId === user)) {
          res.status(401).json({ message: "Livre déjà noté" });
        } else {
          const newRating = {
            userId: user,
            grade: req.body.rating,
            _id: req.body._id,
          };
          const updatedRatings = [...book.ratings, newRating];
          function calcAverageRating(ratings) {
            const sumRatings = ratings.reduce(
              (total, rate) => total + rate.grade,
              0
            );
            const average = sumRatings / ratings.length;
            return parseFloat(average.toFixed(2));
          }
          const updateAverageRating = calcAverageRating(updatedRatings);
          Book.findOneAndUpdate(
            { _id: req.params.id, "ratings.userId": { $ne: user } },
            {
              $push: { ratings: newRating },
              averageRating: updateAverageRating,
            },
            { new: true }
          )
            .then((updatedBook) => res.status(201).json(updatedBook))
            .catch((error) => res.status(401).json({ error }));
        }
      })
      .catch((error) => res.status(401).json({ error }));
  }
};
exports.getBestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(401).json({ error }));
};
