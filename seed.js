

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

function getRandomDate(start, end ) {
    start = exportedMethods.checkDate(start);
    end = exportedMethods.checkDate(end);
    let startMonth = start.substring(0, 2);
    let startDay = start.substring(3, 5);
    let startYear = start.substring(6);

    let endMonth = end.substring(0, 2);
    let endDay = end.substring(3, 5);
    let endYear = end.substring(6);

    let startDate = new Date(startYear, startMonth - 1, startDay);
    let endDate = new Date(endYear, endMonth - 1, endDay);
    //let endDate = new Date();

    if (startDate > endDate) throw `Start date can not be after the current date`;

    let random = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    let randomDate = new Date(random);

    let rMonth = String(randomDate.getMonth() + 1).padStart(2, '0');
    let rDay = String(randomDate.getDate()).padStart(2, '0');
    let rYear = randomDate.getFullYear();
    return `${rMonth}/${rDay}/${rYear}`;
}

async function main() {
    
    try {
        console.log("seed file loaded!")
        let user1 = await users.register("Patrick", "Hill", "phill@stevens.edu", "male", "Hoboken", "NJ", "21", "Sectionb1*", "100000");
        //let user1 = await users.register("sam", "york", "samyork519@gmail.com", "female", "Hoboken", "NJ", "21", "Hello123*", "100000");
        let user1Id = user1.userId;
        let getUser = await users.getUserById(user1Id);
        //console.log(getUser);
        let categories = getUser.categories;
        //console.log(`Categories: ${categories}`);


        let today = new Date();
        let month = String(today.getMonth() + 1).padStart(2, '0');
        let day = String(today.getDate()).padStart(2, '0');
        let year = today.getFullYear();
        let currentDate = `${month}/${day}/${year}`;
        console.log("Checking date:", currentDate);

        for (let i = 0; i < 3; i++) {
            await incomeFunctions.addIncome(user1Id, getRandom(50, 15000).toString(), getRandomDate("05/01/2025", currentDate));
        }
        for (let i = 0; i < 20; i++) {
            await incomeFunctions.addIncome(user1Id, getRandom(50, 15000).toString(), getRandomDate("01/01/2025", currentDate));
        }
        for (let i = 0; i < 20; i++) {
            await incomeFunctions.addIncome(user1Id, getRandom(50, 1500).toString(), getRandomDate("01/01/2024", "12/31/2024"));
        }
        for (let i = 0; i < 20; i++) {
            await incomeFunctions.addIncome(user1Id, getRandom(50, 1500).toString(), getRandomDate("01/01/2023", "12/31/2023"));
        }
        for (let i = 0; i < 20; i++) {
            await incomeFunctions.addIncome(user1Id, getRandom(50, 1500).toString(), getRandomDate("01/01/2022", "12/31/2022"));
        }

        // let totalIncome = await incomeFunctions.getAllIncomeByUserId(user1Id);
        // console.log(`total income for ${user1Id}: ${totalIncome}\n`);

        //fixed expenses 
        let fixed1 = await users.addFixedExpensesById(user1Id, "utilities", "Rent", "2000");

        //varialbe expenses 
        for (let i = 0; i < 10; i++) {
            await transactionFunctions.addTransaction(user1Id, getRandom(0, 500).toString(), categories[getRandom(0, categories.length -1)], getRandomDate("05/01/2025", currentDate));
        }
        for (let i = 0; i < 20; i++) {
            await transactionFunctions.addTransaction(user1Id, getRandom(0, 500).toString(), categories[getRandom(0, categories.length -1)], getRandomDate("01/01/2025", currentDate));
        }
        for (let i = 0; i < 20; i++) {
            await transactionFunctions.addTransaction(user1Id, getRandom(0, 500).toString(), categories[getRandom(0, categories.length -1)], getRandomDate("01/01/2024", "12/31/2024"));
        }
        for (let i = 0; i < 20; i++) {
            await transactionFunctions.addTransaction(user1Id, getRandom(0, 500).toString(), categories[getRandom(0, categories.length -1)], getRandomDate("01/01/2023", "12/31/2023"));
        }
        for (let i = 0; i < 20; i++) {
            await transactionFunctions.addTransaction(user1Id, getRandom(0, 500).toString(), categories[getRandom(0, categories.length -1)], getRandomDate("01/01/2022", "12/31/2022"));
        }

        let year; 

        for(year = 2000; year < 2022; year++){
            await yearlyFunctions.addYearlySummary(user1Id, year.toString()); 
        }

    }catch (e) {
        console.log(`Error: ${e}`)
    }

    await closeConnection(); 
    console.log('Done!'); 
}

main();
