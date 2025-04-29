import { ObjectId } from "mongodb";

const exportedMethods = {
  //trims
  checkId(id) {
    if (!id) throw `Error: You must provide a input`;
    if (typeof id !== "string") throw `Error: input must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: input cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw `Error: input invalid object ID`;
    return id;
  },

  checkString(strVal) {
    //trims
    if (!strVal) throw `Error: You must supply an input!`;
    if (typeof strVal !== "string") throw `Error: unput must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: input cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for input as it only contains digits.`;
    return strVal;
  },

  checkAmount(amount) {
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
  },

  checkDate(date) {
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
  },

  checkNumber(input) {
    if (!input) throw `Error: You must supply an input`;
    if (typeof input !== "string") throw `Error: Input should be a string.`;
    input = input.trim();
    if (input.length === 0) {
      throw `Error: Given number cannot be an empty string or string with just spaces.`;
    }
    let inputArr = input.split("");
    if (
      !inputArr.every((char) => {
        return char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57;
      })
    ) {
      throw "Error: Invalid characters in input. There should only be numbers.";
    }
    return input;
  },
};

export default exportedMethods;
