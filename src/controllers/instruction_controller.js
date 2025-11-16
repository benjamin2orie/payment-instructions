
import { parseInstruction } from '../utils/parser.js';
import Account from '../models/account.js';
import Transaction from '../models/transactions_model.js';

const SUPPORTED_CURRENCIES = ['NGN', 'USD', 'GBP', 'GHS'];

export const handleInstruction = async (req, res) => {
  // Extract request payload
  const { accounts, instruction } = req.body;

  // Parse the instruction string into structured data
  const parsed = parseInstruction(instruction);

  if (!parsed || !parsed.type) {
    return res.status(400).json({
      ...parsed,
      status: 'failed',
      status_reason: parsed?.status_reason || 'Invalid instruction format',
      status_code: parsed?.status_code || 'F01',
      accounts: []
    });
  }

     

  // Save or update each account in the database
  for (const acc of accounts) {
    await Account.findOneAndUpdate(
      { id: acc.id },
      { $set: { balance: acc.balance, currency: acc.currency } },
      { upsert: true, new: true }
    );
  }

  // If instruction is malformed, return error
  if (!parsed) {
    return res.status(400).json({
      type: null,
      amount: null,
      currency: null,
      debit_account: null,
      credit_account: null,
      execute_by: null,
      status: 'failed',
      status_reason: 'Malformed instruction: unable to parse keywords',
      status_code: 'SY03',
      accounts: []
    });
  }

  const { amount, currency, debit_account, credit_account } = parsed;

  // Validate supported currency
  if (!SUPPORTED_CURRENCIES.includes(currency)) {
    return res.status(400).json({
      ...parsed,
      status: 'failed',
      status_reason: 'Unsupported currency. Only NGN, USD, GBP, and GHS are supported',
      status_code: 'CU02',
      accounts: accounts.map(acc => ({
        ...acc,
        balance_before: acc.balance
      }))
    });
  }

  // Find debit and credit accounts from request
  const debitAcc = accounts.find(acc => acc.id === debit_account);
  const creditAcc = accounts.find(acc => acc.id === credit_account);

  //check if debit and credit are the same
  if (debit_account === credit_account) {
    return res.status(400).json({
      ...parsed,
      status: 'failed',
      status_reason: 'Debit and credit accounts cannot be the same',
      status_code: 'AC02',
      accounts: accounts.map(acc => ({
        ...acc,
        balance_before: acc.balance
      }))
    });
  } 


  //check if aacounts does not exist in an array
  if (!debitAcc && !creditAcc) {
    return res.status(400).json({
      ...parsed,
      status: 'failed',
      status_reason: 'Account not found"',
      status_code: 'AC03',
      accounts: accounts.map(acc => ({
        ...acc,
        balance_before: acc.balance
      }))
    });
  }

  //check if there is a missing key word
  if (!debit_account || !credit_account || !amount || !currency) {
    return res.status(400).json({
      ...parsed,
      status: 'failed',
      status_reason: 'Missing required keyword',
      status_code: 'SY01',
      accounts:accounts.map(acc => ({
        ...acc,
        balance_before: acc.balance
      }))
    });
  } 
  

  //validate if there no other accounts in the array

  if (!debitAcc || !creditAcc){
    return res.status(404).json({
      ...parsed,
      status: 'failed',
      status_reason: 'Account not found',
      status_code: 'AC03',
      accounts: accounts.map(acc => ({
        ...acc,
        balance_before: acc.balance
      }))
    });
  }
  // Validate account existence and currency consistency
  if (!debitAcc || !creditAcc || debitAcc.currency !== currency || creditAcc.currency !== currency) {
    return res.status(400).json({
      ...parsed,
      status: 'failed',
      status_reason: 'Account mismatch or currency inconsistency',
      status_code: 'CU01',
      accounts: accounts.map(acc => ({
        ...acc,
        balance_before: acc.balance
      }))
    });
  }


  // Check for sufficient funds
  if (debitAcc.balance < amount) {
    return res.status(400).json({
      ...parsed,
      status: 'failed',
      status_reason: 'Insufficient funds in debit account',
      status_code: 'AC01',
      accounts: accounts.map(acc => ({
        ...acc,
        balance_before: acc.balance
      }))
    });
  }

  // check if the amount is negative
  if (amount <= 0) {
    return res.status(400).json({
      ...parsed,
      status: 'failed',
      status_reason: 'Invalid amount: must be greater than zero',
      status_code: 'AM01',
      accounts: accounts.map(acc => ({
        ...acc,
        balance_before: acc.balance
      }))
    });
  }


  let updatedAccounts = accounts.map(acc => ({
  ...acc,
  balance_before: acc.balance
}));

if (parsed.status !== 'pending') {
  updatedAccounts = accounts.map(acc => {
    const balance_before = acc.balance;
    if (acc.id === debit_account) acc.balance -= amount;
    if (acc.id === credit_account) acc.balance += amount;
    return { ...acc, balance_before };
  });
}

  // Build transaction response object

    const transactionRecord = {
    ...parsed,
    status: parsed.status || 'successful',
    status_reason: parsed.status_reason ,
    status_code: parsed.status_code ,
    accounts: updatedAccounts
  };


  // Save transaction to MongoDB
  await Transaction.create(transactionRecord);

  // Return response to client
  return res.json(transactionRecord);
};





