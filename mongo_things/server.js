require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors'); // Required for frontend connection

const app = express();
app.use(express.json());
app.use(cors()); 

const client = new MongoClient(process.env.MONGO_URI);
let collection;

async function connectDB() {
  try {
    await client.connect();
    // Create a database named "tutorialApp" and a collection named "users"
    const db = client.db("tutorialApp");
    collection = db.collection("users");
    console.log("Connected to MongoDB Atlas");
    
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000');
    });
  } catch (err) {
    console.error("Database connection failed:", err);
  }
}

connectDB();

// --- CRUD API ENDPOINTS ---

// 1. CREATE (Insert a new user)
app.post('/api/users', async (req, res) => {
  const result = await collection.insertOne(req.body);
  res.json(result);
});

// 2. READ (Retrieve all users)
app.get('/api/users', async (req, res) => {
  const users = await collection.find({}).toArray();
  res.json(users);
});

// 3. UPDATE (Modify a user)
app.put('/api/users/:id', async (req, res) => {
  const result = await collection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.json(result);
});

// 4. DELETE (Remove a user)
app.delete('/api/users/:id', async (req, res) => {
  const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
  res.json(result);
});