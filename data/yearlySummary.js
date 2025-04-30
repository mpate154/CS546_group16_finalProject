import {users} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import validation from '../helper.js';

let exportedMethods = {

  async getAllTransactionsByUserId(userId) {
  },
  async addTransaction(userId, amount, category, date, description) {
  },
  async updateTransactionById(id, amount, category, date, description) {
  },

  async getTransactionByUserIDbyMonthYear(userID, month, year){
  },
  async getTransactionByUserIDbyYear(userID, year){
  }

};

export default exportedMethods;