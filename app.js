// import express from 'express';
// const app = express();
// import configRoutes from './routes/index.js';
// import exphbs from 'express-handlebars';

// const rewriteUnsupportedBrowserMethods = (req, res, next) => {
//   // If the user posts to the server with a property called _method, rewrite the request's method
//   // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
//   // rewritten in this middleware to a PUT route
//   if (req.body && req.body._method) {
//     req.method = req.body._method;
//     delete req.body._method;
//   }
//   // let the next middleware run:
//   next();
// };

// app.use('/public', express.static('public'));
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// app.use(rewriteUnsupportedBrowserMethods);

// app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

// configRoutes(app);

// app.listen(3000, () => {
//   console.log("We've now got a server!");
//   console.log('Your routes will be running on http://localhost:3000');
// });

//// THINGS TO TEST ///////////
// all wrong dates (ends of months) in add__.
// all wrong inputs in add
// wrong format dates in get by m/y
// dates past today, todays date
// transactions

import transactionFunctions from "./data/transactions.js";
import incomeFunctions from "./data/income.js";
import { users } from "./config/mongoCollections.js";
import { dbConnection, closeConnection } from "./config/mongoConnections.js";
import { ObjectId } from "mongodb";
//lets drop the database each time this is run

const db = await dbConnection();
await db.dropDatabase();

//defining these here so I can use them later in the function
let income1 = undefined;
let income2 = undefined;
let income3 = undefined;
let income4 = undefined;
let income5 = undefined;
let transaction1 = undefined;
let transaction2 = undefined;
let transaction3 = undefined;
let transaction4 = undefined;
let transaction5 = undefined;

//adding 2 users
let user1Id = new ObjectId();
let user1 = {
  _id: user1Id,
  categories: ["Groceries", "Shopping", "Car Payments"],
};

let user2Id = new ObjectId();
let user2 = {
  _id: user2Id,
  categories: ["Groceries", "Hair", "College Payments"],
};

const userCollection = await users();
const userInfo1 = await userCollection.insertOne(user1);
if (!userInfo1) throw "couldn't insert user 1";
const userInfo2 = await userCollection.insertOne(user2);
if (!userInfo2) throw "couldn't insert user 2";

user1Id = user1Id.toString();
user2Id = user2Id.toString();

console.log("Populating database");
try {
  transaction1 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "23.5",
    "Groceries",
    "02/12/2025",
    "From susan garage cleanup."
  );
  console.log(transaction1);
} catch (e) {
  console.error(e);
}

try {
  transaction2 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "100",
    "Shopping",
    "03/29/2024",
    ""
  );
  console.log(transaction2);
} catch (e) {
  console.error(e);
}

try {
  transaction3 = await transactionFunctions.addTransaction(
    user2._id.toString(),
    "18",
    "Hair",
    "11/09/2023",
    "cafe"
  );
  console.log(transaction3);
} catch (e) {
  console.error(e);
}

try {
  transaction4 = await transactionFunctions.addTransaction(
    user2._id.toString(),
    "32.75",
    "Groceries",
    "09/12/2023",
    "PostMan"
  );
  console.log(transaction4);
} catch (e) {
  console.error(e);
}

try {
  transaction5 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "100",
    "Car Payments",
    "4/27/2025",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction5");
} catch (e) {
  console.log(e);
}

try {
  let transaction6 = await transactionFunctions.addTransaction(
    user1._id,
    "100",
    "Groceries",
    "04/27/2025",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction6");
} catch (e) {
  console.log(e);
}
try {
  let transaction7 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    100,
    "Groceries",
    "04/27/2025",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction7");
} catch (e) {
  console.log(e);
}

try {
  let transaction8 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "100.076",
    "Groceries",
    "04/27/2025",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction8");
} catch (e) {
  console.log(e);
}

try {
  let transaction9 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "100.76",
    "Groceries",
    "02/29/2025",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction9");
} catch (e) {
  console.log(e);
}

try {
  let transaction10 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "100.76",
    "Groceries",
    "02/30/2025",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction10");
} catch (e) {
  console.log(e);
}

try {
  let transaction11 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "100.76",
    "Groceries",
    "04/31/2024",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction11");
} catch (e) {
  console.log(e);
}
try {
  let transaction12 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "100.76",
    "Groceries",
    "06/31/2024",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction12");
} catch (e) {
  console.log(e);
}

try {
  let transaction13 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "100.76",
    "Groceries",
    "09/31/2024",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction13");
} catch (e) {
  console.log(e);
}

try {
  let transaction14 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "100.76",
    "Groceries",
    "04/29/2025",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction15");
} catch (e) {
  console.log(e);
}

try {
  let transaction14 = await transactionFunctions.addTransaction(
    "",
    "100.76",
    "Groceries",
    "04/26/2025",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction15");
} catch (e) {
  console.log(e);
}

try {
  let transaction14 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "",
    "Groceries",
    "04/26/2025",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction17");
} catch (e) {
  console.log(e);
}

try {
  let transaction14 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "77",
    "Groceries",
    "",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction18");
} catch (e) {
  console.log(e);
}

try {
  let transaction14 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "100.76",
    "Groceries",
    "04/2/2025",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction19");
} catch (e) {
  console.log(e);
}
try {
  let transaction14 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "100.76",
    "Groceries",
    "04/02/2027",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction20");
} catch (e) {
  console.log(e);
}

try {
  let transaction14 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "100.76",
    "Groceries",
    "04/02/25",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction21");
} catch (e) {
  console.log(e);
}

try {
  let transaction14 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "100.76",
    "",
    "04/02/25",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction22");
} catch (e) {
  console.log(e);
}

try {
  let transaction14 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "100.76",
    "notcategory",
    "04/02/25",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction23");
} catch (e) {
  console.log(e);
}

try {
  let transaction14 = await transactionFunctions.addTransaction(
    user1._id.toString(),
    "100.76",
    [],
    "04/02/25",
    "GOT PAID"
  );
  console.error("This shouldn't have passed transaction24");
} catch (e) {
  console.log(e);
}

//getting transactions
try {
  let getTransaction2 = await transactionFunctions.getTransactionById(
    transaction2._id.toString()
  );
  console.log("This: ");
  console.log(getTransaction2);
  console.log("Should match: ");
  console.log(transaction2);
} catch (e) {
  console.error(e);
}

try {
  let getTransaction4 = await transactionFunctions.getTransactionById(
    transaction4._id.toString()
  );
  console.log("This: ");
  console.log(getTransaction4);
  console.log("Should match: ");
  console.log(transaction4);
} catch (e) {
  console.error(e);
}

try {
  let getTransaction4 = await transactionFunctions.getTransactionById(
    new ObjectId()
  );
  console.error("This should error!");
} catch (e) {
  console.log(e);
}

try {
  let getTransaction4 = await transactionFunctions.getTransactionById(
    new ObjectId().toString()
  );
  console.error("This should error!");
} catch (e) {
  console.log(e);
}

try {
  let getTransaction4 = await transactionFunctions.getTransactionById("");
  console.error("This should error!");
} catch (e) {
  console.log(e);
}

try {
  let getTransaction4 = await transactionFunctions.getTransactionById(
    "almaoksm"
  );
  console.error("This should error!");
} catch (e) {
  console.log(e);
}

try {
  let getTransaction4 = await transactionFunctions.getTransactionById([]);
  console.error("This should error!");
} catch (e) {
  console.log(e);
}

// by userid

try {
  let allUser1Incomes = await transactionFunctions.getAllTransactionsByUserId(
    user1Id
  );
  console.log("Should be 2 transactions");
  console.log(allUser1Incomes);
} catch (e) {
  console.error(e);
}

try {
  let allUser2Incomes = await transactionFunctions.getAllTransactionsByUserId(
    user2Id
  );
  console.log("Should be 2 transactions");
  console.log(allUser2Incomes);
} catch (e) {
  console.error(e);
}

try {
  let getTransaction4 = await transactionFunctions.getAllTransactionsByUserId(
    transaction4._id
  );
  console.error("This should error!");
} catch (e) {
  console.log(e);
}

try {
  let getTransaction4 = await transactionFunctions.getAllTransactionsByUserId(
    new ObjectId()
  );
  console.error("This should error!");
} catch (e) {
  console.log(e);
}

try {
  let getTransaction4 = await transactionFunctions.getAllTransactionsByUserId(
    new ObjectId().toString()
  );
  console.error("This should error!");
} catch (e) {
  console.log(e);
}

try {
  let getTransaction4 = await transactionFunctions.getAllTransactionsByUserId(
    ""
  );
  console.error("This should error!");
} catch (e) {
  console.log(e);
}

try {
  let getTransaction4 = await transactionFunctions.getAllTransactionsByUserId(
    "almaoksm"
  );
  console.error("This should error!");
} catch (e) {
  console.log(e);
}

try {
  let getTransaction4 = await transactionFunctions.getAllTransactionsByUserId(
    []
  );
  console.error("This should error!");
} catch (e) {
  console.log(e);
}

// by month and year
try {
  let allUser1Incomes_02_2025 =
    await transactionFunctions.getTransactionsByUserIdByMonthAndYear(
      user1Id,
      "02",
      "2025"
    );
  console.log("Should be 1 transaction: garage");
  console.log(allUser1Incomes_02_2025);
} catch (e) {
  console.error(e);
}
try {
  let allUser2Incomes_09_2023 =
    await transactionFunctions.getTransactionsByUserIdByMonthAndYear(
      user2Id,
      "09",
      "2023"
    );
  console.log("Should be 1 transaction: Postman");
  console.log(allUser2Incomes_09_2023);
} catch (e) {
  console.error(e);
}

try {
  let error = await transactionFunctions.getTransactionsByUserIdByMonthAndYear(
    new ObjectId(),
    "09",
    "2023"
  );
  console.error("This should error bro");
} catch (e) {
  console.log(e);
}

try {
  let error = await transactionFunctions.getTransactionsByUserIdByMonthAndYear(
    new ObjectId().toString(),
    "09",
    "2023"
  );
  console.error("This should error bro");
} catch (e) {
  console.log(e);
}

try {
  let error = await transactionFunctions.getTransactionsByUserIdByMonthAndYear(
    user2Id,
    "9",
    "2023"
  );
  console.error("This should error bro");
} catch (e) {
  console.log(e);
}

try {
  let error = await transactionFunctions.getTransactionsByUserIdByMonthAndYear(
    user2Id,
    "07",
    "2021"
  );
  console.error("This should error bro");
} catch (e) {
  console.log(e);
}

try {
  let error = await transactionFunctions.getTransactionsByUserIdByMonthAndYear(
    user2Id,
    "09",
    "23"
  );
  console.error("This should error bro");
} catch (e) {
  console.log(e);
}

// by year

try {
  let allUser1Incomes2025 =
    await transactionFunctions.getTransactionsByUserIdByYear(user1Id, "2025");
  console.log("Should be 1 transaction: ");
  console.log(allUser1Incomes2025);
} catch (e) {
  console.error(e);
}

try {
  let allUser2Incomes2023 =
    await transactionFunctions.getTransactionsByUserIdByYear(user2Id, "2023");
  console.log("Should be 2 transaction: ");
  console.log(allUser2Incomes2023);
} catch (e) {
  console.error(e);
}

try {
  let error = await transactionFunctions.getTransactionsByUserIdByYear(
    new ObjectId(),
    "2023"
  );
  console.error("This should error bro");
} catch (e) {
  console.log(e);
}

try {
  let error = await transactionFunctions.getTransactionsByUserIdByYear(
    new ObjectId().toString(),
    "2023"
  );
  console.error("This should error bro");
} catch (e) {
  console.log(e);
}

try {
  let error = await transactionFunctions.getTransactionsByUserIdByYear(
    user2Id,
    "2021"
  );
  console.error("This should error bro");
} catch (e) {
  console.log(e);
}

try {
  let error = await transactionFunctions.getTransactionsByUserIdByYear(
    user2Id,
    "23"
  );
  console.error("This should error bro");
} catch (e) {
  console.log(e);
}

//removing

try {
  let removeIncome2 =
    await transactionFunctions.removeTransactionByTransactionId(
      transaction2._id.toString()
    );
  console.log("Should be transaction 2:");
  console.log(transaction2);
  console.log(removeIncome2);
} catch (e) {
  console.error(e);
}

try {
  let removeIncome4 =
    await transactionFunctions.removeTransactionByTransactionId(
      transaction4._id.toString()
    );
  console.log("Should be transaction 4:");
  console.log(transaction4);
  console.log(removeIncome4);
} catch (e) {
  console.error(e);
}

try {
  let removeIncome2 =
    await transactionFunctions.removeTransactionByTransactionId(
      transaction2._id
    );
  console.error("should error.");
} catch (e) {
  console.log(e);
}

try {
  let removeIncome2 =
    await transactionFunctions.removeTransactionByTransactionId(new ObjectId());
  console.error("should error.");
} catch (e) {
  console.log(e);
}

try {
  let removeIncome2 =
    await transactionFunctions.removeTransactionByTransactionId(
      new ObjectId().toString()
    );
  console.error("should error.");
} catch (e) {
  console.log(e);
}

try {
  let removeIncome2 =
    await transactionFunctions.removeTransactionByTransactionId("");
  console.error("should error.");
} catch (e) {
  console.log(e);
}

try {
  let removeIncome2 =
    await transactionFunctions.removeTransactionByTransactionId([]);
  console.error("should error.");
} catch (e) {
  console.log(e);
}

try {
  let removeIncome2 =
    await transactionFunctions.removeTransactionByTransactionId("   ");
  console.error("should error.");
} catch (e) {
  console.log(e);
}

//for transaction, add a dummy user to the database

await closeConnection(); //need so program exits/ends
console.log("Done!");

////////////////////////////////////// INCOME /////////////////////////////////////////////////

// //defining these here so I can use them later in the function
// let income1 = undefined;
// let income2 = undefined;
// let income3 = undefined;
// let income4 = undefined;
// let income5 = undefined;
// let transaction1 = undefined;
// let transaction2 = undefined;
// let transaction3 = undefined;
// let transaction4 = undefined;
// let transaction5 = undefined;

// //adding 2 users
// let user1Id = new ObjectId();
// let user1 = {
//   _id: user1Id,
//   categories: ["Groceries", "Shopping", "Car Payments"],
// };

// let user2Id = new ObjectId();
// let user2 = {
//   _id: user2Id,
//   categories: ["Groceries", "Hair", "College Payments"],
// };

// const userCollection = await users();
// const userInfo1 = await userCollection.insertOne(user1);
// if (!userInfo1) throw "couldn't insert user 1";
// const userInfo2 = await userCollection.insertOne(user2);
// if (!userInfo2) throw "couldn't insert user 2";

// user1Id = user1Id.toString();
// user2Id = user2Id.toString();

// console.log("Populating database");
// try {
//   income1 = await incomeFunctions.addIncome(
//     user1._id.toString(),
//     "23.5",
//     "02/12/2025",
//     "From susan garage cleanup."
//   );
//   console.log(income1);
// } catch (e) {
//   console.error(e);
// }

// try {
//   income2 = await incomeFunctions.addIncome(
//     user1._id.toString(),
//     "100",
//     "03/29/2024",
//     ""
//   );
//   console.log(income2);
// } catch (e) {
//   console.error(e);
// }

// try {
//   income3 = await incomeFunctions.addIncome(
//     user2._id.toString(),
//     "18",
//     "11/09/2023",
//     "cafe"
//   );
//   console.log(income3);
// } catch (e) {
//   console.error(e);
// }

// try {
//   income4 = await incomeFunctions.addIncome(
//     user2._id.toString(),
//     "32.75",
//     "09/12/2023",
//     "PostMan"
//   );
//   console.log(income4);
// } catch (e) {
//   console.error(e);
// }

// try {
//   income5 = await incomeFunctions.addIncome(
//     user1._id.toString(),
//     "100",
//     "4/27/2025",
//     "GOT PAID"
//   );
//   console.error("This shouldn't have passed income5");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let income6 = await incomeFunctions.addIncome(
//     user1._id,
//     "100",
//     "04/27/2025",
//     "GOT PAID"
//   );
//   console.error("This shouldn't have passed income6");
// } catch (e) {
//   console.log(e);
// }
// try {
//   let income7 = await incomeFunctions.addIncome(
//     user1._id.toString(),
//     100,
//     "04/27/2025",
//     "GOT PAID"
//   );
//   console.error("This shouldn't have passed income7");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let income8 = await incomeFunctions.addIncome(
//     user1._id.toString(),
//     "100.076",
//     "04/27/2025",
//     "GOT PAID"
//   );
//   console.error("This shouldn't have passed income8");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let income9 = await incomeFunctions.addIncome(
//     user1._id.toString(),
//     "100.76",
//     "02/29/2025",
//     "GOT PAID"
//   );
//   console.error("This shouldn't have passed income9");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let income10 = await incomeFunctions.addIncome(
//     user1._id.toString(),
//     "100.76",
//     "02/30/2025",
//     "GOT PAID"
//   );
//   console.error("This shouldn't have passed income10");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let income11 = await incomeFunctions.addIncome(
//     user1._id.toString(),
//     "100.76",
//     "04/31/2024",
//     "GOT PAID"
//   );
//   console.error("This shouldn't have passed income11");
// } catch (e) {
//   console.log(e);
// }
// try {
//   let income12 = await incomeFunctions.addIncome(
//     user1._id.toString(),
//     "100.76",
//     "06/31/2024",
//     "GOT PAID"
//   );
//   console.error("This shouldn't have passed income12");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let income13 = await incomeFunctions.addIncome(
//     user1._id.toString(),
//     "100.76",
//     "09/31/2024",
//     "GOT PAID"
//   );
//   console.error("This shouldn't have passed income13");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let income14 = await incomeFunctions.addIncome(
//     user1._id.toString(),
//     "100.76",
//     "04/28/2025",
//     "GOT PAID"
//   );
//   console.error("This shouldn't have passed income14");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let income14 = await incomeFunctions.addIncome(
//     "",
//     "100.76",
//     "04/26/2025",
//     "GOT PAID"
//   );
//   console.error("This shouldn't have passed income14");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let income14 = await incomeFunctions.addIncome(
//     user1._id.toString(),
//     "",
//     "04/26/2025",
//     "GOT PAID"
//   );
//   console.error("This shouldn't have passed income14");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let income14 = await incomeFunctions.addIncome(
//     user1._id.toString(),
//     "77",
//     "",
//     "GOT PAID"
//   );
//   console.error("This shouldn't have passed income14");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let income14 = await incomeFunctions.addIncome(
//     user1._id.toString(),
//     "100.76",
//     "04/2/2025",
//     "GOT PAID"
//   );
//   console.error("This shouldn't have passed income14");
// } catch (e) {
//   console.log(e);
// }
// try {
//   let income14 = await incomeFunctions.addIncome(
//     user1._id.toString(),
//     "100.76",
//     "04/02/2027",
//     "GOT PAID"
//   );
//   console.error("This shouldn't have passed income14");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let income14 = await incomeFunctions.addIncome(
//     user1._id.toString(),
//     "100.76",
//     "04/02/25",
//     "GOT PAID"
//   );
//   console.error("This shouldn't have passed income14");
// } catch (e) {
//   console.log(e);
// }

// //getting incomes
// try {
//   let getIncome2 = await incomeFunctions.getIncomeById(income2._id.toString());
//   console.log("This: ");
//   console.log(getIncome2);
//   console.log("Should match: ");
//   console.log(income2);
// } catch (e) {
//   console.error(e);
// }

// try {
//   let getIncome4 = await incomeFunctions.getIncomeById(income4._id.toString());
//   console.log("This: ");
//   console.log(getIncome4);
//   console.log("Should match: ");
//   console.log(income4);
// } catch (e) {
//   console.error(e);
// }

// try {
//   let getIncome4 = await incomeFunctions.getIncomeById(new ObjectId());
//   console.error("This should error!");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let getIncome4 = await incomeFunctions.getIncomeById(
//     new ObjectId().toString()
//   );
//   console.error("This should error!");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let getIncome4 = await incomeFunctions.getIncomeById("");
//   console.error("This should error!");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let getIncome4 = await incomeFunctions.getIncomeById("almaoksm");
//   console.error("This should error!");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let getIncome4 = await incomeFunctions.getIncomeById([]);
//   console.error("This should error!");
// } catch (e) {
//   console.log(e);
// }

// // by userid

// try {
//   let allUser1Incomes = await incomeFunctions.getAllIncomeByUserId(user1Id);
//   console.log("Should be 2 incomes");
//   console.log(allUser1Incomes);
// } catch (e) {
//   console.error(e);
// }

// try {
//   let allUser2Incomes = await incomeFunctions.getAllIncomeByUserId(user2Id);
//   console.log("Should be 2 incomes");
//   console.log(allUser2Incomes);
// } catch (e) {
//   console.error(e);
// }

// try {
//   let getIncome4 = await incomeFunctions.getAllIncomeByUserId(income4._id);
//   console.error("This should error!");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let getIncome4 = await incomeFunctions.getAllIncomeByUserId(new ObjectId());
//   console.error("This should error!");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let getIncome4 = await incomeFunctions.getAllIncomeByUserId(
//     new ObjectId().toString()
//   );
//   console.error("This should error!");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let getIncome4 = await incomeFunctions.getAllIncomeByUserId("");
//   console.error("This should error!");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let getIncome4 = await incomeFunctions.getAllIncomeByUserId("almaoksm");
//   console.error("This should error!");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let getIncome4 = await incomeFunctions.getAllIncomeByUserId([]);
//   console.error("This should error!");
// } catch (e) {
//   console.log(e);
// }

// // by month and year
// try {
//   let allUser1Incomes_02_2025 =
//     await incomeFunctions.getIncomeByUserIdByMonthAndYear(
//       user1Id,
//       "02",
//       "2025"
//     );
//   console.log("Should be 1 income: garage");
//   console.log(allUser1Incomes_02_2025);
// } catch (e) {
//   console.error(e);
// }
// try {
//   let allUser2Incomes_09_2023 =
//     await incomeFunctions.getIncomeByUserIdByMonthAndYear(
//       user2Id,
//       "09",
//       "2023"
//     );
//   console.log("Should be 1 income: Postman");
//   console.log(allUser2Incomes_09_2023);
// } catch (e) {
//   console.error(e);
// }

// try {
//   let error = await incomeFunctions.getIncomeByUserIdByMonthAndYear(
//     new ObjectId(),
//     "09",
//     "2023"
//   );
//   console.error("This should error bro");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let error = await incomeFunctions.getIncomeByUserIdByMonthAndYear(
//     new ObjectId().toString(),
//     "09",
//     "2023"
//   );
//   console.error("This should error bro");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let error = await incomeFunctions.getIncomeByUserIdByMonthAndYear(
//     user2Id,
//     "9",
//     "2023"
//   );
//   console.error("This should error bro");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let error = await incomeFunctions.getIncomeByUserIdByMonthAndYear(
//     user2Id,
//     "07",
//     "2021"
//   );
//   console.error("This should error bro");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let error = await incomeFunctions.getIncomeByUserIdByMonthAndYear(
//     user2Id,
//     "09",
//     "23"
//   );
//   console.error("This should error bro");
// } catch (e) {
//   console.log(e);
// }

// // by year

// try {
//   let allUser1Incomes2025 = await incomeFunctions.getIncomeByUserIdByYear(
//     user1Id,
//     "2025"
//   );
//   console.log("Should be 1 income: ");
//   console.log(allUser1Incomes2025);
// } catch (e) {
//   console.error(e);
// }

// try {
//   let allUser2Incomes2023 = await incomeFunctions.getIncomeByUserIdByYear(
//     user2Id,
//     "2023"
//   );
//   console.log("Should be 2 income: ");
//   console.log(allUser2Incomes2023);
// } catch (e) {
//   console.error(e);
// }

// try {
//   let error = await incomeFunctions.getIncomeByUserIdByYear(
//     new ObjectId(),
//     "2023"
//   );
//   console.error("This should error bro");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let error = await incomeFunctions.getIncomeByUserIdByYear(
//     new ObjectId().toString(),
//     "2023"
//   );
//   console.error("This should error bro");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let error = await incomeFunctions.getIncomeByUserIdByYear(user2Id, "2021");
//   console.error("This should error bro");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let error = await incomeFunctions.getIncomeByUserIdByYear(user2Id, "23");
//   console.error("This should error bro");
// } catch (e) {
//   console.log(e);
// }

// //removing

// try {
//   let removeIncome2 = await incomeFunctions.removeIncomeByIncomeId(
//     income2._id.toString()
//   );
//   console.log("Should be income 2:");
//   console.log(income2);
//   console.log(removeIncome2);
// } catch (e) {
//   console.error(e);
// }

// try {
//   let removeIncome4 = await incomeFunctions.removeIncomeByIncomeId(
//     income4._id.toString()
//   );
//   console.log("Should be income 4:");
//   console.log(income4);
//   console.log(removeIncome4);
// } catch (e) {
//   console.error(e);
// }

// try {
//   let removeIncome2 = await incomeFunctions.removeIncomeByIncomeId(income2._id);
//   console.error("should error.");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let removeIncome2 = await incomeFunctions.removeIncomeByIncomeId(
//     new ObjectId()
//   );
//   console.error("should error.");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let removeIncome2 = await incomeFunctions.removeIncomeByIncomeId(
//     new ObjectId().toString()
//   );
//   console.error("should error.");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let removeIncome2 = await incomeFunctions.removeIncomeByIncomeId(
//     ""
//   );
//   console.error("should error.");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let removeIncome2 = await incomeFunctions.removeIncomeByIncomeId(
//     []
//   );
//   console.error("should error.");
// } catch (e) {
//   console.log(e);
// }

// try {
//   let removeIncome2 = await incomeFunctions.removeIncomeByIncomeId(
//     "   "
//   );
//   console.error("should error.");
// } catch (e) {
//   console.log(e);
// }

// //for transaction, add a dummy user to the database

// await closeConnection(); //need so program exits/ends
// console.log("Done!");
