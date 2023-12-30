const router = require('express').Router();
const { getAllHandler, createHandler, getByHandler } = require('./controller');

router.route('/').get(getAllHandler).post(createHandler);
router.route('/search').get(getByHandler);

module.exports = router;
