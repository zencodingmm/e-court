const router = require('express').Router();
const { getAllHandler, createHandler, getByHandler, deleteHandler, updateHandler } = require('./controller');

router.route('/').get(getAllHandler).post(createHandler);
router.route('/:id').put(updateHandler).delete(deleteHandler);
router.route('/search').get(getByHandler);

module.exports = router;
