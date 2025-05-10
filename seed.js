

import {dbConnection, closeConnection} from './config/mongoConnections.js';
import yearlyFunctions from './data/yearlySummary.js'; 
import exportedMethods from './helpers.js';
import incomeFunctions from './data/income.js';
import transactionFunctions from './data/transactions.js';
import users from "./data/users.js";
import monthlySummaryFunctions from './data/monthlySummary.js';

const db = await dbConnection();
await db.dropDatabase();

async function main() {
    try {
        console.log("seed file loaded!")
        let user1 = await users.register("Patrick", "Hill", "phill@stevens.edu", "male", "Hoboken", "NJ", "21", "Sectionb1*", "100000");
        
    }catch (e) {
        console.log(`Error: ${e}`)
    }


    await closeConnection(); 
    console.log('Done!'); 
}

main();