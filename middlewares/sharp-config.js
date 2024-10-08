const sharp = require("sharp");
const fs = require("fs");
sharp.cache(false);

const sharpImg = async (req, res, next) => {
  if (!req.file) {
    return next();
  }
  try {
    await sharp(req.file.path)
      .resize({
        width: 206,
        height: 260,
      })
      .webp({ quality: 80 })
      .toFile(`${req.file.path.split(".")[0]}optimized.webp`);

    fs.unlink(req.file.path, (error) => {
      req.file.path = `${req.file.path.split(".")[0]}optimized.webp`;
      if (error) {
        console.log(error);
      }
      next();
    });
  } catch (error) {
    res.status(500).json({ error: "Impossible d'optimiser l'image" });
  }
};

module.exports = sharpImg;
