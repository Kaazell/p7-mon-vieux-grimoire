require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose
  .connect(
    `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.DB_URL}`
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

app.use((req, res, next) => {
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

// app.get("/api/books", (req, res, next) => {
//   Book.find()
//     .then((books) => res.status(200).json(books))
//     .catch((error) => res.status(400).json({ error }));
// });

module.exports = app;
