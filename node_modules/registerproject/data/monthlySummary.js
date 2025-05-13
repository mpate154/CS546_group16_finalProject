import { ObjectId } from "mongodb";

import exportedMethods from "../helpers.js";
import incomeFunctions from "../data/income.js";
import { users, transactions, monthlySummary as monthlySummaries } from "../config/mongoCollections.js";


const monthlySummaryFunctions = {
  async updateTotalIncome(userId, month, year) {
    userId = exportedMethods.checkId(userId);
    month = exportedMethods.checkNumber(month);
    year = exportedMethods.checkNumber(year);


    const incomeList = await incomeFunctions.getIncomeByUserIdByMonthAndYear(userId, month, year);
    const totalIncome = incomeList.reduce((acc, incomeEntry) => acc + (Number(incomeEntry.amount) || 0), 0);

    //console.log("Updating summary with:");
    //console.log("userId:", userId, "type:", typeof userId);
    //console.log("month:", month, "type:", typeof month);
    //console.log("year:", year, "type:", typeof year);
    //console.log("totalIncome:", totalIncome);
    const summaryCollection = await monthlySummaries();
    const updateResult = await summaryCollection.updateOne(
      { userId, month, year },
      {
        $set: {
          userId,
          month,
          year,
          totalIncome
        }
      },
      { upsert: true }
    );
    //console.log("updateResult:", updateResult);

    if (updateResult.modifiedCount === 0 && updateResult.matchedCount === 1) {
      //console.warn("Update skipped: document already up-to-date.");
    }
    if (!updateResult.acknowledged) {
      throw new Error("MongoDB did not acknowledge the update.");
    }

    return totalIncome;
  },
  // becomes read-only
  async getMonthlySummary(userId, month, year) {
    userId = exportedMethods.checkId(userId);
    month = exportedMethods.checkNumber(month);
    year = exportedMethods.checkNumber(year);
  
    const summaryCollection = await monthlySummaries();
    const summary = await summaryCollection.findOne({ userId, month, year });
  
    // if (!summary) throw "No monthly summary found. Please run recalculateMonthlySummary first.";
    if (!summary) {
      return null;
    }
  
    // Fallbacks for missing fields
    const totalIncome = summary.totalIncome || 0;
    const totalFixedExpenses = summary.totalFixedExpenses || 0;
    const totalVariableExpenses = summary.totalVariableExpenses || 0;
    const remainingBalance = summary.remainingBalance || 0;
  
    return {
      userId,
      month,
      year,
      totalIncome,
      totalFixedExpenses,
      totalVariableExpenses,
      breakdownByCategory: summary.breakdownByCategory || [],
      remainingBalance
    };
  },
  async updateBreakdownByCategory(userId, month, year) {
    userId = exportedMethods.checkId(userId);
    month = exportedMethods.checkNumber(month);
    year = exportedMethods.checkNumber(year);
    if (month.length != 2 || year.length != 4)
      throw "Invalid format for year and date";

    const pattern = `^${month}/\\d{2}/${year}`;
    const datePattern = new RegExp(pattern);
  
    const transactionCollection = await transactions();
    const transactionList = await transactionCollection.find({
      userId,
      date: { $regex: datePattern }
    }).toArray();
  
    const categoryTotals = {};
  
    for (const txn of transactionList) {
      const category = txn.category || "Uncategorized";
      const amount = Number(txn.amount) || 0;
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    }
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (user && Array.isArray(user.fixedExpenses)) {
      for (const fixed of user.fixedExpenses) {
        const category = fixed.category || "Fixed";
        const amount = Number(fixed.amount) || 0;
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      }
    }
    const breakdownArray = Object.entries(categoryTotals).map(([category, total]) => ({
      category,
      totalSpent: total
    }));
  
    const summaryCollection = await monthlySummaries();
    await summaryCollection.updateOne(
      { userId, month, year },
      { $set: { breakdownByCategory: breakdownArray } },
      { upsert: true }
    );
  
    //console.log("✅ Combined breakdown (var + fixed):", breakdownArray);
    return breakdownArray;
  },
  
  async updateFixedExpenses(userId, month, year) {
    userId = exportedMethods.checkId(userId);
    month = exportedMethods.checkNumber(month);
    year = exportedMethods.checkNumber(year);
  
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
  
    //console.log("🧾 User document:", user);
  
    if (!user || !user.fixedExpenses) {
      //console.warn("User not found or has no fixed expenses.");
      return 0;
    }
  
    const total = user.fixedExpenses.reduce((sum, expense) => {
      return sum + (Number(expense.amount) || 0);
    }, 0);
  
    const summaryCollection = await monthlySummaries();
    await summaryCollection.updateOne(
      { userId, month, year },
      { $set: { totalFixedExpenses: total } },
      { upsert: true }
    );
  
    //console.log("✅ Total fixed expenses calculated:", total);
  
    return total;
  }, 
  
  async updateVariableExpenses(userId, month, year) {
    userId = exportedMethods.checkId(userId);
    month = exportedMethods.checkNumber(month);
    year = exportedMethods.checkNumber(year);
    if (month.length != 2 || year.length != 4)
      throw "Invalid format for year and date";

    const pattern = `^${month}/\\d{2}/${year}`;
    const datePattern = new RegExp(pattern);
  
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
  
    if (!user) throw "User not found.";
    const transactionCollection = await transactions();

    const txnList = await transactionCollection.find({
      userId,
      date: { $regex: datePattern }
    }).toArray();

    const total = txnList.reduce((sum, txn) => sum + Number(txn.amount || 0), 0);
  
    const summaryCollection = await monthlySummaries();
    await summaryCollection.updateOne(
      { userId, month, year },
      { $set: { totalVariableExpenses: total } },
      { upsert: true }
    );
  
    //console.log("✅ Total variable expenses:", total);
  
    return total;
  },  
  async recalculateMonthlySummary(userId, month, year) {
    //console.log("recalculate monthly called ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅");
    userId = exportedMethods.checkId(userId);
    month = exportedMethods.checkNumber(month);
    year = exportedMethods.checkNumber(year);
    if (month.length != 2 || year.length != 4)
      throw "Invalid format for year and date";
  
    const totalIncome = await this.updateTotalIncome(userId, month, year);
    const totalFixedExpenses = await this.updateFixedExpenses(userId, month, year);
    const totalVariableExpenses = await this.updateVariableExpenses(userId, month, year);
    const breakdownByCategory = await this.updateBreakdownByCategory(userId, month, year);
  
    const userCollection = await users();
    const userDoc = await userCollection.findOne({ _id: userId });

    const initialBalance = userDoc?.balance || 0;
    //console.log("✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ balance:", initialBalance);

    const remainingBalance = 
      (initialBalance || 0) + 
      (totalIncome || 0) - 
      (totalFixedExpenses || 0) - 
      (totalVariableExpenses || 0);
    // const remainingBalance = (totalIncome || 0) - (totalFixedExpenses || 0) - (totalVariableExpenses || 0);
  
    const summaryCollection = await monthlySummaries();
    await summaryCollection.updateOne(
      { userId, month, year },
      {
        $set: {
          totalIncome,
          totalFixedExpenses,
          totalVariableExpenses,
          breakdownByCategory,
          remainingBalance
        }
      },
      { upsert: true }
    );
  
    return {
      userId,
      month,
      year,
      totalIncome,
      totalFixedExpenses,
      totalVariableExpenses,
      breakdownByCategory,
      remainingBalance
    };
  },
  async getDailyExpenses(userId, month, year) {
    userId = exportedMethods.checkId(userId);
    month = exportedMethods.checkNumber(month);
    year = exportedMethods.checkNumber(year);
    if (month.length != 2 || year.length != 4)
      throw "Invalid format for year and date";

    const pattern = `^${month}/\\d{2}/${year}`;
    const datePattern = new RegExp(pattern);
  
    const transactionCollection = await transactions();
    const txnList = await transactionCollection.find({
      userId,
      date: { $regex: datePattern }
    }).toArray();
  
    const dailyTotals = {};
  
    for (const txn of txnList) {
      const date = txn.date.split('/')[1]; // Get the 'dd' part of 'MM/dd/yyyy'
      const amount = Number(txn.amount) || 0;
      dailyTotals[date] = (dailyTotals[date] || 0) + amount;
    }
  
    const result = Object.entries(dailyTotals)
      .map(([day, total]) => ({
        day: parseInt(day), total
      }))
      .sort((a, b) => a.day - b.day);
  
    return result;
  }  
};

export default monthlySummaryFunctions;