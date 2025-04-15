import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import validation from '../helper.js';

let exportedMethods = {

  async getUserById(id) {
    id = validation.checkId(id);
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)});
    if (!user) throw 'Error: User not found';
    return user;
  },
  async addUser(firstName, lastName, email, gender, city, state, age, hashedPassword, balance) {
    firstName = validation.checkString(firstName, 'First name');
    lastName = validation.checkString(lastName, 'Last name');
    email = validation.checkEmail(email, 'Email');
    gender = validation.checkString(gender,'Gender');
    city = validation.checkString(city,'City');
    state = validation.checkString(state,'State');
    age = validation.checkAge(age,'Age');
    balance = validation.checkBalance(balance,'Balance');

    let newUser = {
      firstName: firstName,
      lastName: lastName,
      email : email,
      gender: gender,
      city: city,
      state : state,
      age: age,
      hashedPassword: hashedPassword,
      categories: ['Groceries','Shopping','Restaurant','Transportation','Rent'],
      fixedExpenses: [],
      balance: balance
    };
    const userCollection = await users();
    const newInsertInformation = await userCollection.insertOne(newUser);
    if (!newInsertInformation.insertedId) throw 'Insert failed!';
    return await this.getUserById(newInsertInformation.insertedId.toString());
  },
  async updateUserPut(id, firstName, lastName, email, gender, city, state, age, hashedPassword, balance) {
    id = validation.checkId(id);
    firstName = validation.checkString(firstName, 'first name');
    lastName = validation.checkString(lastName, 'last name');
    email = validation.checkEmail(email, 'Email');
    gender = validation.checkString(gender,'Gender');
    city = validation.checkString(city,'City');
    state = validation.checkString(state,'State');
    age = validation.checkAge(age,'Age');
    balance = validation.checkBalance(balance,'Balance');

    const usersCollection = await users();
    const usersCol = await usersCollection.findOne({_id: new ObjectId(id)});
    if (usersCol === null) throw 'No user with that id';

    const userUpdateInfo = {
      firstName: firstName,
      lastName: lastName,
      email : email,
      gender: gender,
      city: city,
      state : state,
      age: age,
      hashedPassword: hashedPassword,
      categories: usersCol.categories,
      fixedExpenses: usersCol.fixedExpenses,
      balance: balance
    };

    const userCollection = await users();
    const updateInfo = await userCollection.findOneAndUpdate(
      {_id: new ObjectId(id)},
      {$set: userUpdateInfo},
      {returnDocument: 'after'}
    );
    if (updateInfo.lastErrorObject.n === 0)
      throw [
        404,
        `Error: Update failed, could not find a user with id of ${id}`
      ];

    return await updateInfo.value;
  },
  async addCategoryById(userID, newCategory) {

    userID = validation.checkId(userID);
    newCategory = validation.checkString(newCategory, 'Category');

    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(userID)});
    if (!user) throw 'User not found';

    // Check for duplicates
    if (user.categories.includes(newCategory)) {
      throw `Error: Category '${newCategory}' already exists`;
    }

    const updatedInfo = await userCollection.findOneAndUpdate(
      {_id: new ObjectId(userID)},
      {$push: {categories: newCategory}},
      {returnDocument: 'after'}
    );

    if (!updatedInfo.value) throw 'Error: Could not add category';
    return updatedInfo.value;
  },
  async deleteCategoryById(userID, categoryToDelete) {

    userID = validation.checkId(userID);
    categoryToDelete = validation.checkString(categoryToDelete, 'Category');

    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(userID)});
    if (!user) throw 'User not found';

    if (!user.categories.includes(categoryToDelete)) {
      throw `Error: Category '${categoryToDelete}' not found`;
    }

    const updatedInfo = await userCollection.findOneAndUpdate(
      {_id: new ObjectId(userID)},
      {$pull: {categories: categoryToDelete}},
      {returnDocument: 'after'}
    );

    if (!updatedInfo.value) throw 'Error: Could not delete category';
    return updatedInfo.value;
  },
  async addFixedExpensesById(userID, title, category, amount){
    userID = validation.checkId(userID);
    title = validation.checkString(title, 'Title');
    category = validation.checkString(category, 'Category');
    amount = validation.checkBalance(amount, 'Amount'); 

    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(userID)});
    if (!user) throw 'User not found';

    const newFixedExpense = {
      _id: new ObjectId(),
      title: title,
      category: category,
      amount: amount
    };

    const updatedInfo = await userCollection.findOneAndUpdate(
      {_id: new ObjectId(userID)},
      {$push: {fixedExpenses: newFixedExpense}},
      {returnDocument: 'after'}
    );

    if (!updatedInfo.value) throw 'Error: Could not add fixed expense';
    return updatedInfo.value;

  },
  async deleteFixedExpenseById(userID, expenseID) {
    userID = validation.checkId(userID);
    expenseID = validation.checkId(expenseID);
  
    const userCollection = await users();
  
    const updateResult = await userCollection.findOneAndUpdate(
      { _id: new ObjectId(userID) },
      {
        $pull: {
          fixedExpenses: { _id: new ObjectId(expenseID) }
        }
      },
      { returnDocument: 'after' }
    );
  
    if (!updateResult.value) throw 'Error: Could not delete the fixed expense';
    return updateResult.value;
  },
  async updateFixedExpenseById(userID, expenseID, title, category, amount) {
    userID = validation.checkId(userID);
    expenseID = validation.checkId(expenseID);
    title = validation.checkString(title, 'Title');
    category = validation.checkString(category, 'Category');
    amount = validation.checkBalance(amount, 'Amount');
  
    const userCollection = await users();
  
    const updatedExpense = {
      'fixedExpenses.$.title': title,
      'fixedExpenses.$.category': category,
      'fixedExpenses.$.amount': amount
    };
  
    const updateResult = await userCollection.findOneAndUpdate(
      {
        _id: new ObjectId(userID),
        'fixedExpenses._id': new ObjectId(expenseID)
      },
      {
        $set: updatedExpense
      },
      { returnDocument: 'after' }
    );
  
    if (!updateResult.value) throw 'Error: Could not update the fixed expense';
    return updateResult.value;
  }
  
};

export default exportedMethods;
