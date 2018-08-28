const Router = require('koa-router');
const router = new Router();
const Ctrl = require('../controllers/players');

router.get('/', Ctrl.findAll);
router.post('/', Ctrl.create);
router.post('/:id', Ctrl.update);
router.delete('/:id', Ctrl.destroy);

module.exports = router.routes();
