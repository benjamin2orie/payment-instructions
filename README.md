
# 💸 Payment Instruction API

This project provides a RESTful API for parsing and executing financial transactions based on natural language instructions. It supports immediate and scheduled transactions, validates account data, and stores transaction records in MongoDB.

---

## 🚀 Features

- Parse structured payment instructions like:
CREDIT 50 USD FROM ACCOUNT 9137390244 FOR DEBIT TO ACCOUNT 8142155367 ON 2025-11-17


- Supports future-dated transactions (`status: pending`)
- Validates account existence, currency consistency, and sufficient funds
- Tracks balance before and after transactions
- Stores transaction history in MongoDB
- Swagger documentation for easy testing and integration

---

## 🛠️ Tech Stack

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **Swagger** (OpenAPI 3.0)
- **date-fns** for date parsing and validation

---

## 📦 Installation

```bash
git clone https://github.com/benjamin2orie/payment-instructions.git
cd payment-instructions
npm install

.env 
 PORT=3000
 MONGO_DB_URI =<your db connection string>



Server is running on http://localhost:3000
API documentation available at http://localhost:3000/api-docs

start the server
 npm run dev


eployed api docs url: https://payment-instructions.onrender.com/api-docs