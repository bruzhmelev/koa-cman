const Router = require('koa-router');
const router = new Router();
const Ctrl = require('../controllers/actions');

router.post('/', Ctrl.run);
// router.post('/', Ctrl.allocatePoint);
// router.post('/:id', Ctrl.rest);
// router.post('/:id', Ctrl.startOrders);
// router.post('/:id', Ctrl.addOrder);
// router.post('/:id', Ctrl.finishOrders);
// router.post('/:id', Ctrl.startTrip);
// router.post('/:id', Ctrl.goHome);
// router.post('/:id', Ctrl.makeChoice);
// router.post('/:id', Ctrl.nextEvent);

module.exports = router.routes();
