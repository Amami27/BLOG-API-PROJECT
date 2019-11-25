const  Post  = require('../models/posts')
const User = require('../models/users');
const jwt = require('jsonwebtoken');
var dotenv = require('dotenv').config();


/* AUTHORIZED USER CAN CREATE BLOG POSTS */
const  createPost = (req, res,  next) => {
    const{  title, content,  slug } = req.body;
    console.log(title);
    Post.findOne({title},  (err, data) => {
        if(data) {
          return res.status(404).json({
            message:  'Blog post title already exist, choose another  title'
          })
        }else {
            const  newPost  = new Post({
                title,
                content,
                slug
            })
            newPost.save((err) => {
                if (err) {
                    return next(err)
                }else{
                    return res.status(201).json({
                        message: 'Blog post created successfully'
                    })
                }
            })
        }
    })
};


/* AUTHORIZED USER CAN VIEW ALL BLOG POSTS */
const getAllPost = (req, res, next) => {
    Post.find({}, (err, data) => {
        if (err) next(err)
        else {
            res.status(200).json({
                message: 'Posts returned sucessfully',
                data
            })
        }
    })
}

/* AUTHORIZED USER CAN VIEW SPECIFIC BLOG POSTS */
const getParticularPost = (req, res, next) => {
    // const { title, content, slug } = req.body;
    // Post.findOne({ title }, (err, data) => {
    // if (err) next(err)
    // if (!data) {
    // return res.status(401).json({
    // message: 'Post does not exist'
    // })
    // } else {
    // return res.status(200).json({ data })
    // }
    // })
    
    Post.findById(req.params.id, (err, data, next) => {
        if (err) next(next);
        else {
            return res.status(200).json({ data })
        }
    })
}

/* ADMIN TO UPDATE POSTS */
const updatePost = (req, res, next) => {
    if (!req.admin) {
    return res.status(401).json({
        message: "You need to be an admin to edit or delete stories"
        });
    }else{
        const id = req.params.id
        const { title, content, slug } = req.body
        Post.findOne({ _id: id }, (err, data) => {
            if (err) next(err);
            if (!data) {
                return res.status(404).json({
                    message: "Post not found"
                })
            }else{
                if (title) {
                    data.title = title;
                }
                if (content) {
                    data.content = content;
                }
                if (slug) {
                    data.slug = slug;
                }
                
                data.save((err, editedPost) => {
                    if (err) {
                        next(err)
                    }else{
                        res.status(200).send(editedPost);
                    }
                })
            }
        })
    }
}


module.exports = { createPost, getAllPost, getParticularPost, updatePost };