import {Router} from 'express';
const router = Router();
import validation from '../helpers.js';
import xss from 'xss';

import users from '../data/users.js';


//---------------------------- Landing Routes ----------------------------// 
router.route('/') // landing 
  .get(async (req, res) => {
    try {
      const user = req.session.user;
      if (!user) {
        // Not logged in
        return res.render('landing', {
          title: 'Home Page',
          settings_page: false,
          isLoggedIn: false,
          home_or_summary: false,
          landing_signup_login: true,
          general_page: false,
          include_navbar: false,
          include_summary_navbar: false,
          partial: false
        });
      } else  {
        return res.render('landing', {
          title: 'Home Page',
          settings_page: false,
          isLoggedIn: true,
          home_or_summary: false,
          landing_signup_login: true,
          general_page: false,
          include_navbar: false,
          include_summary_navbar: false,
          partial: false
        });
      } 
    } catch (e) {
      return res.status(500).send('Internal Server Error');
    }
  
});

//---------------------------- Register Routes ----------------------------// 
router.route('/register')
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect('/home');
    }
    return res.render('register', { 
      title: 'Registration Page',
      settings_page: false,
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

        if(parseInt(age) < 13){
          throw `Users must be at least 13 years old to sign up.`;
        }
        
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
          settings_page: false,
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
          settings_page: false,
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
        settings_page: false,
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

//----------------------------- Login Routes -----------------------------// 
router.route('/login')
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect('/home');
    }
    return res.render('login',{
      title: 'Login Page',
      settings_page: false,
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
          settings_page: false,
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
        error: 'Either the email or password is invalid',
        ...req.body,
        title: 'Login Page',
        settings_page: false,
        home_or_summary: false,
        landing_signup_login: true,
        general_page: false,
        include_navbar: false,
        include_summary_navbar: false,
        partial: 'registration_script'
      });
    }
  });

//---------------------------- Signout Routes ----------------------------// 
router.route('/signout').get(async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  req.session.destroy();
  return res.render('signout',{
    title:'Signout Page',
    settings_page: false,
    home_or_summary: false,
    landing_signup_login: true,
    general_page: false,
    include_navbar: false,
    include_summary_navbar: false,
    partial: false
  });
});


//--------------------------- Settings Routes ---------------------------// 
router.route('/settings')
  .get(async (req, res) => {
    try {
      const user = req.session.user;
      if (!user) return res.redirect('/login');
      return res.render('settings', {
        title: 'Settings',
        isLoggedIn: true,
        home_or_summary: false,
        landing_signup_login: false,
        general_page: true,
        include_navbar: true,
        include_summary_navbar: false,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
        city: user.city,
        state: user.state,
        age: user.age,
        balance:user.balance,
        categories: user.categories,
        fixedExpenses: user.fixedExpenses,
        partial: 'settings_script',
        settings_page: true,
      });
    } catch (e) {
      return res.status(500).send('Internal Server Error');
    }
});

//----------------------- Update User Information -----------------------//
router.put('/settings/updateUser', async (req, res) => {
  try {
    const { firstName, lastName, email, gender, city, state, age, balance } = req.body;
    const userId = req.session.user.id;
    await users.updateUserPut(
      userId,
      xss(firstName),
      xss(lastName),
      xss(email),
      xss(gender),
      xss(city),
      xss(state),
      xss(age),
      xss(balance)
    );

    const updatedUser = await users.getUserById(userId);
    req.session.user = {
      id: updatedUser._id.toString(),
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      gender: updatedUser.gender,
      city: updatedUser.city,
      state: updatedUser.state,
      age: updatedUser.age,
      balance: updatedUser.balance,
      categories: updatedUser.categories,
      fixedExpenses: updatedUser.fixedExpenses 
    };
    
    res.status(200).json({ success: true, message: "User Information Updated Successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not update user information' });
  }
});

//----------------------- Add Fixed Expense -----------------------//
router.post('/settings/addFixedExpense', async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.redirect('/login');
    const { title, category, amount } = req.body;
    const newExpense = await users.addFixedExpensesById(user.id, xss(title), xss(category), (xss(amount)));

    const updatedUser = await users.getUserById(user.id);
    req.session.user = {
      id: updatedUser._id.toString(),
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      gender: updatedUser.gender,
      city: updatedUser.city,
      state: updatedUser.state,
      age: updatedUser.age,
      balance: updatedUser.balance,
      categories: updatedUser.categories,
      fixedExpenses: updatedUser.fixedExpenses 
    };

    res.status(200).json(newExpense);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not add fixed expense' });
  }
});

//----------------------- Edit Fixed Expense -----------------------//
router.put('/settings/updateFixedExpense/:id', async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.redirect('/login');
    const { title, category, amount } = req.body;
    await users.updateFixedExpenseById(
      user.id,
      req.params.id,
      xss(title),
      xss(category),
      xss(amount)
    );

    const updatedUser = await users.getUserById(user.id);

    req.session.user = {
      id: updatedUser._id.toString(),
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      gender: updatedUser.gender,
      city: updatedUser.city,
      state: updatedUser.state,
      age: updatedUser.age,
      balance: updatedUser.balance,
      categories: updatedUser.categories,
      fixedExpenses: updatedUser.fixedExpenses 
    };

    res.status(200).json({ success: true, message: "Fixed Expense Updated" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not update fixed expense' });
  }
});
router.get('/settings/getFixedExpense/:id', async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const userData = await users.getUserById(user.id);
    const expense = userData.fixedExpenses.find(e => e._id.toString() === req.params.id);

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not fetch expense" });
  }
});

//----------------------- Delete Fixed Expense -----------------------//
router.delete('/settings/deleteFixedExpense/:id', async (req, res) => {
  try {
    const user = req.session.user;
    await users.deleteFixedExpenseById(user.id, req.params.id);

    const updatedUser = await users.getUserById(user.id);
    req.session.user = {
      id: updatedUser._id.toString(),
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      gender: updatedUser.gender,
      city: updatedUser.city,
      state: updatedUser.state,
      age: updatedUser.age,
      balance: updatedUser.balance,
      categories: updatedUser.categories,
      fixedExpenses: updatedUser.fixedExpenses 
    };

    res.status(200).json({ success: true, message: "Fixed Expense Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not delete fixed expense' });
  }
});

//----------------------- Add Category -----------------------//
router.post('/settings/addCategory', async (req, res) => {
  try {
    const user = req.session.user;
    const { category } = req.body;
    await users.addCategoryById(user.id, xss(category));

    const updatedUser = await users.getUserById(user.id);
    req.session.user = {
      id: updatedUser._id.toString(),
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      gender: updatedUser.gender,
      city: updatedUser.city,
      state: updatedUser.state,
      age: updatedUser.age,
      balance: updatedUser.balance,
      categories: updatedUser.categories,
      fixedExpenses: updatedUser.fixedExpenses 
    };


    res.status(200).json({ success: true, message: "Category Added" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not add category' });
  }
});

//----------------------- Delete Category -----------------------//
router.delete('/settings/deleteCategory', async (req, res) => {
  try {
    const user = req.session.user;
    const { category } = req.body;
    await users.deleteCategoryById(user.id, xss(category));

    const updatedUser = await users.getUserById(user.id);
    req.session.user = {
      id: updatedUser._id.toString(),
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      gender: updatedUser.gender,
      city: updatedUser.city,
      state: updatedUser.state,
      age: updatedUser.age,
      balance: updatedUser.balance,
      categories: updatedUser.categories,
      fixedExpenses: updatedUser.fixedExpenses 
    };
    res.status(200).json({ success: true, message: "Category Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not delete category' });
  }
});

//---------------------------- Home Routes ----------------------------// 
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
      currentTime,
      settings_page: false,
      partial: false
    })
  
});


export default router;