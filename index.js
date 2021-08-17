const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

const userRoutes = require('./routes/user');
app.use(express.json());

app.get("/", (req, res)=>{
    res.send("Enter details");
});
app.use('/user', userRoutes);


app.listen(port, (req, res)=>{
    console.log("running....");
});

mongoose.connect("mongodb+srv://abdullah:abdullah@cluster0.i5f2d.mongodb.net/cluster0?retryWrites=true&w=majority", 
{   useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false},
     () => console.log("connected to DB")
);
