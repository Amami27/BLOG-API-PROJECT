var express = require('express');
var router = express.Router();
const controllerx = require('../controllers/user');
const controllery = require('../controllers/post');
const authorization = require('../middleware/token');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).json({
    message:  'Welcome to our  Blog API'
  });
});


router.post('/login', controllerx.login );
router.post('/signup', controllerx.signup );
router.get('/total', controllerx.total );
router.put('/updateuser/:id', controllerx.updateUser );
router.post('/create', authorization, controllery.createPost );
router.get('/allpost', authorization, controllery.getAllPost);
router.get('/singlepost/:id', authorization, controllery.getParticularPost);
router.put('/updatepost/:id', authorization, controllery.updatePost );



module.exports = router;
