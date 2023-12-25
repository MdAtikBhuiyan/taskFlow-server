const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5001;

//middleware

app.use(cors());
app.use(express.json());

//url
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bbvd3eh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const taskCollections = client.db("taskFlow").collection("allTask")

    app.post('/task', async (req, res) => {
      const todo = req.body;
      console.log(todo);
      const result = await taskCollections.insertMany(todo)
      res.send(result)
    })
    app.get('/task', async (req, res) => {
      const email = req.query.email
      // console.log(query, email, 'this is a query');
      const filter = { user: email }
      const result = await taskCollections.find().toArray()
      res.send(result)
    })

    app.delete('/task/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) };
      const result = await taskCollections.deleteOne(filter)
      res.send(result)
    })
    app.patch('/task/:id', async (req, res) => {
      const id = req.params.id;
      const status = req.query.status;
      const filter = { id: id };
      console.log(status, id, filter);
      const updateDoc = {
        $set: {
          status: status
        }
      }
      const result = await taskCollections.updateOne(filter, updateDoc)
      res.send(result)
    })




    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("TaskForge server is running");
});

app.listen(port, () => {
  console.log(`TaskFlow server is running on port:${port}`);
});
