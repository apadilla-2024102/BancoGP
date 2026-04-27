const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { notificationSchema } = require('../validators/reportValidator');

router.post('/', async (req, res, next) => {
  try {
    const { error, value } = notificationSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }
    notificationController.sendNotification(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/:userId', notificationController.getNotifications);
router.put('/:notificationId/read', notificationController.markAsRead);
router.post('/alerts', notificationController.createAlert);

module.exports = router;
