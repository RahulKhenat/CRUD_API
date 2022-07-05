const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require('cors');
//const { urlencoded } = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
const port = 5000;
app.use(express.json());

// MySQL Code goes here
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "cool",
});

const connection = (pool.promise = (sql) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, (err, result) => {
      if (err) {
        reject(new Error());
      } else {
        resolve(result);
      }
    });
  });
});

app.get("/api", (req, res) => {
  pool
    .promise("SELECT * FROM cool ")
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/api/:id", (req, res) => {
  pool
    .promise("select * from cool where id =" + [req.params.id])
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.delete("/api/:id", (req, res) => {
  pool
    .promise("delete from cool where id = " + req.params.id)
    .then((result) => {
      res.json(`User with id ${req.params.id} is deleted successfully`);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.post("/api", (req, res) => {
  var name = req.body.name;
  var salary = req.body.salary;

  console.log(name,salary)

  pool
    .promise(
      `INSERT INTO cool (name,salary) values ("${name}","${salary}") `
    )
    .then((result) => {
      res.json(`User with the name has been updated.`);
    })
    .catch((err) => {
      res.json(err);
    });
});



app.put("/api/:id", (req, res) => {
  console.log(req.params.id);
   let data = `UPDATE cool SET  name ="${req.body.name}" , salary = ${req.body.salary}  WHERE id = ${req.params.id}`
   console.log(data);
   pool.promise(data)
     .then((result) => {
       res.status(200).json(`User with the name: ${req.body.name} has been updated.`);
     })
     .catch((err) => {
       res.status(400).json(err);
     });
 });




// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`));
