const bcrypt  = require('bcryptjs');
const User = require('../models/users');
const  Post  = require('../models/posts');
const jwt = require('jsonwebtoken');
var dotenv = require('dotenv').config();


/*A NEW USER CAN REISTER */
const  signup = (req,  res,  next) => {
  const{  name, email,  password } = req.body;
  console.log(password);
  User.findOne({email},  (err, data) => {
    if(data) {
      return res.status(404).json({
        message:  'There  is an existing user with this  email address'
      })
    }else {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
          console.log(err);
          const  newUser  = new User({
            name,
            password: hash,
            email
          })
          newUser.save((err) => {
            if (err) {
              return next(err)
            }else{
              return res.status(201).json({
                message: 'Thank you for signing up  on our Blog'
              })
            }
          })
        })
       })
    }
  })
};


/* A  REGISTERED USER CAN LOGIN AND GET AN AUTHORIZTION TOKEN */
const login =  (req,  res,  next) => {
 const {email, password } =req.body;
  User.findOne({ email }, (err, data) => {
    if(err)  {
      next(err)
    };
    if(!data){
      return res.status(401).json({
        message: 'user does not exist'
      })
    }else{
      bcrypt.compare(password, data.password, (err,  match) =>  {
        if(!match) {
          return res.status(401).json({
            message: 'invalid login details'
          })
        }else{
          const token  = jwt.sign({ isAdmin: data.isAdmin}, process.env.SECRET, {expiresIn: "7h"})
          return res.status(200).json({
            message: 'login successful',
            token
          })
        }
      })
    }
  })
};


/* GETTING TOTAL REGISTERED USERS */
const total = (req,  res,  next) => {
    User.find({},  (err, data, next) => {
        if(err) next(next);
        else{
          return res.status(200).json({data})
        }
    })
};


/*  UPDATING A PARTICULAR USER TO BEIGN AN ADMIN */
const  updateUser  = (req,  res,  next)  => {
    User.findByIdAndUpdate(req.params.id, {isAdmin:  true}, (err) => {
      if(err) next(next);
      else{
        return res.status(200).json('Admin status Updated successfully')
      }
    })
}



module.exports = { signup, login, total, updateUser };