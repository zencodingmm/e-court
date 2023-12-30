const router = require('express').Router();

const eDocRoute = require('./components/e_doc/route');
const userTypeRoute = require('./components/users/user_type/route');
const userRoute = require('./components/users/user/route');
const eVoteRoute = require('./components/e_votes/e_vote/route');

router.use('/api/e_doc', eDocRoute);
router.use('/api/user_type', userTypeRoute);
router.use('/api/user', userRoute);
router.use('/api/e_vote', eVoteRoute);

module.exports = router;
