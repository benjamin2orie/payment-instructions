

import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  type: String,
  amount: Number,
  currency: String,
  debit_account: String,
  credit_account: String,
  execute_by: String,
  status: String,
  status_reason: String,
  status_code: String,
  accounts: [
    {
      id: String,
      balance: Number,
      balance_before: Number,
      currency: String
    }
  ]
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
