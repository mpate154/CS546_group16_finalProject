

import {dbConnection, closeConnection} from './config/mongoConnections.js';
import yearlyFunctions from './data/yearlySummary.js'; 
import exportedMethods from './helpers.js';
import incomeFunctions from './data/income.js';
import transactionFunctions from './data/transactions.js';
import users from "./data/users.js";
import monthlySummaryFunctions from './data/monthlySummary.js';
import { income } from './config/mongoCollections.js';

const db = await dbConnection();
await db.dropDatabase();

function getRandom(min, max) {
    return Math.floor(Math.random() * (max-min + 1) + min)
}

function getRandomDate(start) {
    start = exportedMethods.checkDate(start);
    let month = start.substring(0, 2);
    let day = start.substring(3, 5);
    let year = start.substring(6);

    let startDate = new Date(year, month - 1, day);
    let endDate = new Date();

    if (startDate > endDate) throw `Start date can not be after the current date`;

    let random = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    let randomDate = new Date(random);

    let rMonth = String(randomDate.getMonth() + 1).padStart(2, '0');
    let rDay = String(randomDate.getDate()).padStart(2, '0');
    let rYear = randomDate.getFullYear();
    return `${rMonth}/${rDay}/${rYear}`;
}


async function main() {
    // for (let i = 0; i < 15; i++) {
    //     console.log(getRandomDate("01/14/2020"));
    // }
    
    try {
        console.log("seed file loaded!")
        //let user = await users.register("Patrick", "Hill", "phill@stevens.edu", "male", "Hoboken", "NJ", "21", "Sectionb1*", "100000");
        let user1 = await users.register("sam", "york", "samyork519@gmail.com", "female", "Hoboken", "NJ", "21", "Hello123*", "100000");
        let user1Id = user1.userId;
        let getUser = await users.getUserById(user1Id);
        console.log(getUser);
        let categories = getUser.categories;
        console.log(`Categories: ${categories}`);

        //income 
        await incomeFunctions.addIncome(user1Id, "2500", "01/10/2024");
        await incomeFunctions.addIncome(user1Id, "5000", "04/23/2024", "promotion");
        await incomeFunctions.addIncome(user1Id, "10000", "01/10/2025", "new job");
        await incomeFunctions.addIncome(user1Id, "7000", "04/23/2025", "bonus");
        let totalIncome = await incomeFunctions.getAllIncomeByUserId(user1Id);
        console.log(`total income for ${user1Id}: ${totalIncome}\n`);

        //fixed expenses 
        let fixed1 = await users.addFixedExpensesById(user1Id, "aptFees", "Rent", "100");

        //varialbe expenses 
        for (let i = 0; i < 20; i++) {
            await transactionFunctions.addTransaction(user1Id, getRandom(0, 500).toString(), categories[getRandom(0, categories.length -1)], getRandomDate("01/01/2024"));
        }
        await transactionFunctions.addTransaction(user1Id, "250", "Groceries", "05/05/2025");
        await transactionFunctions.addTransaction(user1Id, "100", "Transportation", "05/05/2025");

    }catch (e) {
        console.log(`Error: ${e}`)
    }

    await closeConnection(); 
    console.log('Done!'); 
}

main();