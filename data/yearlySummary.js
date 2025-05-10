import { yearlySummary, users, monthlySummary } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import exportedMethods from "../helpers.js";
import month from "./monthlySummary.js";

const yearlyFunctions = {
    async addYearlySummary(userId, year) {
        userId = exportedMethods.checkId(userId);
        year = exportedMethods.checkYear(year);
        
        const userCollection = await users();
        const monthCollection = await monthlySummary();

        let totalIncome = 0;
        let totalFixedExpenses = 0;
        let totalVariableExpenses = 0;
        let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let totalSpentPerCategory = {};
        for (let m of monthList) {
            let summ = await month.getMonthlySummary(userId, m, year);
            if (summ) {
                totalIncome += Number(summ.totalIncome);
                totalFixedExpenses += Number(summ.totalFixedExpenses);
                totalVariableExpenses += Number(summ.totalVariableExpenses);
                for (let [cat, amt] of Object.entries(summ.breakdownByCategory)) {
                    totalSpentPerCategory[cat] = (totalSpentPerCategory[cat] || 0) + Number(amt);
                }
            }
        }

        const findUserId = await userCollection.findOne({_id: userId, year:year});
        if (findUserId) throw "userId and year combo already exists";

        let newYearly = {userId, year, totalSpentPerCategory, totalIncome, totalFixedExpenses, totalVariableExpenses};
        const yearlyCollection = await yearlySummary();
        const insertInfo = await yearlyCollection.insertOne(newYearly);
        if (!insertInfo.acknowledged || !insertInfo.insertedId) throw "Could not add yearly summary";
        const yearlySum = await this.getYearlySummary(userId, year);
        return yearlySum;
    }, 
    async getYearlySummary(userId, year) {
        userId = exportedMethods.checkId(userId);
        year = exportedMethods.checkYear(year);
        const yearlyCollection = await yearlySummary();
        const foundYearSum = await yearlyCollection.findOne({year: year});
        if (!foundYearSum) throw 'yearly summary not found';
        return foundYearSum;
    },

    async updateTotalFixedExpenses(userId, year) {
        uuserId = exportedMethods.checkId(userId);
        year = exportedMethods.checkYear(year);

        let totalFixedExpenses = 0;
        let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        for (let m of monthList) {
            let summ = await month.getMonthlySummary(userId, m, year);
            if (summ) {
                totalFixedExpenses += Number(summ.totalFixedExpenses);
            }
        }

        const yearlyCollection = await yearlySummary();
        const updatedInfo = await yearlyCollection.findOneAndUpdate({_id: userId, year: year}, {$set: {totalFixedExpenses: totalFixedExpenses}}, {returnDocument: 'after'});
        if (!updatedInfo) throw 'total fixed expenses could not be updated';
        return `${updatedInfo._id.toString()} has been updated`;
    },


    async updateTotalVariableExpenses(userId, year) {
        userId = exportedMethods.checkId(userId);
        year = exportedMethods.checkYear(year);

        let totalVariableExpenses = 0;
        let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        for (let m of monthList) {
            let summ = await month.getMonthlySummary(userId, m, year);
            if (summ) {
                totalVariableExpenses += Number(summ.totalVariableExpenses);
            }
        }

        const yearlyCollection = await yearlySummary();
        const updatedInfo = await yearlyCollection.findOneAndUpdate({_id: userId, year:year}, {$set: {totalVariableExpenses: totalVariableExpenses}}, {returnDocument: 'after'});
        if (!updatedInfo) throw 'total variable expenses could not be updated';
        return `${updatedInfo._id.toString()} has been updated`;
    }, 

    async updateTotalIncome(userId, year) {
        userId = exportedMethods.checkId(userId);
        year = exportedMethods.checkYear(year);
        
        let totalIncome = 0;
        let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        for (let m of monthList) {
            let summ = await month.getMonthlySummary(userId, m, year);
            if (summ) {
                totalIncome += Number(summ.totalIncome);
            }
        }

        const yearlyCollection = await yearlySummary();
        const updatedInfo = await yearlyCollection.findOneAndUpdate({_id: userId, year:year}, {$set: {totalIncome: totalIncome}}, {returnDocument: 'after'});
        if (!updatedInfo) throw 'total income could not be updated';
        return `${updatedInfo._id.toString()} has been updated`;
    }, 

    async updateTotalSpentPerCategory(userId, year) {
        userId = exportedMethods.checkId(userId);
        year = exportedMethods.checkYear(year);
        
        let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let totalSpentPerCategory = {};
        for (let m of monthList) {
            let summ = await month.getMonthlySummary(userId, m, year);
            if (summ) {
                for (let [cat, amt] of Object.entries(summ.breakdownByCategory)) {
                    totalSpentPerCategory[cat] = (totalSpentPerCategory[cat] || 0) + Number(amt);
                }
            }
        }

        const yearlyCollection = await yearlySummary();
        const updatedInfo = await yearlyCollection.findOneAndUpdate({_id: userId, year:year}, {$set: {totalSpentPerCategory: totalSpentPerCategory}}, {returnDocument: 'after'});
        if (!updatedInfo) throw 'total income could not be updated';
        return `${updatedInfo._id.toString()} has been updated`;
    }, 

    async recalculateYearly() {
        userId = exportedMethods.checkId(userId);
        year = exportedMethods.checkYear(year);
        
        const yearlyCollection = await yearlySummary();
        const findYearSum = await yearlyCollection.findOne({_id: userId, year:year});
        if (!findYearSum) throw `${year} yearly summary doesn't exist`;
        await this.updateTotalIncome(userId, year);
        await this.updateTotalFixedExpenses(userId, year);
        await this.updateTotalVariableExpenses(userId, year);
        await this.updateTotalSpentPerCategory(userId, year);

        const updatedSum = await this.getYearlySummary(userId, year);
        return updatedSum;
    }
  };
  
  export default yearlyFunctions;

