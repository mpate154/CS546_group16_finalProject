import { Router } from "express";
const router = Router();
import validation from '../helper.js';
import xss from 'xss';
import users from '../data/users.js';
import exportedMethods from "../helper.js";
import { ObjectId } from "mongodb";
import incomeFunctions from "../data/income.js";
import { income } from "../config/mongoCollections.js";
import transactionFunctions from "../data/transactions.js";

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
  .route("/register")
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/home");
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

      if (
        !firstName ||
        !lastName ||
        !email ||
        !gender ||
        !city ||
        !state ||
        !age ||
        !balance ||
        !password ||
        !confirmPassword
      ) {
        return res
          .status(400)
          .render("register", { error: "All fields are required", ...data });
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
          throw "Passwords do not match.";
        }
      } catch (e) {
        return res.status(400).render("register", {
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
        return res.redirect("/login");
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
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/home");
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
      let { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .render("login", { error: "Missing email or password" });
      }
      email = email.toLowerCase();
      try {
        email = validation.checkEmail(email);
        password = validation.checkPassword(password);
      } catch (e) {
        return res.status(400).render("login", {
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
        fixedExpenses: user.fixedExpenses,
      };
      return res.redirect("/home");
    } catch (e) {
      return res.status(400).render("login", {
        error: "Either the userId or password is invalid",
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

router.route('/income')
  .get(async (req, res) => {
    if (req.session.user) {
      try {
        let month = exportedMethods.getCurrentMonth();
        let year = exportedMethods.getCurrentYear();
        let no_incomes = false;

        if (req.body.renderMonth) {
          req.body.renderMonth = xss(req.body.renderMonth);
          month = req.body.renderMonth.split("-")[1];
          year = req.body.renderMonth.split("-")[0];
          if (
            month.length != 2 ||
            parseInt(month) < 1 ||
            parseInt(month) > 12 ||
            year.length != 4 ||
            parseInt(year) < 2000 ||
            parseInt(year) > parseInt(exportedMethods.getCurrentYear())
          ) {
            throw "Invalid date format";
          }
        }
        let current_income_to_show = year + "-" + month;
        let p_date = exportedMethods.getMonthYearForFormMax();
        let f_date = exportedMethods.getFullDateForFormMax();
        let incomes = incomeFunctions.getIncomeByUserIdByMonthAndYear(
          req.session.user.id,
          month,
          year
        );

        //what to do if incomes is empty?
        if (incomes.length() == 0) {
          no_incomes = true;
        }

        res.render("income", {
          title: "income",
          home_or_summary: false,
          landing_signup_login: false,
          general_page: true,
          include_navbar: true,
          include_summary_navbar: false,
          income_objects: incomes,
          no_incomes: no_incomes,
          //shows the month/year the user picked on the month input
          current_income_date_to_show: current_income_to_show,
          partial_date: p_date,
          full_date: f_date,
        });
      } catch (e) {
        //what to do when error?
        console.log(e); // get rid of
        return res.status(500);
      }
    }
  })
  .post(async (req,res) => {
    //top date form to render incomes -> call get with new income value display (which will fetch automatically)
    try {
      if (req.body.form_type === "date_dropdown") {
        let month_year = req.body.income_month_and_year;
        let date = month_year.split("-");
        if (
          date[0].length !== 4 ||
          date[1].length !== 2 ||
          parseInt(date[1]) < 1 ||
          parseInt(date[1]) > 12 ||
          parseInt(date[0]) < 2000 ||
          parseInt(date[0]) < parseInt(getCurrentYear())
        ) {
          throw "Invalid date format";
        }
        //sends the month that the user chose to show to the get route
        res.redirect(`/income?month=${month_year}`);
      } //botton new income form
      else if (req.body.form_type === "new_income") {
        let {
          form_type,
          new_income_amount,
          new_income_date,
          new_income_description,
        } = req.body;
        let userId = exportedMethods.checkId(req.session.user);
        let amount = exportedMethods.checkAmount(xss(new_income_amount));
        //input type=date returns yyyy/mm/dd so we use flipDate to change format to mm/dd/yyyy
        let date = exportedMethods.flipDate(xss(new_income_date));
        date = exportedMethods.checkDate(date);
        let description = xss(new_income_description);
        if (description) {
          description = exportedMethods.checkString(description);
        } else description = "";

        let addedIncome = incomeFunctions.addIncome(
          userId,
          amount,
          date,
          description
        );
        if (addedIncome === null) {
          throw "Could not add income object.";
        } else {
          //rerender the page with the new income object.??
          return res.redirect("/income");
        }
      }
    } catch (e) {
       // what to do if error on post? client side might catch it and send error back to them.
    }
  })

  router.route("income/:uuid").delete( async (req, res) => {
    //make get income object and transaction object by uuid
    let uuid = xss(req.params.uuid);
  
    try {
      if (!uuid) {
        throw "Uuid not provided";
      }
      let deletedIncome = incomeFunctions.removeIncomeByUuid(uuid);
  
      res.redirect("/income");
    } catch (e) {
      //what to do if delete fails
      res.status(500);
    }
  }).put(async (req, res) => {
    
  });
  

router.route('/expense')
  .get(async (req, res) => {
    
    if (req.session.user) {
      try {
        let month = exportedMethods.getCurrentMonth();
        let year = exportedMethods.getCurrentYear();
        let no_transactions = false;

        req.body.renderMonth = xss(req.body.renderMonth);
        if (req.body.renderMonth) {
          month = req.body.renderMonth.split("-")[1];
          year = req.body.renderMonth.split("-")[0];
        }
        let current_transaction_to_show = year + "-" + month;
        let p_date = exportedMethods.getMonthYearForFormMax();
        let f_date = exportedMethods.getFullDateForFormMax();
        let transactions =
          transactionFunctions.getTransactionsByUserIdByMonthAndYear(
            req.session.user.id,
            month,
            year
          );

        //what to do if incomes is empty?
        if (transactions.length() == 0) {
          no_transactions = true;
        }

        //FINISH
        let categories = req.session.user.categories;

        res.render("expense", {
          title: "Expenses",
          home_or_summary: false,
          landing_signup_login: false,
          general_page: true,
          include_navbar: true,
          include_summary_navbar: false,
          income_objects: transactions,
          no_transactions: no_transactions,
          //shows the month/year the user picked on the month input
          current_transaction_date_to_show: current_transaction_to_show,
          category: categories,
          partial_date: p_date,
          full_date: f_date,
        });
      } catch (e) {
        //what to do when error?
        console.log(e); // get rid of
        return res.status(500);
      }
    }
  })
  .post(async (req, res) => {
    try {
      if (req.body.form_type === "date_dropdown") {
        let month_year = req.body.transaction_month_and_year;
        let date = month_year.split("-");
        if (date[0].length !== 4 || date[1].length !== 2) {
          throw "Invalid date format";
        }
        //sends the month that the user chose to show to the get route
        //do this or just put it in req.body.user?
        res.redirect(`/expense?month=${month_year}`);
      } //botton new income form
      else if (req.body.form_type === "new_transaction") {
        let {
          form_type,
          new_expense_amount,
          new_expense_date,
          new_expense_category,
          new_expense_description,
        } = req.body;
        let userId = exportedMethods.checkId(req.session.user);
        let amount = exportedMethods.checkAmount(xss(new_expense_amount));
        //input type=date returns yyyy/mm/dd so we use flipDate to change format to mm/dd/yyyy
        let date = exportedMethods.flipDate(xss(new_expense_date));
        let category = exportedMethods.checkString(xss(new_expense_category));
        date = exportedMethods.checkDate(date);
        let description = xss(new_expense_description);
        if (description) {
          description = exportedMethods.checkString(description);
        } else description = "";

        let addedTransaction = transactionFunctions.addTransaction(
          userId,
          amount,
          category,
          date,
          description
        );
        if (addedTransaction === null) {
          throw "Could not add transaction object.";
        } else {
          //rerender the page with the new income object.??
          return res.redirect("/expense");
        }
      }
    } catch (e) {
      console.log(e); // what to do if error on post? client side might catch it and send error back to them.
    }
  })
  .put(async (req,res) => {

  })
  router
  .route("expense/:uuid")
  .put(async (req, res) => {

  })
  .delete(async (req, res) => {
    //make get income object and transaction object by uuid
    let uuid = xss(req.params.uuid);

    try {
      if (!uuid) {
        throw "Uuid not provided";
      }
      let deletedTransaction =
        transactionFunctions.removeTransactionByUuid(uuid);

      res.redirect("/expense");
    } catch (e) {
      //what to do if delete fails
      res.status(500);
    }
  });

router.route('/account')
  .get(async (req, res) => {
    
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