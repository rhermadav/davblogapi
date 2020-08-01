const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
//const bodyParser = require('body-parser');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
//app.use(bodyParser.json());

// const uri = process.env.ATLAS_URI;
// mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }
// );
// const connection = mongoose.connection;
// connection.once('open', () => {
//   console.log("MongoDB database connection established successfully");
// })
 
mongoose.connect('mongodb://localhost/myblog', {useNewUrlParser: true ,useUnifiedTopology: true, useCreateIndex: true})
    .then(()=> console.log(`connected to mongodb...}`))
    .catch((err) => console.error('could not connect to mongodb '));

//const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');
const postRouter = require('./routes/posts');
const uploadRoute = require('./routes/upload');

app.use('/users', usersRouter);
app.use('/posts', postRouter);
//app.use(fileUpload());
app.use('/uploads', uploadRoute);
app.use('/uploads', express.static('uploads'));

// app.post('/upload',(req,res)=>{
//     if (req.files=== null){
//         return res.status(400).json({msg:'no file is there'});
//     }

//     const file = rew.files.file;
//     file.mv(`${__dirname}/clients/public/uploads/${__filename}`,err=>{
//         if(err){
//             console.log(err);
//             return res.status(500).send(err);
//         }
//         res.json({filename:file.name, filepath:`/uploads/${filename}`})
//     }

//     )
// })

const server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

module.exports = server;