const router = require('express').Router();
const { loginHandler } = require('./controller');

router.route('/').post(loginHandler);

module.exports = router;
