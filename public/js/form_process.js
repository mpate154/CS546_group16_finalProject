////////////// HELPER FUNCTIONS //////////////////////

let checkString = (strVal) => {
  //trims
  if (!strVal) throw `Error: You must supply an input!`;
  if (typeof strVal !== "string") throw `Error: input must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: input cannot be an empty string or string with just spaces`;
  if (!isNaN(strVal))
    throw `Error: ${strVal} is not a valid value for input as it only contains digits.`;
  return strVal;
};
let checkAmount = (amount) => {
  let stringamount = amount;
  if (!amount) throw `Error: You must supply an amount`;
  if (typeof stringamount !== "string")
    throw `Error: Inputted amount should be a string.`;
  amount = amount.trim();
  if (amount.length === 0) {
    throw `Error: Given amount cannot be an empty string or string with just spaces.`;
  }

  //checking if all numerical or .
  let decimalPoints = 0;
  let amountArray = amount.split("");
  if (
    !amountArray.every((char) => {
      if (char.charCodeAt(0) == 46) decimalPoints = decimalPoints + 1;
      return (
        (char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57) ||
        char.charCodeAt(0) == 46
      );
    })
  )
    throw "Error: Invalid characters in amount. There should only be numbers and . for a decimal place.";

  if (decimalPoints > 1)
    throw "Error: There should only be 1 or none decimal points.";

  // make sure format is correct
  amount = parseFloat(amount);
  if (isNaN(amount)) throw `Error: amount cannot be converted to a decimal.`;
  if (decimalPoints == 1) {
    if (stringamount.split(".")[1].length > 2)
      throw "Error: Amount must be 2 decimals places or less.";
  }

  return amount;
};

//the input for the input="date" is YYYY/MM/DD so we need to flip it
let flipDate = (date) => {
  if (!date) throw `Error: You must supply a date`;
  if (typeof date !== "string")
    throw `Error: Inputted date should be a string.`;
  date = date.trim();
  if (date.length === 0) {
    throw `Error: Given date cannot be an empty string or string with just spaces.`;
  }

  let dateSplit = date.split("-");
  if (dateSplit.length < 3) throw "Error: Incorrect date format";
  if (
    dateSplit[0].length != 4 ||
    dateSplit[1].length != 2 ||
    dateSplit[2].length != 2
  )
    throw "Error: Date format should be yyyy/mm/dd";

  return dateSplit[1] + "/" + dateSplit[2] + "/" + dateSplit[0];
};

// mm/dd/yyyy
let checkDate = (date) => {
  if (!date) throw `Error: You must supply a date`;
  if (typeof date !== "string")
    throw `Error: Inputted date should be a string.`;
  date = date.trim();
  if (date.length === 0) {
    throw `Error: Given date cannot be an empty string or string with just spaces.`;
  }

  let dateSplit = date.split("/");
  if (dateSplit.length < 3) throw "Error: Incorrect date format";
  if (
    dateSplit[0].length != 2 ||
    dateSplit[1].length != 2 ||
    dateSplit[2].length != 4
  )
    throw "Error: Date format should be mm/dd/yyyy";
  if (parseInt(dateSplit[0]) < 1 || parseInt(dateSplit[0]) > 12)
    throw "Error: Month should be between 1 and 12 inclusive.";

  //make sure date is only for today and before
  if (parseInt(dateSplit[2]) > new Date().getFullYear())
    throw "Error: Year should be before " + new Date().getFullYear();

  if (
    (parseInt(dateSplit[2]) == new Date().getFullYear() &&
      parseInt(dateSplit[0]) > new Date().getMonth() + 1) ||
    (parseInt(dateSplit[2]) == new Date().getFullYear() &&
      parseInt(dateSplit[0]) == new Date().getMonth() + 1 &&
      parseInt(dateSplit[1]) > new Date().getDate())
  )
    throw "Error: Date must be today or a date before.";

  let days = {
    "01": "31",
    "02": "28",
    "03": "31",
    "04": "30",
    "05": "31",
    "06": "30",
    "07": "31",
    "08": "31",
    "09": "30",
    10: "31",
    11: "30",
    12: "31",
  };

  if (!(parseInt(dateSplit[1]) <= parseInt(days[dateSplit[0]])))
    throw "Error: Invalid day for dateReleased";

  return date;
};

/////////////////// VARIABLES ////////////////////////////

//dropdown is for dropdown on both transaction and income pages
let dropdown_form = document.getElementById("dropdown_form");
let dropdown_month_and_year = document.getElemenyById(
  "dropdown_month_and_year"
);
let new_income_form = document.getElementById("new_income_form");
let new_income_amount = document.getElementById("get_income_amount");
let new_income_date = document.getElementById("new_income_date");
let new_income_description = document.getElementById("new_income_description");
let new_expense_form = document.getElementById("new_expense_form");
let new_expense_amount = document.getElementById("new_expense_amount");
let new_expense_date = document.getElementById("new_expense_date");
let new_expense_category = document.getElementById("new_expense_category");
let new_expense_description = document.getElementById(
  "new_expense_description"
);

let dropdown_errors = [];
let new_income_errors = [];
let new_expense_errors = [];
let dropdown_error_div = document.getElementById("dropdown_error_div");
let new_income_error_div = document.getElementById("new_income_error_div");
let new_expense_error_div = document.getElementById("new_expense_error_div");

///////////// FORM CHECKING ///////////////////////

//month dropdown form on income and transaction pages
if (dropdown_form) {
  register_form.addEventListener("submit", (event) => {
    event.preventDefault();
    dropdown_error_div.hidden = true;
    dropdown_error_div.innerHTML = "";

    //check in backend whether there are incomes if not then display in thingy
    if (dropdown_month_and_year) {
      try {
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
      } catch (e) {
        dropdown_errors.push(e);
      }
    } else {
      dropdown_errors.push("Month and year input is missing in dropdown.");
    }

    if (dropdown_errors.length != 0) {
      dropdown_error_div = false;
      for (let i = 0; i < dropdown_errors.length; i++) {
        let p_err = document.createElement("p");
        p_err.innerHTML = dropdown_errors[i];
        dropdown_error_div.appendChild(p_err);
      }
      dropdown_errors = [];
    } else {
      dropdown_form.submit();
    }
  });
  //new income form
} else if (new_income_form) {
  register_form.addEventListener("submit", (event) => {
    event.preventDefault();
    new_income_error_div.hidden = true;
    new_income_error_div.innerHTML = "";

    //input type=date returns yyyy/mm/dd so we use flipDate to change format to mm/dd/yyyy

    if (new_income_amount) {
      try {
        exportedMethods.checkAmount(new_income_amount);
      } catch (e) {
        new_income_errors.push(e);
      }
    } else {
      new_income_errors.push("Amount input is missing.");
    }

    if (new_income_date) {
      try {
        let date = exportedMethods.flipDate(new_income_date);
        exportedMethods.checkDate(date);
      } catch (e) {
        new_income_errors.push(e);
      }
    } else {
      new_income_errors.push("Amount input is missing.");
    }

    if (new_income_description) {
      try {
        let description = new_income_description;
        if (description) {
          description = exportedMethods.checkString(description);
        } else description = "";
      } catch (e) {
        new_income_errors.push(e);
      }
    } else {
      new_income_errors.push("Amount input is missing.");
    }

    if (new_income_errors.length != 0) {
      new_income_error_div = false;
      for (let i = 0; i < new_income_errors.length; i++) {
        let p_err = document.createElement("p");
        p_err.innerHTML = dropdown_errors[i];
        new_income_error_div.appendChild(p_err);
      }
      new_income_errors = [];
    } else {
      new_income_form.submit();
    }
  });
}
//new expense form
else if (new_expense_form) {
  register_form.addEventListener("submit", (event) => {
    event.preventDefault();
    new_expense_error_div.hidden = true;
    new_expense_error_div.innerHTML = "";

    if (new_expense_amount) {
      try {
        exportedMethods.checkAmount(new_expense_amount);
      } catch (e) {
        new_expense_errors.push(e);
      }
    } else {
      new_expense_errors.push("Amount input is missing.");
    }

    if (new_expense_date) {
      try {
        let date = exportedMethods.flipDate(new_expense_date);
        exportedMethods.checkDate(date);
      } catch (e) {
        new_expense_errors.push(e);
      }
    } else {
      new_expense_errors.push("Amount input is missing.");
    }

    if (new_expense_category) {
      try {
       exportedMethods.checkString(new_expense_category);
      } catch (e) {
        new_expense_errors.push(e);
      }
    } else {
      new_expense_errors.push("Amount input is missing.");
    }

    if (new_expense_description) {
      try {
        let description = new_expense_description;
        if (description) {
          description = exportedMethods.checkString(description);
        } else description = "";
      } catch (e) {
        new_expense_errors.push(e);
      }
    } else {
      new_expense_errors.push("Amount input is missing.");
    }

    if (new_expense_errors.length != 0) {
      new_expense_error_div = false;
      for (let i = 0; i < new_expense_errors.length; i++) {
        let p_err = document.createElement("p");
        p_err.innerHTML = new_expense_errors[i];
        new_expense_error_div.appendChild(p_err);
      }
      new_expense_errors = [];
    } else {
      new_expense_form.submit();
    }
  });
}
