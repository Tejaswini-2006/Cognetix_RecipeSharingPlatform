const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `recipe-${cleanBase}-${uniqueSuffix}${ext}`);
  }
});

// File filter for allowed extensions and MIME types
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp/;
  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedExtensions.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only JPG, JPEG, PNG, and WEBP image files are allowed.'
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max file size
  },
  fileFilter: fileFilter
});

// Safe helper to delete uploaded image file
const deleteImageFile = (imagePath) => {
  if (!imagePath || typeof imagePath !== 'string') return;
  // Never delete default placeholder or external images
  if (
    imagePath.includes('default-recipe') ||
    imagePath.startsWith('http://') ||
    imagePath.startsWith('https://')
  ) {
    return;
  }

  try {
    const filename = path.basename(imagePath);
    const fullPath = path.join(uploadsDir, filename);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`[Upload Cleaned]: Deleted ${filename}`);
    }
  } catch (err) {
    console.error(`[Upload Clean Error]: Unable to delete ${imagePath}:`, err.message);
  }
};

module.exports = {
  upload,
  deleteImageFile
};
