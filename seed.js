

import {dbConnection, closeConnection} from './config/mongoConnections.js';
import yearlyFunctions from './data/yearlySummary.js'; //addYearlySummary, getYearlySummary, updateTotalFixedExpenses, updateTotalVarialeExpenses, updateTotalIncome, updateTotalSpentPercategory, 

const db = await dbConnection();
await db.dropDatabase();

async function main() {
    try {
        console.log("it works!");
        let breakdown = {groceries: 123, clothing: 300, gas: 27}
        const year1 = await yearlyFunctions.addYearlySummary("sammyork", "2022", breakdown, "10000", "2000", "2500");
        console.log(year1);

        const getData = await yearlyFunctions.getYearlySummary("sammyork", "2022");
        console.log("\n\n\ngot data:\n", getData);

        const updateFixed = await yearlyFunctions.updateTotalFixedExpenses("sammyork", "2022", "4321");
        console.log("\n\n\n\n", updateFixed);
        const getupdatedData = await yearlyFunctions.getYearlySummary("sammyork", "2022");
        console.log("\n\nupdated data:\n", getupdatedData);

        const updateVariable = await yearlyFunctions.updateTotalVariableExpenses("sammyork", "2022", "0");
        console.log("\n\n\n\n", updateVariable);
        const getupdatedData2 = await yearlyFunctions.getYearlySummary("sammyork", "2022");
        console.log("\n\nupdated data:\n", getupdatedData2);

        let breakdown2 = {entertainment: 200, clothing: 10, gas: 1000};
        const updateCat = await yearlyFunctions.updateTotalSpentPerCategory("sammyork", "2022", breakdown2);
        console.log("\n\n\n\n", updateCat);
        const getupdatedData3 = await yearlyFunctions.getYearlySummary("sammyork", "2022");
        console.log("\n\nupdated data:\n", getupdatedData3);

    }catch (e) {
        console.log(`Error: ${e}`)
    }
    

    await closeConnection(); //ends application 
    console.log('Done!'); 
}

main();