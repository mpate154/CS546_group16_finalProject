import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import validation from '../helper.js';
import bcrypt from 'bcryptjs';
const saltRounds = 16;

let exportedMethods = {
  async getUserById(id) {
    id = validation.checkId(id);
    const userCollection = await users();
    const user = await userCollection.findOne({_id: new ObjectId(id)});
    if (!user) throw 'Error: User not found';
    return user;
  },
  async register(firstName, lastName, email, gender, city, state, age, password, balance) {
    firstName = validation.checkFirstName(firstName);
    lastName = validation.checkLastName(lastName);
    email = validation.checkEmail(email);
    gender = validation.checkString(gender);
    city = validation.checkString(city);
    state = validation.checkString(state);
    age = validation.checkNumber(age);
    balance = validation.checkAmount(balance);
    password = validation.checkPassword(password);
    const hashedPassword= await bcrypt.hash(password, saltRounds);

    const usersCollection = await users();
    const existingUser = await usersCollection.findOne({ email: email });
    if (existingUser) {
      throw `A user with the email '${email}' already exists.`;
    }
    let newUser = {
      firstName: firstName,
      lastName: lastName,
      email : email,
      gender: gender,
      city: city,
      state : state,
      age: age,
      password: hashedPassword,
      categories: ['Groceries','Shopping','Restaurant','Transportation','Rent'],
      fixedExpenses: [],
      balance: balance
    };
    
    const insertInfo = await usersCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw 'Could not register user due to a database error.';
    }
    return { registrationCompleted: true };
  },
  async login(email,password) {

    email = validation.checkEmail(email);
    password = validation.checkPassword(password)
    email=email.toLowerCase();

    const usersCollection = await users();

    const existingUser = await usersCollection.findOne({ email: email });
    if (!existingUser) {
      throw `Either the userId or password is invalid`;
    }
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if(!passwordMatch){
      throw `Either the userId or password is invalid`;
    }
    
    return {
      id: existingUser._id.toString(),
      firstName: existingUser.firstName.trim(),
      lastName: existingUser.lastName.trim(),
      email: existingUser.email.trim(),
      gender: existingUser.gender.trim(),
      city: existingUser.city.trim(),
      state: existingUser.state.trim(),
      age: existingUser.age,
      balance: existingUser.balance,
      categories: existingUser.categories,
      fixedExpenses: existingUser.fixedExpenses
    };
  },
  async updateUserPut(id, firstName, lastName, email, gender, city, state, age, hashedPassword, balance) {
    id = validation.checkId(id);
    firstName = validation.checkFirstName(firstName);
    lastName = validation.checkLastName(lastName);
    email = validation.checkEmail(email);
    gender = validation.checkString(gender);
    city = validation.checkString(city);
    state = validation.checkString(state);
    age = validation.checkNumber(age);
    balance = validation.checkAmount(balance);

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
      password: hashedPassword,
      categories: usersCol.categories,
      fixedExpenses: usersCol.fixedExpenses,
      balance: balance
    };

    const updateInfo = await usersCollection.findOneAndUpdate(
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
    newCategory = validation.checkString(newCategory);

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
    categoryToDelete = validation.checkString(categoryToDelete);

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
    title = validation.checkString(title);
    category = validation.checkString(category);
    amount = validation.checkAmount(amount); 

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
    title = validation.checkString(title);
    category = validation.checkString(category);
    amount = validation.checkAmount(amount);
  
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
