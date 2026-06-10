require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Configuración de Cloudinary usando las variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Sube un archivo a Cloudinary en la carpeta correspondiente dentro de 'SanSah'
 * @param {Buffer} fileBuffer - El buffer del archivo a subir (proveniente de multer memory storage)
 * @param {String} folderName - El nombre de la subcarpeta (ej. 'productos', 'categorias')
 * @returns {Promise<Object>} Promesa que se resuelve con el resultado de la subida
 */
const uploadToCloudinary = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    // Definimos la carpeta base como 'SanSah' y agregamos la subcarpeta
    const folderPath = `SanSah/${folderName}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderPath,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary
};
