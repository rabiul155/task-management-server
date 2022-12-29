const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


//midleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.i4cqwjk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {

        const taskCollection = client.db('task-management').collection('all-task')
        const commentCollection = client.db('task-management').collection('all-comment')

        app.get('/myTask', async (req, res) => {
            const email = req.query.email;

            const query = { email: email }
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/myComment', async (req, res) => {
            const id = req.query.id;
            console.log(id)

            const query = { taskId: id }
            const result = await commentCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/addComment', async (req, res) => {
            const comment = req.body;
            console.log(comment);
            const result = await commentCollection.insertOne(comment);
            res.send(result)
        })


        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const result = await taskCollection.findOne(query);
            res.send(result);

        })

        app.put('/updateDetails/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const details = req.body.details;
            console.log(details)
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    details: details
                }
            }
            const result = await taskCollection.updateOne(query, updatedDoc, options)
            res.send(result)
        })


        app.put('/addComment/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) }
            const comment = req.body.comment;
            console.log(comment)

            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    comment: comment
                }
            }
            const result = await taskCollection.updateOne(query, updatedDoc, options)
            res.send(result)
        })

        app.get('/completedTask', async (req, res) => {
            const email = req.query.email;

            const query = { email: email }
            const result = await taskCollection.find(query).toArray();
            const completed = result.filter(res => res.status == 'complete')

            res.send(completed);
        })

        app.delete('/deleteTask/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) }
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })

        app.put('/updateStatus/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const message = req.body.message;
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: message
                }
            }

            const result = await taskCollection.updateOne(query, updatedDoc, options)
            res.send(result)
        })



        app.post('/addTask', async (req, res) => {
            const task = req.body;
            console.log(task);
            const result = await taskCollection.insertOne(task);
            res.send(result)
        })


    }


    finally {

    }
}
run().catch(error => console.log(error));




app.get('/', (req, res) => {
    res.send('hey buddy I am your server')
})

app.listen(port, () => {
    console.log('server running on port ', port)
})