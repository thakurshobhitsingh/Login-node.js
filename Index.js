const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));


app.set('view engine', 'ejs');


app.use(session({
  secret: '123', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));


const users = [
  {
    userId: 1,
    name: 'Vinay',
    email: 'vinay@gmail.com',
    password: '123'
  }
];


const checkAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
};


app.get('/', (req, res) => {
  res.render('homepage');
});


app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    req.session.userId = user.userId;
    res.redirect('/profile');
  } else {
    res.render('login', { error: 'Invalid email or password' });
  }
});


app.get('/profile', checkAuth, (req, res) => {
  const user = users.find(u => u.userId === req.session.userId);
  res.render('profile', { name: user.name });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
