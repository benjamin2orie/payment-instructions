

import {
  parseISO,
  isValid,
  format,
  startOfDay,
  differenceInCalendarDays
} from 'date-fns';

export const parseInstruction = (instruction) => {
  const words = instruction.trim().split(/\s+/);
  const upperWords = words.map(w => w.toUpperCase());

  let execute_by = null;
  let status = 'successful';
  let status_code = 'AP00';
  let status_reason = 'Transaction executed successfully';

  // Check for optional ON [date]
  if (upperWords.includes('ON')) {
    const onIndex = upperWords.indexOf('ON');
    const dateStr = words[onIndex + 1];

    const rawDate = parseISO(dateStr);
    if (!isValid(rawDate)) {
      return {
        type: null,
        amount: null,
        currency: null,
        debit_account: null,
        credit_account: null,
        execute_by: null,
        status: 'failed',
        status_reason: 'Invalid date format: expected YYYY-MM-DD',
        status_code: 'DT01',
        accounts: []
      };
    }

    const parsedDate = startOfDay(rawDate);
    const today = startOfDay(new Date());
    const daysDiff = differenceInCalendarDays(parsedDate, today);

    execute_by = format(parsedDate, 'yyyy-MM-dd');

    if (daysDiff > 0) {
      status = 'pending';
      status_code = 'AP02';
      status_reason = 'Transaction scheduled for future execution';
    }

    words.splice(onIndex, 2); // remove ON and date
  }

  // DEBIT format
  if (
    words.length === 11 &&
    upperWords[0] === 'DEBIT' &&
    upperWords[3] === 'FROM' &&
    upperWords[4] === 'ACCOUNT' &&
    upperWords[6] === 'FOR' &&
    upperWords[7] === 'CREDIT' &&
    upperWords[8] === 'TO' &&
    upperWords[9] === 'ACCOUNT'
  ) {
    const amount = parseFloat(words[1]);
    const currency = upperWords[2];
    const debit_account = words[5];
    const credit_account = words[10];

    if (isNaN(amount) || !Number.isInteger(amount)) {
      return {
        type: null,
        amount: null,
        currency: null,
        debit_account: null,
        credit_account: null,
        execute_by: null,
        status: 'failed',
        status_reason: 'Amount must be a positive integer',
        status_code: 'AM01',
        accounts: []
      };
    }

    return {
      type: 'DEBIT',
      amount,
      currency,
      debit_account,
      credit_account,
      execute_by,
      status,
      status_code,
      status_reason
    };
  }

  // CREDIT format
  if (
    words.length === 11 &&
    upperWords[0] === 'CREDIT' &&
    upperWords[3] === 'FROM' &&
    upperWords[4] === 'ACCOUNT' &&
    upperWords[6] === 'FOR' &&
    upperWords[7] === 'DEBIT' &&
    upperWords[8] === 'TO' &&
    upperWords[9] === 'ACCOUNT'
  ) {
    const amount = parseFloat(words[1]);
    const currency = upperWords[2];
    const credit_account = words[5];
    const debit_account = words[10];

    if (isNaN(amount) || !Number.isInteger(amount)) {
      return {
        type: null,
        amount: null,
        currency: null,
        debit_account: null,
        credit_account: null,
        execute_by: null,
        status: 'failed',
        status_reason: 'Amount must be a positive integer',
        status_code: 'AM01',
        accounts: []
      };
    }

    return {
      type: 'CREDIT',
      amount,
      currency,
      debit_account,
      credit_account,
      execute_by,
      status,
      status_code,
      status_reason
    };
  }

  // Fallback return
  return {
    type: null,
    amount: null,
    currency: null,
    debit_account: null,
    credit_account: null,
    execute_by,
    status,
    status_code,
    status_reason,
    accounts: []
  };

  
};

