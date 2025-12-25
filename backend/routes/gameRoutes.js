const express = require('express');
const router = express.Router();
const controller = require('../controllers/gameController');

router.post('/create', controller.createGame);
router.post('/join', controller.joinGame);
router.post('/leave', controller.leaveGame);
router.get('/state', controller.getGameState);

router.post('/order', controller.placeOrder);
router.post('/start', controller.startGame);
router.post('/reset', controller.resetGame);

router.post('/admin/advance', controller.forceNextStage);
router.post('/admin/login', controller.verifyAdmin);

module.exports = router;