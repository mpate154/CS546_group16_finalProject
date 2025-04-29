import { transactions } from "../config/mongoCollections.js";
import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import exportedMethods from "../helper.js";

const transactionFunctions = {
  async getTransactionById(id) {
    let transactionId = exportedMethods.checkId(id);

    const transactionCollection = await transactions();
    const oneTransaction = await transactionCollection.findOne({
      _id: new ObjectId(transactionId),
    });
    if (oneTransaction === null)
      throw "Transaction ID does not have corresponding income.";
    oneTransaction._id = oneTransaction._id.toString();
    return oneTransaction;
  },
  async addTransaction(userId, amount, category, date, description) {
    userId = exportedMethods.checkId(userId);
    amount = exportedMethods.checkAmount(amount);
    date = exportedMethods.checkDate(date);
    if (description) {
      description = exportedMethods.checkString(description);
    } else description = "";

    category = exportedMethods.checkString(category);

    //check if user has that category (even though it is drop down)
    //if not valid category throw
    const userCollection = await users();
    let userInfo = await userCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { _id: 0, categories: 1 } }
    );
    if (!userInfo) throw "User couldn't be fetched.";
    if (!userInfo.categories.includes(category)) throw "Invalid category.";

    let newTransaction = {
      _id: new ObjectId(),
      userId: userId,
      amount: amount,
      category: category,
      date: date,
      description: description,
    };

    const transactionCollection = await transactions();
    const newTransactionInfo = await transactionCollection.insertOne(
      newTransaction
    );
    if (!newTransactionInfo) throw "Insert failed!";
    return await this.getTransactionById(
      newTransactionInfo.insertedId.toString()
    );
  },

  //returns them sorted by most recent
  async getAllTransactionsByUserId(userId) {
    userId = exportedMethods.checkId(userId);
    const transactionCollection = await transactions();
    let transactionsFromUserId = await transactionCollection
      .find({ userId: userId })
      .toArray();
    if (transactionsFromUserId.length === 0) throw "Could not fetch all transacitions.";

    //sort
    transactionsFromUserId.sort((x, y) => {
      const dateX = new Date(x.date);
      const dateY = new Date(y.date);
      return dateY - dateX;
    });

    transactionsFromUserId = transactionsFromUserId.map((element) => {
      element._id = element._id.toString();
      return element;
    });

    return transactionsFromUserId;
  },

  //returns them sorted by most recent
  async getTransactionsByUserIdByMonthAndYear(userId, month, year) {
    userId = exportedMethods.checkId(userId);
    //check month and year format
    month = exportedMethods.checkNumber(month);
    year = exportedMethods.checkNumber(year);
    if (month.length != 2 || year.length != 4)
      throw "Error: invalid format for year and date";

    const pattern = `^${month}/\\d{2}/${year}`;
    const transactionCollection = await transactions();
    let transactionsFromUserId = await transactionCollection
      .find({ $and: [{ userId: userId }, { date: { $regex: pattern } }] })
      .toArray();
    if (transactionsFromUserId.length == 0)
      throw "Could not fetch all transacitions by month and year.";

    transactionsFromUserId = transactionsFromUserId.map((element) => {
      element._id = element._id.toString();
      return element;
    });

    return transactionsFromUserId;
  },

  //returns them sorted by most recent
  async getTransactionsByUserIdByYear(userId, year) {
    userId = exportedMethods.checkId(userId);
    //check month and year format

    year = exportedMethods.checkNumber(year);
    if (year.length != 4) throw "Error: invalid format for year and date";

    const pattern = `^(0[1-9]|1[0-2])/\\d{2}/${year}`;
    const transactionCollection = await transactions();
    let transactionsFromUserIdByYear = await transactionCollection
      .find({ $and: [{ userId: userId }, { date: { $regex: pattern } }] })
      .toArray();
    if (transactionsFromUserIdByYear.length === 0)
      throw `Could not fetch all transactions from ${year}.`;

    transactionsFromUserIdByYear = transactionsFromUserIdByYear.map(
      (element) => {
        element._id = element._id.toString();
        return element;
      }
    );
    return transactionsFromUserIdByYear;
  },

  async removeTransactionByTransactionId(transactionId) {
    transactionId = exportedMethods.checkId(transactionId);
    const transactionCollection = await transactions();
    const deletedtransaction = await transactionCollection.findOneAndDelete({
      _id: new ObjectId(transactionId),
    });

    if (!deletedtransaction) throw "Could not delete transaction.";
    return `${deletedtransaction._id.toString()} has been deleted.`;
  },
};

export default transactionFunctions;
