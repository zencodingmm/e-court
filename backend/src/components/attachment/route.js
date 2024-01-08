const router = require('express').Router();
const { getAllHandler, createHandler, getByHandler, deleteHandler } = require('./controller');

router.route('/').get(getAllHandler).post(createHandler);
router.route('/:id').delete(deleteHandler);
router.route('/search').get(getByHandler);

module.exports = router;
