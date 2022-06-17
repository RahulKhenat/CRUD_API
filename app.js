const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')

const app = express()
const port = 5000; 
app.use(express.json()); 

// MySQL Code goes here
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'root',
    database        : 'rahuldb'
});


// Get all users
app.get('/api', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log('connected as id ' + connection.threadId)
        connection.query('SELECT * from users', (err, rows) => {
            connection.release() 

            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }

            // if(err) throw err
            console.log('The data from users table are: \n', rows)
        })
    })
})

// Get an users
app.get('/api/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() 
            if (!err) {
                res.send(rows)
            } else {
                console.log(err)
            }
            
            console.log('The data from users table are: \n', rows)
        })
    })
});

// Delete a users
app.delete('/api/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        connection.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release() 
            if (!err) {
                res.send(`User with the record ID ${[req.params.id]} has been removed.`)
            } else {
                console.log(err)
            }
            
            console.log('The data from users table are: \n', rows)
        })
    })
});

// Add users
app.post('/api', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        
        const params = req.body
        connection.query('INSERT INTO users SET ?', params, (err, rows) => {
        connection.release() 
        if (!err) {
            res.send(`User with the record ID  has been added.`)
        } else {
            console.log(err)
        }
        
        console.log('The data from user table are:11 \n', rows)

        })
    })
});

// Update a  users
app.put('/api', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { id, name, tagline, description, image } = req.body

        connection.query('UPDATE users SET name = ?, tagline = ?, description = ?, image = ? WHERE id = ?',  [name, tagline, description, image, id] , (err, rows) => {
            connection.release() 

            if(!err) {
                res.send(`User with the name: ${name} has been updated.`)
            } else {
                console.log(err)
            }

        })

        console.log(req.body)
    })
})

// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))