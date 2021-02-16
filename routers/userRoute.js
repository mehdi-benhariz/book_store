const router = require('express').Router();
const {test} = require('../controllers/userConteroller');

router.get('/',test );

module.exports = router;