import { yearlySummary, users, monthlySummary } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import exportedMethods from "../helpers.js";
import month from "./monthlySummary.js";

let monthList = {January: "01", February: "02", March: "03", April: "04", May: "05", June: "06", July: "07", August: "08", September: "09", October: "10", November: "11", December: "12"};  

const yearlyFunctions = {
    async addYearlySummary(userId, year) {
        userId = exportedMethods.checkId(userId);
        year = exportedMethods.checkYear(year);
        
        // const userCollection = await users();
        // const monthCollection = await monthlySummary();
        const yearlyCollection = await yearlySummary();

        let totalIncome = 0;
        let totalFixedExpenses = 0;
        let totalVariableExpenses = 0;
        let totalSpentPerCategory = {};
        for (let [m, num] of Object.entries(monthList)) {
            let summ = await month.getMonthlySummary(userId, num , year.toString());
            if (summ) {
                totalIncome += Number(summ.totalIncome);
                totalFixedExpenses += Number(summ.totalFixedExpenses);
                totalVariableExpenses += Number(summ.totalVariableExpenses);
                // for (let [cat, amt] of Object.entries(summ.breakdownByCategory)) {
                //     totalSpentPerCategory[cat] = (totalSpentPerCategory[cat] || 0) + Number(amt);
                // }
                for (let pair of summ.breakdownByCategory) {
                    totalSpentPerCategory[pair.category] = (totalSpentPerCategory[pair.category] || 0) + pair.totalSpent;
                }
            }
        }

        const findUserId = await yearlyCollection.findOne({userId: userId, year:year});
        if (findUserId) throw "userId and year combo already exists";

        let newYearly = {userId, year, totalSpentPerCategory, totalIncome, totalFixedExpenses, totalVariableExpenses};
        const insertInfo = await yearlyCollection.insertOne(newYearly);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add yearly summary";
        const yearlySum = await this.getYearlySummary(userId, year);
        return yearlySum;
    }, 
    async getYearlySummary(userId, year) {
        userId = exportedMethods.checkId(userId);
        year = exportedMethods.checkYear(year);
        const yearlyCollection = await yearlySummary();
        const foundYearSum = await yearlyCollection.findOne({userId:userId, year: year});
        if (!foundYearSum) throw 'yearly summary not found';
        return foundYearSum;
    },

    async updateTotalFixedExpenses(userId, year) {
        userId = exportedMethods.checkId(userId);
        year = exportedMethods.checkYear(year);

        let totalFixedExpenses = 0;
        for (let [m, num] of Object.entries(monthList)) {
            let summ = await month.recalculateMonthlySummary(userId, num, year.toString());
            if (summ) {
                totalFixedExpenses += Number(summ.totalFixedExpenses);
            }
        }
        const yearlyCollection = await yearlySummary();
        const updatedInfo = await yearlyCollection.findOneAndUpdate({userId: userId, year: year}, {$set: {totalFixedExpenses: totalFixedExpenses}}, {returnDocument: 'after'});
        if (!updatedInfo) throw 'total fixed expenses could not be updated';
        return `${updatedInfo._id.toString()} has been updated`;
    },


    async updateTotalVariableExpenses(userId, year) {
        userId = exportedMethods.checkId(userId);
        year = exportedMethods.checkYear(year);

        let totalVariableExpenses = 0;
        //let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        for (let [m, num] of Object.entries(monthList)) {
            let summ = await month.recalculateMonthlySummary(userId, num, year.toString());
            if (summ) {
                totalVariableExpenses += Number(summ.totalVariableExpenses);
            }
        }

        const yearlyCollection = await yearlySummary();
        const updatedInfo = await yearlyCollection.findOneAndUpdate({userId: userId, year:year}, {$set: {totalVariableExpenses: totalVariableExpenses}}, {returnDocument: 'after'});
        if (!updatedInfo) throw 'total variable expenses could not be updated';
        return `${updatedInfo._id.toString()} has been updated`;
    }, 

    async updateTotalIncome(userId, year) {
        userId = exportedMethods.checkId(userId);
        year = exportedMethods.checkYear(year);
        
        let totalIncome = 0;
        //let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        for (let [m, num] of Object.entries(monthList)) {
            let summ = await month.recalculateMonthlySummary(userId, num, year.toString());
            if (summ) {
                totalIncome += Number(summ.totalIncome);
            }
        }

        const yearlyCollection = await yearlySummary();
        const updatedInfo = await yearlyCollection.findOneAndUpdate({userId: userId, year:year}, {$set: {totalIncome: totalIncome}}, {returnDocument: 'after'});
        if (!updatedInfo) throw 'total income could not be updated';
        return `${updatedInfo._id.toString()} has been updated`;
    }, 

    async updateTotalSpentPerCategory(userId, year) {
        userId = exportedMethods.checkId(userId);
        year = exportedMethods.checkYear(year);
        
        //let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let totalSpentPerCategory = {};
        for (let [m, num] of Object.entries(monthList)) {
            let summ = await month.recalculateMonthlySummary(userId, num, year.toString());
            if (summ) {
                // for (let [cat, amt] of Object.entries(summ.breakdownByCategory)) {
                //     totalSpentPerCategory[cat] = (totalSpentPerCategory[cat] || 0) + Number(amt);
                // }
                for (let pair of summ.breakdownByCategory) {
                    totalSpentPerCategory[pair.category] = (totalSpentPerCategory[pair.category] || 0) + pair.totalSpent;
                }
            }
        }

        const yearlyCollection = await yearlySummary();
        const updatedInfo = await yearlyCollection.findOneAndUpdate({userId: userId, year:year}, {$set: {totalSpentPerCategory: totalSpentPerCategory}}, {returnDocument: 'after'});
        if (!updatedInfo) throw 'total income could not be updated';
        return `${updatedInfo._id.toString()} has been updated`;
    }, 

    async recalculateYearly(userId, year) {
        userId = exportedMethods.checkId(userId);
        year = exportedMethods.checkYear(year.toString());
        
        const yearlyCollection = await yearlySummary();
        const findYearSum = await yearlyCollection.findOne({userId: userId, year:year});
        if (!findYearSum) {
            return await this.addYearlySummary(userId, year.toString());
        }
        await this.updateTotalIncome(userId, year.toString());
        await this.updateTotalFixedExpenses(userId, year.toString());
        await this.updateTotalVariableExpenses(userId, year.toString());
        await this.updateTotalSpentPerCategory(userId, year.toString());

        const updatedSum = await this.getYearlySummary(userId, year.toString());
        return updatedSum;
    },
    async getMonthlyExpenses(userId, year) {
        userId = exportedMethods.checkId(userId);
        year = exportedMethods.checkYear(year);

        let trend = {};
        //let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        for (let [m, num] of Object.entries(monthList)) {
            let totalSpending = 0;
            let summ = await month.recalculateMonthlySummary(userId, num, year.toString());
            if (summ) {
                totalSpending += Number(summ.totalFixedExpenses);
                totalSpending += Number(summ.totalVariableExpenses);
            }
            trend[m] = totalSpending;
        }
        return Object.values(trend);
    }
  };
  
  export default yearlyFunctions;

