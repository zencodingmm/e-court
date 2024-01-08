const router = require('express').Router();

// ----- E Document ---- //
const eDocRoute = require('./components/e_doc/route');
const attachmentRoute = require('./components/attachment/route');

router.use('/api/e_doc', eDocRoute);
router.use('/api/attachment', attachmentRoute);
// --------------------

// ----- User ---- //
const userTypeRoute = require('./components/users/user_type/route');
const userRoute = require('./components/users/user/route');

router.use('/api/user_type', userTypeRoute);
router.use('/api/user', userRoute);
// --------------------

// ----- Setting ---- //
const settingRoute = require('./components/setting/route');

router.use('/api/setting', settingRoute);
// --------------------

// ----- Auth ---- //
const AuthRoute = require('./components/auth/route');

router.use('/api/auth', AuthRoute);
// --------------------

// ----- E Vote ---- //
const eVoteRoute = require('./components/e_votes/e_vote/route');
const eVoteAttachmentRoute = require('./components/e_votes/e_vote_attachment/route');
const eVoteResultRoute = require('./components/e_votes/e_vote_result/route');

router.use('/api/e_vote', eVoteRoute);
router.use('/api/e_vote_attachment', eVoteAttachmentRoute);
router.use('/api/e_vote_result', eVoteResultRoute);
// --------------------

module.exports = router;
