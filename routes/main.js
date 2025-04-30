import {Router} from 'express';
const router = Router();
import validation from '../helper.js';

router.route('/') // landing 
  .get(async (req, res) => {
  
});
router
  .route('/register')
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect('/home');
    }
    return res.render('register', { 
      title: 'Register Page'});
  })
  .post(async (req, res) => {
    try {
      const data = req.body;
      const { firstName, lastName, email, gender, city, state, age, balance, password, confirmPassword} = data;

      if (!firstName || !lastName || !email || !gender || !city || !state || !age || !balance || !password || !confirmPassword) {
        return res.status(400).render('register', { error: 'All fields are required', ...data });
      }

      try {
        firstName = validation.checkFirstName(firstName);
        lastName = validation.checkLastName(lastName);
        email = validation.checkEmail(email);
        gender = validation.checkString(gender);
        city = validation.checkString(city);
        state = validation.checkString(state);
        age = validation.checkAge(age);
        balance = validation.checkBalance(balance);
        password = validation.checkPassword(password);
        confirmPassword = validation.checkPassword(confirmPassword);

        if (password !== confirmPassword) {
          throw 'Passwords do not match.';
        }
      } catch (e) {
        return res.status(400).render('register', {
          error: e,
          firstName,
          lastName,
          gender,
          city,
          state,
          age,
          balance,
          title: 'Register Page'
        });
      }

      const result = await register(
        xss(firstName),
        xss(lastName),
        xss(gender),
        xss(city),
        xss(state),
        xss(age),
        xss(balance),
        xss(password)
      );

      if (result && result.registrationCompleted) {
        return res.redirect('/login');
      } else {
        return res.status(500).render('register', { 
          error: 'Internal Server Error',
          title: 'Register Page'});
      }
    } catch (e) {
      return res.status(400).render('register', { error: e,
        title: 'Register Page'
       });
    }
});

router
  .route('/login')
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect('/home');
    }
    return res.render('login',{
      title:'Login Page'});
  })
  .post(async (req, res) => {
    try {
      let { email , password } = req.body;
      
      if (!email || !password) {
        return res.status(400).render('login', { error: 'Missing email or password' });
      }
      email = email.toLowerCase();
      try {
        email = validation.checkEmail(email);
        password = validation.checkPassword(password);

      } catch (e) {
        return res.status(400).render('login', {
          error: e,
          ...req.body,
          title:'Login Page',
        });
      }
      const user = await login(xss(email), xss(password));
      req.session.user = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        city: user.city,
        state: user.state,
        age: user.age,
        balance: user.balance,
        categories: user.categories,
        fixedExpenses: user.fixedExpenses
      };
      return res.redirect('/home');
    } catch (e) {
      return res.status(400).render('login', { 
        error: 'Either the userId or password is invalid',
        ...req.body,
        title:'Login Page'
      });
    }
  });

router.route('/income')
  .get(async (req, res) => {
  
  })
  .post(async (req,res) => {

  })
  .put(async (req,res) => {

  })
  .delete(async (req,res)=>{

  });

router.route('/expense')
  .get(async (req, res) => {
  
  })
  .post(async (req,res) => {

  })
  .put(async (req,res) => {

  })
  .delete(async (req,res)=>{

  });

router.route('/account')
  .get(async (req, res) => {
  
  })
  .post(async (req,res) => {

  })
  .put(async (req,res) => {

  })
  .delete(async (req,res)=>{

  });

router.route('/setting')
  .get(async (req, res) => {
  
  })
  .post(async (req,res) => {

  })
  .put(async (req,res) => {

  })
  .delete(async (req,res)=>{

  });