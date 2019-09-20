const router = require('express').Router();
const bcrypt = require('bcryptjs');
const secrets = require('../config/secrets.js');
const jwt = require('jsonwebtoken');
const restricted = require('./authenticate-middleware.js');

const Users = require('./auth-model.js')

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hash = bcrypt.hashSync(password, 8);

  Users.insert({username, password: hash})
    .then(user => res.status(201).json(user))
    .catch(err => {
      console.log(err);
      res.status(500).json({error: 'Could not create user'});
    });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if(username && password) {
    Users.getByUsername(username)
      .then(user => {
        if(user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({
            message: `Welcome, ${user.username}`,
            token
          });
        } else {
          res.status(401).json({message: 'Invalid credentials'});
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({error: 'Could not log in'});
      });
  };
});

router.get('/', restricted, (req, res) => {
  Users.get()
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.log(err);
      res.status(500).json({error: 'Could not get users'});
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
      expiresIn: '1d'
  };
  return jwt.sign(payload, secrets.jwtSecret, options);
}

module.exports = router;
