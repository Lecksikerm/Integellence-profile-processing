const express = require('express');
const profileController = require('../controllers/profileController');

const router = express.Router();

router.post('/profiles', profileController.createProfile);
router.get('/profiles/:id', profileController.getProfileById);
router.get('/profiles', profileController.getProfiles);
router.delete('/profiles/:id', profileController.deleteProfile);

module.exports = router;