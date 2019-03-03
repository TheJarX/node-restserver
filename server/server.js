require('./config/config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.json('Hallo, Welt!');
});
app.get('/usuario',(req,res)=>{
    res.json('get usuario');
});

app.post('/usuario',(req,res)=>{
    let body = req.body;
    let name = body.name;
    let age = body.age;

    res.json({
        person: body,
        name,
        age
    });
});
app.put('/usuario/:id',(req,res)=>{

    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario',(req,res)=>{
    res.json('delete usuario');
});

app.listen(process.env.PORT,()=>{
    console.log(`Listening in port: ${process.env.PORT}`);
});
