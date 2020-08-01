const router = require('express').Router();
let Post = require('../models/postModel');
const isAdmin= require('../util/admin');
const isAuth = require('../util/auth');



router.get('/', async (req, res) => {
  const post = await Post.find()
  if(!post) return res.status(400).json('there is no post');
  res.json(post);
});


router.get('/:id',  async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) return res.status(404).json('The post with the given ID was not found.');

  res.json(post);
});

router.post('/',[isAuth,isAdmin] , async (req, res) => {
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    bodytext:req.body.bodytext,
    image: req.body.image
  });
  const newPost = await post.save();
  if (newPost) {
    return res
      .status(200)
      .json({ message: 'New Post Created', data: newPost });
  }
  return res.status(500).send({ message: ' Error in Creating Post.' });
});

router.put('/:id', [isAuth,isAdmin] ,async (req, res) => {
  const postId=req.params.id;
  const post = await Post.findByIdAndUpdate(postId, { 
    title: req.body.title,
    description: req.body.description,
    bodytext:req.body.bodytext,
    image: req.body.image,
     }, {
    new: true
  });

  if (!post) return res.status(404).json('The post with the given ID was not found.');
  
  res.json(post);
});

router.delete('/:id', [isAuth,isAdmin] , async (req, res) => {
  const deletedPost = await Post.findById(req.params.id);
  if (deletedPost) {
    await deletedPost.remove();
    res.send({ message: 'Post Deleted' });
  } else {
    res.send('Error in Deletion.');
  }
});

module.exports = router;