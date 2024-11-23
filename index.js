const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;
const cors = require('cors')

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Configure CORS to all routes
app.use(cors());

// Function to read transactions from the JSON file
const getTransactions = () => {
  const data = fs.readFileSync('transactions.json');
  return JSON.parse(data);
};

// Function to write transactions to the JSON file
const saveTransactions = (transactions) => {
  fs.writeFileSync('transactions.json', JSON.stringify(transactions, null, 2));
};

// Get all transactions
app.get('/transactions', (req, res) => {
  const transactions = getTransactions();
  res.json(transactions);
});

// Get a single transaction by ID
app.get('/transactions/:id', (req, res) => {
  const transactions = getTransactions();
  const transaction = transactions.find(t => t.id === parseInt(req.params.id));
  if (transaction) {
    res.json(transaction);
  } else {
    res.status(404).send('Transaction not found');
  }
});

// Create a new transaction
app.post('/transactions', (req, res) => {
  const transactions = getTransactions();
  const newTransaction = { id: Date.now(), ...req.body };
  transactions.push(newTransaction);
  saveTransactions(transactions);
  res.status(201).json(newTransaction);
});

// Update an existing transaction
app.put('/transactions/:id', (req, res) => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === parseInt(req.params.id));
  if (index !== -1) {
    transactions[index] = { id: transactions[index].id, ...req.body };
    saveTransactions(transactions);
    res.json(transactions[index]);
  } else {
    res.status(404).send('Transaction not found');
  }
});

// Delete a transaction
app.delete('/transactions/:id', (req, res) => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === parseInt(req.params.id));
  if (index !== -1) {
    const [deletedTransaction] = transactions.splice(index, 1);
    saveTransactions(transactions);
    res.json(deletedTransaction);
  } else {
    res.status(404).send('Transaction not found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
