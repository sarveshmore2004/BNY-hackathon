import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  createStatement,
  getStatements,
  getStatementById,
} from '../controllers/statement.controller.js';

const router = express.Router();

// POST route to create a new statement
router.post('/', verifyToken, createStatement);

// GET route to fetch all statements with transactions populated
router.get('/', verifyToken, getStatements);

// GET route to fetch a particular statement by its id
router.get('/:id', verifyToken, getStatementById);

export default router;
