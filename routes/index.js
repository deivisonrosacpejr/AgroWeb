var express = require('express');
const firebase = require('firebase');
var hbs = require('handlebars');
var nodemailer = require('nodemailer');
var router = express.Router();
const database =  require('firebase/database');


/* GET home page. */
router.get('/', function(req, res, next){
  res.render('index', { title: 'Express', layout: "layout"});
});

router.get('/success', (req, res, next) => {
  res.render('success', { title: 'Login Sucessful!'});
});

router.get('/email', (req, res, next) => {
  res.render('email', { title: 'Contacte-nos!'});
});

router.get('/newuser', (req,res,next) => {
  res.render('newuser', { title: 'Cadastre-se!'})
});

router.get('/newsletter', (req,res,next) => {
  res.render('newsletter', { title: 'Newsletter'})
});

router.post('/login',(req,res,next) => {
  const email = req.body.email;
  const password = req.body.password;
  firebase.auth().signInWithEmailAndPassword(email,password)
  .then((user) => {
    res.redirect('/newsletter');
  }).catch((error) => {
      res.redirect('/newuser');
  });
});

router.post('/userconfig', (req,res,next) => {
  const usermail = req.body.usermail;
  const userpassword = req.body.userpassword;
  firebase.auth().createUserWithEmailAndPassword(usermail,userpassword)
  .then((user) => {
    res.redirect('/usercadastrated');
  }).catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    res.redirect('/');
  });
});

router.post('/newsletterdatabase', (req,res,next) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const date = req.body.date;
  function writeUserData(firstaname, lastname, email){
    firebase.database().ref('newsletter/'+ firstname).set({
      first_name: firstname,
      last_name: lastname,
      mail: email,
    });
  }
  writeUserData(firstname, lastname, email);
});

router.post('/contact',(req,res,next) => {
  const clientname = req.body.clientname;
  const clientemail = req.body.email;
  const content = req.body.content;
  const clientsubject = req.body.clientsubject;

  //console.log('%s', clientname);
  //console.log('%s', clientemail);
  //console.log('%s', content);

  var transporte = nodemailer.createTransport({
    host: 'mail.megapool.com.br',
    port: '587',
    secure: false,
    auth: {
      user: 'admcpejr@megapool.com.br',
      pass: 'Cpejr@2018'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  // Algumas configurações padrões para nossos e-mails
  var config = {
    from: 'admcpejr@megapool.com.br',
    to: clientemail,
    subject: clientsubject,
    text: content
  };
    // Hora de disparar o e-mail usando as configurações pré
    // definidas e as informações pessoas do usuário
  transporte.sendMail(config, function (error, info){
    if (error){
      console.log(error);
    }else{
      console.log('Email enviado' + info.response);
      res.redirect('/success');
    }
  });

  // Precisamos chamar a função que criamos
  // passando o primeiro lugar da fila no array


});

module.exports = router;
