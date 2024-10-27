const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const fileUpload = async (req, res) => {
  const sourceFilePath = req.file.path;
  const uniqueUploadDir = path.join(__dirname, "../uploads", uuidv4());

  if (!fs.existsSync(uniqueUploadDir)) {
    fs.mkdirSync(uniqueUploadDir, { recursive: true });
  }

  const destinationFilePath = path.join(
    uniqueUploadDir,
    `${Date.now()}_${req.file.originalname}`
  );

  const readStream = fs.createReadStream(sourceFilePath);
  const writeStream = fs.createWriteStream(destinationFilePath);

  readStream.pipe(writeStream);

  writeStream.on("finish", () => {
    fs.unlink(sourceFilePath, (err) => {
      if (err) console.error("Failed to delete temporary file:", err);
    });
    res.json({
      message: "File processed successfully",
      path: destinationFilePath,
    });
  });

  writeStream.on("error", (err) => {
    console.error("Error writing file:", err);
    res.status(500).json({ error: "Failed to process file" });
  });
};

module.exports = { fileUpload };
