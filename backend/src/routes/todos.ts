import { Router, Request, Response } from "express";
import { MongoClient } from 'mongodb'
import express from "express";
import { v4 as uuidv4 } from 'uuid';
import bodyParser from "body-parser";
require('dotenv').config()


const app = express();
app.use(bodyParser.json());
const router = express.Router();


const url: any = process.env.MONGODB_URI;
const client = new MongoClient(url);
client.connect();

const dbName = 'todoDB'


// Load All Todos From DB

router.get('/', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('tododoc');
  const findResult = await collection.find({}).toArray();
  res.json(findResult)
})


// Add Todos To DB

router.post('/', async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection('tododoc');
  try {
    const { todo } = req.body;
    if (!todo) return res.status(400).json({ error: "Missing todo text" });
    const newTodo = {
      id: uuidv4(),        // generate unique id
      todo,
      isCompleted: false   // default
    }
    await collection.insertOne(newTodo);
    res.json(newTodo);    // now returns full object
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add todo" });
  }
})


// Delete Todos From DB
router.delete('/', async (req, res) => {
  const db = client.db(dbName);
  const body = req.body
  const collection = db.collection('tododoc');
  const deleteTodo = await collection.deleteOne(body)
  res.json({ delete: true, result: deleteTodo })
})

// Patch Request 
router.patch('/', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('tododoc');

    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Missing todo id" });
    }

    // Toggle the isCompleted field
    const patchTodo: any = await collection.findOneAndUpdate(
      { id },                  // filter
      [{ $set: { isCompleted: { $not: "$isCompleted" } } }], // aggregation pipeline to flip
      { returnDocument: 'after' }
    );

    res.json({ success: true, result: patchTodo.value });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});




export default router;
