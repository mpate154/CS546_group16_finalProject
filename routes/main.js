import {Router} from 'express';
const router = Router();
import validation from '../helpers.js';
import xss from 'xss';

import users from '../data/users.js';
import yearlyFunctions from '../data/yearlySummary.js';

router.route('/') // landing 
  .get(async (req, res) => {
    try {
      const user = req.session.user;
      if (!user) {
        // Not logged in
        return res.render('landing', {
          title: 'Home Page',
          isLoggedIn: false,
          home_or_summary: false,
          landing_signup_login: true,
          general_page: false,
          include_navbar: false,
          include_summary_navbar: false
        });
      } else  {
        return res.render('landing', {
          title: 'Home Page',
          isLoggedIn: true,
          home_or_summary: false,
          landing_signup_login: true,
          general_page: false,
          include_navbar: false,
          include_summary_navbar: false
        });
      } 
    } catch (e) {
      return res.status(500).send('Internal Server Error');
    }
  
});

router
  .route('/register')
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect('/home');
    }
    return res.render('register', { 
      title: 'Registeration Page',
      home_or_summary: false,
      landing_signup_login: true,
      general_page: false,
      include_navbar: false,
      include_summary_navbar: false,
      partial: 'registration_script'
    });
  })
  .post(async (req, res) => {
    try {
      const data = req.body;
      let { firstName, lastName, email, gender, city, state, age, balance, password, confirmPassword} = data;

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
        age = validation.checkNumber(age);
        balance = validation.checkAmount(balance);
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
          title: 'Registration Page',
          home_or_summary: false,
          landing_signup_login: true,
          general_page: false,
          include_navbar: false,
          include_summary_navbar: false,
          partial: 'registration_script'
        });
      }

      const result = await users.register(
        xss(firstName),
        xss(lastName),
        xss(email),
        xss(gender),
        xss(city),
        xss(state),
        xss(age),
        xss(password),
        xss(balance)
      );

      if (result && result.registrationCompleted) {
        return res.redirect('/login');
      } else {
        return res.status(500).render('register', { 
          error: 'Internal Server Error',
          title: 'Registration Page',
          isLoggedIn: false,
          home_or_summary: false,
          landing_signup_login: true,
          general_page: false,
          include_navbar: false,
          include_summary_navbar: false,
          partial: 'registration_script'
        });
      }
    } catch (e) {
      return res.status(400).render('register', { 
        error: e,
        title: 'Registration Page',
        isLoggedIn: false,
        home_or_summary: false,
        landing_signup_login: true,
        general_page: false,
        include_navbar: false,
        include_summary_navbar: false,
        partial: 'registration_script'
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
      title: 'Login Page',
      home_or_summary: false,
      landing_signup_login: true,
      general_page: false,
      include_navbar: false,
      include_summary_navbar: false,
      partial: 'registration_script'
    });
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
          title: 'Login Page',
          home_or_summary: false,
          landing_signup_login: true,
          general_page: false,
          include_navbar: false,
          include_summary_navbar: false,
          partial: 'registration_script'
        });
      }
      const user = await users.login(xss(email), xss(password));

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
        title: 'Login Page',
        home_or_summary: false,
        landing_signup_login: true,
        general_page: false,
        include_navbar: false,
        include_summary_navbar: false,
        partial: 'registration_script'
      });
    }
  });

router.route('/signout').get(async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  req.session.destroy();
  return res.render('signout',{
    title:'Signout Page',
    home_or_summary: false,
    landing_signup_login: true,
    general_page: false,
    include_navbar: false,
    include_summary_navbar: false,
  });
});

router.route('/home')
  .get(async (req, res) => {
    if (!req.session.user) return res.redirect('/login');

    const user = req.session.user;

    const now = new Date();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const currentDate = now.toLocaleDateString('en-US');

    return res.render('home',{
      title: 'Monthly Summary',
      home_or_summary: true,
      landing_signup_login: false,
      general_page: true,
      include_navbar: true,
      include_summary_navbar: true,
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
      fixedExpenses: user.fixedExpenses,
      currentDate,
      currentTime
    })
  
  });


  // router.route('/')
  // .get(async (req, res) => {
  
  // });

router.route('/yearlySummary/:userId/:year')
  .get(async (req, res) => {
    try {
        const {userId, year} = req.params;
        //make sure this actually error checks 
        validation.checkUserId(userId);
        validation.checkYear(year);
        const summ = await yearlyFunctions.getYearlySummary(userId, year);
        res.render('yearlySummary', {
            title: "Yearly summary", 
            userId: summ.userId, 
            year: summ.year, 
            breakdown: summ.totalSpentPerCategory,
            totalSpentPerCategory: JSON.stringify(summ.totalSpentPerCategory), 
            totalIncome: summ.totalIncome, 
            totalFixedExpenses: summ.totalFixedExpenses, 
            totalVariableExpenses: summ.totalVariableExpenses, 
            home_or_summary: true, 
            landing_signup_login: false, 
            general_page: false, 
            include_navbar: true, 
            include_summary_navbar: true});
    } catch (e) {
        console.log("route error: ", e);
        res.status(404).render("yearlySummary", {error: e});
    }
  })
  .post(async (req,res) => {

  })
  .put(async (req,res) => {

  })
  .delete(async (req,res)=>{

  });
export default router;