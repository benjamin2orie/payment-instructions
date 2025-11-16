
import express from 'express';
import { handleInstruction } from '../controllers/instruction_controller.js';

const router = express.Router();

/**
 * @swagger
 * /payment-instructions:
 *   post:
 *     summary: Execute or schedule a financial transaction based on a natural language instruction
 *     tags:
 *       - Instructions
 *     description: |
 *       Parses a natural language instruction to perform a debit or credit transaction between accounts.
 *       Supports immediate and future-dated transactions. Future-dated transactions are marked as pending.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - instruction
 *               - accounts
 *             properties:
 *               accounts:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Account'
 *                 example:
 *                   - id: "9137390244"
 *                     balance: 200
 *                     currency: "USD"
 *                   - id: "8142155367"
 *                     balance: 300
 *                     currency: "USD"
 *               instruction:
 *                   type: string
 *                   example: "CREDIT 50 USD FROM ACCOUNT 9137390244 FOR DEBIT TO ACCOUNT 8142155367 ON 2025-11-17"
 *     responses:
 *       200:
 *         description: Transaction processed successfully or scheduled for future execution
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionResponse'
 *       400:
 *         description: Invalid instruction or failed transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionResponse'
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransactionResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       required:
 *         - id
 *         - balance
 *         - currency
 *       properties:
 *         id:
 *           type: string
 *           example: "9137390244"
 *         balance:
 *           type: number
 *           example: 1000
 *         currency:
 *           type: string
 *           enum: [NGN, USD, GBP, GHS]
 *           example: "USD"
 *
 *     TransactionResponse:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [DEBIT, CREDIT, null]
 *           example: "CREDIT"
 *         amount:
 *           type: number
 *           example: 50
 *         currency:
 *           type: string
 *           example: "USD"
 *         debit_account:
 *           type: string
 *           example: "8142155367"
 *         credit_account:
 *           type: string
 *           example: "9137390244"
 *         execute_by:
 *           type: string
 *           format: date
 *           example: "2025-11-17"
 *         status:
 *           type: string
 *           enum: [successful, pending, failed]
 *         status_reason:
 *           type: string
 *         status_code:
 *           type: string
 *         accounts:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               currency:
 *                 type: string
 *               balance:
 *                 type: number
 *               balance_before:
 *                 type: number
 */

router.post('/payment-instructions', handleInstruction);

export default router;