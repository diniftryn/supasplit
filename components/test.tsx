// Assuming you have Express and MongoDB driver installed
const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();
const port = 3000;

// MongoDB connection URI
const mongoURI = "your_mongo_connection_uri";

// Connect to MongoDB
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }

  console.log("Connected to MongoDB");

  const db = client.db("your_database_name");

  // Endpoint to get owed amounts
  app.get("/owed-amounts", async (req, res) => {
    try {
      // Fetch expenses and participants data from the database
      const expenses = await db.collection("expenses").find().toArray();
      const participants = await db.collection("participants").find().toArray();
      const payments = await db.collection("payments").find().toArray();

      // Calculate owed amounts
      const owedAmounts = calculateOwedAmounts(expenses, participants, payments);

      // Send the result as JSON
      res.json(owedAmounts);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});

// Function to calculate owed amounts
function calculateOwedAmounts(expenses, participants, payments) {
  const userBalances = {};

  // Initialize user balances
  participants.forEach(participant => {
    userBalances[participant.user_id] = 0;
  });

  // Calculate balances based on expenses
  expenses.forEach(expense => {
    const totalParticipants = participants.filter(p => p.expense_id === expense.expense_id).length;
    const amountPerParticipant = expense.amount / totalParticipants;

    participants
      .filter(p => p.expense_id === expense.expense_id)
      .forEach(participant => {
        userBalances[participant.user_id] += amountPerParticipant;
      });
  });

  // Adjust balances based on payments
  payments.forEach(payment => {
    userBalances[payment.payer_id] -= payment.amount;
    userBalances[payment.payee_id] += payment.amount;
  });

  return userBalances;
}
