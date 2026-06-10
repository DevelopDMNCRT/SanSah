const multer = require('multer');

// Usamos memoryStorage porque mandaremos el buffer directamente a Cloudinary
const storage = multer.memoryStorage();

// Solo permitimos imágenes (opcional pero recomendado)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no soportado. Solo se permiten imágenes.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB por archivo
  },
});

module.exports = upload;
