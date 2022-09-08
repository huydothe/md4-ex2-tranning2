const express = require('express');
const app = express();
const mysql = require('mysql');
const multer = require('multer');
const bodyParser = require('body-parser');
const port = 3000;
const upload = multer();
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './views');


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: 'Huydothe1999@',
    database: 'dbTest'
});
connection.connect((err) => {
    if (err) {
        throw new Error(err.message);
    } else {
        console.log(`Connect success`);
        const sqlCreate = `CREATE TABLE IF NOT EXISTS book (

 id INT AUTO_INCREMENT PRIMARY KEY,

 name VARCHAR(255),

 price INT,quantity INT,

 author VARCHAR(255)
  )`;
        connection.query(sqlCreate, function (err, result) {

            if (err) throw err;

            console.log("Create table success.ejs");

        });
    }
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/book/create', upload.none(), (req, res) => {
    const {name, price, quantity, author} = req.body;
    const sqlInsert = `INSERT INTO book (name, price, quantity, author) VALUES ?`
    const value = [
        [name, price, quantity, author]
    ];
    connection.query(sqlInsert, [value], function (err, result) {
        if (err) {
            throw new Error(err.message);
        } else {
            res.render('success')
        }
    })
})

app.get('/book/list',(req,res)=>{
    const sql = `select * from books`;
    connection.query(sql,(err,results)=>{
        if(err){
            throw new Error(err.message);
        }
        res.render('list',{books:results})
    })
})

app.get('/book/detail',(req,res)=>{
    console.log(req.query)
    const sql = `select * from books where id = ${req.query.id}`;
    connection.query(sql,(err,result)=>{
        if(err){
            throw new Error(err.message);
        }
        res.render('detail',{book:result[0]});
    })
})

app.get('/book/delete',(req, res) => {
    console.log(req.body);
    const sql = `delete from books where id=${req.body.id}`
    connection.query(sql,(err,result)=>{
        if(err){
            throw new Error(err.message);
        }
        res.json({status:200, message:"delete success"});
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/book/list`);
})