const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { uploadToCloudinary } = require('../utils/cloudinary');

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ningún archivo' });
    }

    const folderName = req.body.folder || 'general';
    const result = await uploadToCloudinary(req.file.buffer, folderName);
    
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Error en /api/upload:', error);
    res.status(500).json({ error: 'Error al subir el archivo' });
  }
});

module.exports = router;
