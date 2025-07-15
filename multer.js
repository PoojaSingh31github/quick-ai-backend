import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads/ directory exists
const uploadPath = "./uploads";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, uniqueName);
  },
});

// Export configured multer
export const upload = multer({ storage });
