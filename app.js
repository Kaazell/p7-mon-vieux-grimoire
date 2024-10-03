require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose
  .connect(
    `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.DB_URL}`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json()); // Middleware permettant d'avoir acces au body de la requete

app.post("/api/books", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: "Livre créé !",
  });
});

app.get((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/books", (req, res, next) => {
  const books = [
    {
      userId: "oeihfzeoi",
      title: "Mon premier objet",
      author: "ATEF",
      imageUrl:
        "https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg",
      year: 4900,
      genre: "Fantasie",
      genre: "String - genre du livre",
      ratings: [
        {
          userId: "mongoId",
          grade: 4,
        },
      ],
      averageRating: 3,
    },
  ];
  res.status(200).json(books);
});

module.exports = app;
