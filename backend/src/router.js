const router = require('express').Router();

const eFillingRoute = require('./e-filling/route');

router.use(eFillingRoute);

module.exports = router;