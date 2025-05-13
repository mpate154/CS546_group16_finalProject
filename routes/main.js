import { Router } from "express";
const router = Router();
import validation from "../helpers.js";
import xss from "xss";
import users from "../data/users.js";
import exportedMethods from "../helpers.js";
import { ObjectId } from "mongodb";
import incomeFunctions from "../data/income.js";
import { income } from "../config/mongoCollections.js";
import transactionFunctions from "../data/transactions.js";
import monthlySummaryFunctions from '../data/monthlySummary.js';
import yearlyFunctions from "../data/yearlySummary.js";


//---------------------------- Landing Routes ----------------------------//
router
  .route("/") // landing
  .get(async (req, res) => {
    try {
      const user = req.session.user;
      if (!user) {
        // Not logged in
        return res.render("landing", {
          title: "Home Page",
          settings_page: false,
          isLoggedIn: false,
          home_or_summary: false,
          landing_signup_login: true,
          general_page: false,
          include_navbar: false,
          include_summary_navbar: false,
          partial: false,
          include_footer: false,
        });
      } else {
        return res.render("landing", {
          title: "Home Page",
          settings_page: false,
          isLoggedIn: true,
          home_or_summary: false,
          landing_signup_login: true,
          general_page: false,
          include_navbar: false,
          include_summary_navbar: false,
          partial: false,
          include_footer: false,

        });
      }
    } catch (e) {
      return res.status(500).send("Internal Server Error");
    }
  });


//---------------------------- Register Routes ----------------------------//
router
  .route("/register")
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/home");
    }
    return res.render("register", {
      title: "Registration Page",
      settings_page: false,
      home_or_summary: false,
      landing_signup_login: true,
      general_page: false,
      include_navbar: false,
      include_summary_navbar: false,
      partial: "registration_script",
      include_footer: false,
    });
  })
  .post(async (req, res) => {
    try {
      const data = req.body;
      let {
        firstName,
        lastName,
        email,
        gender,
        city,
        state,
        age,
        balance,
        password,
        confirmPassword,
      } = data;

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

        if (parseInt(age) < 13) {
          throw `Users must be at least 13 years old to sign up.`;
        }

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
          title: "Registration Page",
          settings_page: false,
          home_or_summary: false,
          landing_signup_login: true,
          general_page: false,
          include_navbar: false,
          include_summary_navbar: false,
          partial: "registration_script",
          include_footer: false,
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
        return res.status(500).render("register", {
          error: "Internal Server Error",
          title: "Registration Page",
          settings_page: false,
          isLoggedIn: false,
          home_or_summary: false,
          landing_signup_login: true,
          general_page: false,
          include_navbar: false,
          include_summary_navbar: false,
          partial: "registration_script",
          include_footer: false,
        });
      }
    } catch (e) {
      return res.status(400).render("register", {
        error: e,
        title: "Registration Page",
        settings_page: false,
        isLoggedIn: false,
        home_or_summary: false,
        landing_signup_login: true,
        general_page: false,
        include_navbar: false,
        include_summary_navbar: false,
        partial: "registration_script",
        include_footer: false,
      });
    }
  });

//----------------------------- Login Routes -----------------------------//
router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/home");
    }
    return res.render("login", {
      title: "Login Page",
      settings_page: false,
      home_or_summary: false,
      landing_signup_login: true,
      general_page: false,
      include_navbar: false,
      include_summary_navbar: false,
      partial: "registration_script",
      include_footer: false,
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
          title: "Login Page",
          settings_page: false,
          home_or_summary: false,
          landing_signup_login: true,
          general_page: false,
          include_navbar: false,
          include_summary_navbar: false,
          partial: "registration_script",
          include_footer: false,
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
        error: "Either the email or password is invalid",
        ...req.body,
        title: "Login Page",
        settings_page: false,
        home_or_summary: false,
        landing_signup_login: true,
        general_page: false,
        include_navbar: false,
        include_summary_navbar: false,
        partial: "registration_script",
        include_footer: false,
      });
    }
  });

//---------------------------- Signout Routes ----------------------------//
router.route("/signout").get(async (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  req.session.destroy();
  return res.render("signout", {
    title: "Signout Page",
    settings_page: false,
    home_or_summary: false,
    landing_signup_login: true,
    general_page: false,
    include_navbar: false,
    include_summary_navbar: false,
    partial: false,
    include_footer: false,
  });
});

//---------------------------- Home Routes ----------------------------//
router.delete("/settings/deleteCategory", async (req, res) => {
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
      fixedExpenses: updatedUser.fixedExpenses,
    };
    res.status(200).json({ success: true, message: "Category Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not delete category" });
  }
});

//---------------------------- Home Routes ----------------------------//

router.get('/home', async (req, res) => {
  try {
    if (!req.session.user) return res.redirect('/login');
    const user = req.session.user;

    const now = new Date();
    let numericMonth = now.getMonth() + 1;
    let numericYear = now.getFullYear();

    // If user selected a specific month/year from dropdown
    if (req.query.month && req.query.year) {
      const m = parseInt(req.query.month);
      const y = parseInt(req.query.year);
      if (!isNaN(m) && m >= 1 && m <= 12 && !isNaN(y) && y >= 2020 && y <= now.getFullYear()) {
        numericMonth = m;
        numericYear = y;
      }
    }

    const paddedMonth = numericMonth.toString().padStart(2, '0');
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthMap = {
      "01": "January", "02": "February", "03": "March", "04": "April",
      "05": "May", "06": "June", "07": "July", "08": "August",
      "09": "September", "10": "October", "11": "November", "12": "December"
    };
    const selectedMonth = req.query.month;

    const currentDate = now.toLocaleDateString('en-US');
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    // Dropdown month options
    const monthOptions = monthNames.map((name, index) => ({
      name,
      value: (index + 1).toString().padStart(2, '0'),
      selected: index + 1 === numericMonth
    }));

    // Dropdown year options
    const yearOptions = [];
    for (let y = now.getFullYear(); y >= 2020; y--) {
      yearOptions.push({
        value: y.toString(),
        selected: y === numericYear
      });
    }

    // Update and fetch monthly summary
    await monthlySummaryFunctions.recalculateMonthlySummary(user.id, paddedMonth, numericYear.toString());
    const monthlySummary = await monthlySummaryFunctions.getMonthlySummary(user.id, paddedMonth, numericYear.toString());

    if (!monthlySummary) {
      return res.render('home', {
        title: 'Monthly Summary',
        home_or_summary: true,
        include_navbar: true,
        include_summary_navbar: true,
        currentDate,
        currentTime,
        month: monthNames[numericMonth - 1], // readable month name
        year: numericYear,
        monthName: monthMap[selectedMonth] || selectedMonth,
        monthOptions,
        yearOptions,
        noData: true
      });
    }

    const dailyExpenses = await monthlySummaryFunctions.getDailyExpenses(user.id, paddedMonth, numericYear.toString());

    return res.render('home', {
      title: 'Monthly Summary',
      home_or_summary: true,
      include_navbar: true,
      include_summary_navbar: true,
      ...user,
      currentDate,
      currentTime,
      month: monthNames[numericMonth - 1],
      year: numericYear,
      monthOptions,
      yearOptions,
      monthName: monthMap[selectedMonth] || selectedMonth,
      ...monthlySummary,
      dailyExpenses,
      json: JSON.stringify
    });
  } catch (e) {
    console.error("Error in /home route:", e);
    return res.status(500).render("error", { error: e.toString() });
  }
});
//----------------------------Income Routes----------------------------------//
router
  .route("/income")
  .get(async (req, res) => {
    if (req.session.user) {
      try {
        let month = exportedMethods.getCurrentMonth();
        let year = exportedMethods.getCurrentYear();
        let no_incomes = false;

        if (req.query.renderMonth) {
          req.query.renderMonth = xss(req.query.renderMonth);
          month = req.query.renderMonth.split("-")[1];
          year = req.query.renderMonth.split("-")[0];
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
        let dropdownError = "";
        let dropdownErrorsExist = false;
        if (req.query.dropdownError) {
          dropdownError = xss(req.query.dropdownError);
          dropdownErrorsExist = true;
        }

        let newIncomeError = "";
        let newIncomeErrorsExist = false;
        if (req.query.newIncomeError) {
          newIncomeError = xss(req.query.newIncomeError);
          newIncomeErrorsExist = true;
        }

        let updateIncomeError = "";
        let updateIncomeErrorsExist = false;
        if (req.query.updateIncomeError) {
          updateIncomeError = xss(req.query.updateIncomeError);
          updateIncomeErrorsExist = true;
        }

        let current_income_to_show = year + "-" + month;
        let p_date = exportedMethods.getMonthYearForFormMax();
        let f_date = exportedMethods.getFullDateForFormMax();
        let incomes = await incomeFunctions.getIncomeByUserIdByMonthAndYear(
          req.session.user.id,
          month,
          year
        );

        //what to do if incomes is empty?
        if (incomes.length == 0) {
          no_incomes = true;
        }

        res.render("income", {
          title: "income",
          home_or_summary: false,
          landing_signup_login: false,
          general_page: true,
          include_navbar: true,
          include_summary_navbar: false,
          dropdownErrorsExist: dropdownErrorsExist,
          dropdownError: dropdownError,
          updateIncomeErrorsExist: updateIncomeErrorsExist,
          updateIncomeError: updateIncomeError,
          newIncomeErrorsExist: newIncomeErrorsExist,
          newIncomeError: newIncomeError,
          income_objects: incomes,
          no_incomes: no_incomes,
          //shows the month/year the user picked on the month input
          current_income_date_to_show: current_income_to_show,
          partial_date: p_date,
          full_date: f_date,
          include_footer: true,
          partial: "incomeExpense_script",
          settings_page: false,
        });
      } catch (e) {
        
        return res.status(500).send("Internal Server Error");
      }
    }
  })
  .post(async (req, res) => {
    //top date form to render incomes -> call get with new income value display (which will fetch automatically)
    try {
      if (req.body.form_type == "date_dropdown") {
        try {
          let month_year = req.body.dropdown_month_and_year;
          let date = month_year.split("-");
          if (
            date[0].length !== 4 ||
            date[1].length !== 2 ||
            parseInt(date[1]) < 1 ||
            parseInt(date[1]) > 12 ||
            parseInt(date[0]) < 2000 ||
            parseInt(date[0]) > parseInt(exportedMethods.getCurrentYear())
          ) {
            throw "Invalid date format";
          }
          //sends the month that the user chose to show to the get route
          res.redirect(`/income?renderMonth=${month_year}`);
        } catch (e) {
          //waht status
          res.status(500).redirect(`/income?dropdownError=${e}`);
        }
      } //botton new income form
      else if (req.body.form_type === "new_income") {
        try {
          let {
            form_type,
            new_income_amount,
            new_income_date,
            new_income_description,
          } = req.body;
          let userId = exportedMethods.checkId(req.session.user.id);
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
            amount.toString(),
            date,
            description
          );
          if (addedIncome === null) {
            throw "Could not add income object.";
          } else {
            //rerender the page with the new income object.??
            return res.redirect("/income");
          }
        } catch (e) {
          //waht status
          res.status(500).redirect(`/income?newIncomeError=${e}`);
        }
      }
    } catch (e) {
      // what to do if error on post? client side might catch it and send error back to them.
      //console.log(e);
      return res.status(500).send("Internal Server Error");
    }
  })
  .delete(async (req, res) => {
    let uuid = xss(req.body.uuid);

    try {
      if (!uuid) {
        throw "Uuid not provided";
      }
      let deletedIncome = await incomeFunctions.removeIncomeByUuid(uuid);

      res.redirect("/income");
    } catch (e) {
      return res.status(500).redirect(`/income?dropdownError=${e}`);
    }
  })
  .put(async (req, res) => {
    try {
      let uuid = xss(req.body.uuid);
      let amount = xss(req.body.updated_income_amount);
      let date = xss(req.body.updated_income_date);
      let description = xss(req.body.updated_income_description);

      uuid = exportedMethods.checkString(uuid);
      amount = exportedMethods.checkAmount(amount);
      date = exportedMethods.flipDate(date);
      if (description) {
        description = exportedMethods.checkString(description);
      } else description = "";
      try {
        if (!uuid) {
          throw "Uuid not provided";
        }
        let updatedIncome = await incomeFunctions.updateIncomeByUuid(
          uuid,
          amount.toString(),
          date,
          description
        );

        res.redirect("/income");
      } catch (e) {
        res.redirect(`/income?updateIncomeError=${e}`);
      }
    } catch (e) {
      return res.status(500).send("Internal Server Error");
      //display error on form if throw
    }
  });

router.get("/income/getIncomeData/:uuid", async (req, res) => {
  try {
    const uuid = req.params.uuid;
    let incomeData = await incomeFunctions.getIncomeByUuid(uuid);
    incomeData.date = exportedMethods.unflipDate(incomeData.date);
    res.status(200).json(incomeData);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Could not fetch income" });
  }
});

//----------------------------Expense Routes----------------------------------//
router
  .route("/expense")
  .get(async (req, res) => {
    if (req.session.user) {
      try {
        let month = exportedMethods.getCurrentMonth();
        let year = exportedMethods.getCurrentYear();
        let no_transactions = false;

        if (req.query.renderMonth) {
          req.query.renderMonth = xss(req.query.renderMonth);
          month = req.query.renderMonth.split("-")[1];
          year = req.query.renderMonth.split("-")[0];
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
        let dropdownError = "";
        let dropdownErrorsExist = false;
        if (req.query.dropdownError) {
          dropdownError = xss(req.query.dropdownError);
          dropdownErrorsExist = true;
        }

        let newExpenseError = "";
        let newExpenseErrorsExist = false;
        if (req.query.newExpenseError) {
          newExpenseError = xss(req.query.newExpenseError);
          newExpenseErrorsExist = true;
        }

        let updateExpenseError = "";
        let updateExpenseErrorsExist = false;
        if (req.query.updateExpenseError) {
          updateExpenseError = xss(req.query.updateExpenseError);
          updateExpenseErrorsExist = true;
        }

        let current_transaction_to_show = year + "-" + month;
        let p_date = exportedMethods.getMonthYearForFormMax();
        let f_date = exportedMethods.getFullDateForFormMax();
        let transactions =
          await transactionFunctions.getTransactionsByUserIdByMonthAndYear(
            req.session.user.id,
            month,
            year
          );

        //what to do if incomes is empty?
        if (transactions.length == 0) {
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
          dropdownErrorsExist: dropdownErrorsExist,
          dropdownError: dropdownError,
          updateExpenseErrorsExist: updateExpenseErrorsExist,
          updateExpenseError: updateExpenseError,
          newExpenseErrorsExist: newExpenseErrorsExist,
          newExpenseError: newExpenseError,
          expense_objects: transactions,
          no_transactions: no_transactions,
          //shows the month/year the user picked on the month input
          current_transaction_date_to_show: current_transaction_to_show,
          category: categories,
          partial_date: p_date,
          full_date: f_date,
          include_footer: true,
          partial: "incomeExpense_script",
          settings_page: false,
        });
      } catch (e) {
        //what to do when error?
        //console.log(e); // get rid of
        return res.status(500).send("Internal Server Error");
      }
    }
  })
  .post(async (req, res) => {
    try {
      if (req.body.form_type === "date_dropdown") {
        try {
          let month_year = req.body.dropdown_month_and_year;
          let date = month_year.split("-");
          if (
            date[0].length !== 4 ||
            date[1].length !== 2 ||
            parseInt(date[1]) < 1 ||
            parseInt(date[1]) > 12 ||
            parseInt(date[0]) < 2000 ||
            parseInt(date[0]) > parseInt(exportedMethods.getCurrentYear())
          ) {
            throw "Invalid date format";
          }
          //sends the month that the user chose to show to the get route

          res.redirect(`/expense?renderMonth=${month_year}`);
        } catch (e) {
          //status?
          res.status(500).redirect(`/expense?dropdownError=${e}`);
        }
      } //botton new income form
      else if (req.body.form_type === "new_transaction") {
        try {
          let {
            form_type,
            new_expense_amount,
            new_expense_date,
            new_expense_category,
            new_expense_description,
          } = req.body;
          let userId = exportedMethods.checkId(req.session.user.id);
          let amount = exportedMethods.checkAmount(xss(new_expense_amount));
          //input type=date returns yyyy/mm/dd so we use flipDate to change format to mm/dd/yyyy
          let date = exportedMethods.flipDate(xss(new_expense_date));
          let category = exportedMethods.checkString(xss(new_expense_category));
          date = exportedMethods.checkDate(date);
          let description = xss(new_expense_description);
          if (description) {
            description = exportedMethods.checkString(description);
          } else description = "";

          let addedTransaction = await transactionFunctions.addTransaction(
            userId,
            amount.toString(),
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
        } catch (e) {
          res.status(500).redirect(`/expense?newExpenseError=${e}`);
        }
      }
    } catch (e) {
      //console.log(e); // what to do if error on post? client side might catch it and send error back to them.
      return res.status(500).send("Internal Server Error");
    }
  })
  .delete(async (req, res) => {
    //make get income object and transaction object by uuid
    let uuid = xss(req.body.uuid);

    try {
      if (!uuid) {
        throw "Uuid not provided";
      }
      let deletedTransaction =
        transactionFunctions.removeTransactionByUuid(uuid);

      res.redirect("/expense");
    } catch (e) {
      //what to do if delete fails
      return res.status(500).redirect(`/expense?dropdownError=${e}`);
    }
  })
  .put(async (req, res) => {
    try {
      let uuid = xss(req.body.uuid);
      let amount = xss(req.body.updated_expense_amount);
      let date = xss(req.body.updated_expense_date);
      let category = xss(req.body.updated_expense_category);
      let description = xss(req.body.updated_expense_description);

      uuid = exportedMethods.checkString(uuid);
      amount = exportedMethods.checkAmount(amount);
      category = exportedMethods.checkString(category);

      date = exportedMethods.flipDate(date);
      if (description) {
        description = exportedMethods.checkString(description);
      } else description = "";
      try {
        if (!uuid) {
          throw "Uuid not provided";
        }
        let updatedTransaction =
          await transactionFunctions.updateTransactionByUuid(
            uuid,
            amount.toString(),
            date,
            category,
            description
          );

        res.redirect("/expense");
      } catch (e) {
        res.redirect(`/expense?updateExpenseError=${e}`);
      }
    } catch (e) {
      return res.status(500).send("Internal Server Error");
      //display error on form if throw
    }
  });

router.get("/expense/getExpenseData/:uuid", async (req, res) => {
  try {
    const uuid = req.params.uuid;
    let transactionData = await transactionFunctions.getTransactionByUuid(uuid);
    transactionData.date = exportedMethods.unflipDate(transactionData.date);
    res.status(200).json(transactionData);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Could not fetch transaction" });
  }
});

//--------------------------- Settings Routes ---------------------------//
router.route("/settings").get(async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.redirect("/login");
    return res.render("settings", {
      title: "Settings",
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
      balance: user.balance,
      categories: user.categories,
      fixedExpenses: user.fixedExpenses,
      partial: "settings_script",
      settings_page: true,
    });
  } catch (e) {
    return res.status(500).send("Internal Server Error");
  }
});

//----------------------- Update User Information -----------------------//
router.put("/settings/updateUser", async (req, res) => {
  try {
    const { firstName, lastName, email, gender, city, state, age, balance } =
      req.body;
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
      fixedExpenses: updatedUser.fixedExpenses,
    };

    res.status(200).json({
      success: true,
      message: "User Information Updated Successfully",
    });
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Could not update user information" });
  }
});

//----------------------- Add Fixed Expense -----------------------//
router.post("/settings/addFixedExpense", async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.redirect("/login");
    const { title, category, amount } = req.body;
    const newExpense = await users.addFixedExpensesById(
      user.id,
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
      fixedExpenses: updatedUser.fixedExpenses,
    };

    res.status(200).json(newExpense);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Could not add fixed expense" });
  }
});

//----------------------- Edit Fixed Expense -----------------------//
router.put("/settings/updateFixedExpense/:id", async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.redirect("/login");
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
      fixedExpenses: updatedUser.fixedExpenses,
    };

    res.status(200).json({ success: true, message: "Fixed Expense Updated" });
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Could not update fixed expense" });
  }
});
router.get("/settings/getFixedExpense/:id", async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const userData = await users.getUserById(user.id);
    const expense = userData.fixedExpenses.find(
      (e) => e._id.toString() === req.params.id
    );

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json(expense);
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Could not fetch expense" });
  }
});

//----------------------- Delete Fixed Expense -----------------------//
router.delete("/settings/deleteFixedExpense/:id", async (req, res) => {
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
      fixedExpenses: updatedUser.fixedExpenses,
    };

    res.status(200).json({ success: true, message: "Fixed Expense Deleted" });
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Could not delete fixed expense" });
  }
});

//----------------------- Add Category -----------------------//
router.post("/settings/addCategory", async (req, res) => {
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
      fixedExpenses: updatedUser.fixedExpenses,
    };

    res.status(200).json({ success: true, message: "Category Added" });
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Could not add category" });
  }
});

//----------------------- Delete Category -----------------------//
router.delete("/settings/deleteCategory", async (req, res) => {
  try {
    const user = req.session.user;
    const { category } = req.body;
    await users.deleteCategoryById(user.id.toString(), xss(category));

    const updatedUser = await users.getUserById(user.id.toString());
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
      fixedExpenses: updatedUser.fixedExpenses,
    };
    res.status(200).json({ success: true, message: "Category Deleted" });
  } catch (e) {
    //console.error(e);
    res.status(500).json({ error: "Could not delete category" });
  }
});
//----------------------- Yearly Summary -----------------------//
router.route('/yearly')
  .get(async (req, res) => {
    try {
      if (!req.session.user) {
        return res.redirect('/login');
      }
      const user = req.session.user;
      let currentYear = new Date().getFullYear();
      let year = (req.query.year || currentYear).toString();
      //check later for form for queing different year

      await yearlyFunctions.recalculateYearly(user.id.toString(), year.toString());
      
      let yearSummary;
      
      yearSummary = await yearlyFunctions.getYearlySummary(user.id.toString(), xss(year.toString()));
    

      const yearOptions = [];
      for (let y = currentYear; y >= 2000; y--) {
        yearOptions.push({
          value: y.toString(),
          selected: y.toString() === year.toString()
        });
      }

      const monthlyExpenses = await yearlyFunctions.getMonthlyExpenses(user.id.toString(), year.toString());
      
      let hasData = yearSummary.totalIncome > 0 || yearSummary.totalVariableExpenses > 0; 
      let constantCurrentYear = new Date().getFullYear();

      return res.render('yearlySummary', {
        title: "Yearly summary", 
        year: year, 
        currentYear: year,
        constantCurrentYear: constantCurrentYear,
        noStats: !hasData,
        breakdown: yearSummary.totalSpentPerCategory,
        totalSpentPerCategory: JSON.stringify(yearSummary.totalSpentPerCategory), 
        totalIncome: yearSummary.totalIncome, 
        totalFixedExpenses: yearSummary.totalFixedExpenses, 
        totalVariableExpenses: yearSummary.totalVariableExpenses, 
        monthlyExpenses: JSON.stringify(monthlyExpenses),
        yearOptions:yearOptions,
        home_or_summary: true, 
        landing_signup_login: false, 
        general_page: false, 
        include_navbar: true, 
        include_summary_navbar: true
      });
    } catch (e) {
      console.log("route error: ", e);
    }
});


export default router;