const Router = require('koa-router');
const router = new Router();
const Ctrl = require('../controllers/actions');

router.post('/allocatePoint', Ctrl.allocatePoint);
router.post('/rest', Ctrl.rest);
router.post('/startOrders', Ctrl.startOrders);
router.post('/addOrder', Ctrl.addOrder);
router.post('/finishOrders', Ctrl.finishOrders);
router.post('/startTrip', Ctrl.startTrip);
router.post('/goHome', Ctrl.goHome);
router.post('/makeChoice', Ctrl.makeChoice);
router.post('/nextEvent', Ctrl.nextEvent);

module.exports = router.routes();
