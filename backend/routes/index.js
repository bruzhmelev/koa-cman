module.exports = router => {
  router.prefix('/v1');
  router.use('/', require('./users'));
  router.use('/users', require('./users'));
  router.use('/players', require('./players'));
  router.use('/auth', require('./auth'));
};
