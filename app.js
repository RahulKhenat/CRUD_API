const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql2')

const app = express()
const port = 5000;
app.use(express.json());

// MySQL Code goes here
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'rahuldb'
});


app.get('/api', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * from users', async (err, rows) => {
            connection.release()

            try {
               
                res.json(rows)
            }
            catch (err) {
                res.json({ message: err })
            }

        })

    })
})




app.get('/api/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('SELECT * from users WHERE id = ?', [req.params.id], async (err, rows) => {
            connection.release()

            try {

                res.json(rows)
            }
            catch (err) {
                res.json({ message: err })
            }

        })

    })
})



app.delete('/api/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        connection.query('delete * from users WHERE id = ?', [req.params.id], async (err, rows) => {
            connection.release()

            try {

                res.send(`User with the record ID ${[req.params.id]} has been removed.`)
            }
            catch (err) {
                res.json({ message: err })
            }

            console.log('The data from users table are: \n', rows)

        })

    })
})


// Add users
app.post('/api', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body
        connection.query('INSERT INTO users SET ?', params, async (err, rows) => {
            connection.release()
            try {

                res.send(`User with the name: ${name} has been updated.`)
            }
            catch (err) {
                res.json({ message: err })
            }


        })
    })
});

// Update a  users
app.put('/api', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { id, name, tagline, description, image } = req.body

        connection.query('UPDATE users SET name = ?, tagline = ?, description = ?, image = ? WHERE id = ?', [name, tagline, description, image, id], async (err, rows) => {
            connection.release()

            try {

                res.send(`User with the name: ${name} has been updated.`)
            }
            catch (err) {
                res.json({ message: err })
            }

        })

    })
})

// Listen on enviroment port or 5000
app.listen(port, () => console.log(`Listening on port ${port}`))