const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', upload.single('addressProof'), authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.use(verifyToken);
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);

module.exports = router;
