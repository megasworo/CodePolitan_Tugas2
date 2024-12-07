const express = require('express')
const router = express.Router()
const db = require('../models')
var bycript = require('bcryptjs')
const jwt = require('jsonwebtoken')

// signup new user
router.post('/signup', async (req, res) => {
    const email = await db.User.findOne({ where: {email: req.body.email} })
    if (email !== null) {
        return res.status(422).send("Email already exist")
    }
    else {
        bycript.genSalt(10, (err, salt) => {
            if (err) {
                return res.status(500).json({
                    error: err
                })
            }
            bycript.hash(req.body.password, salt, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    })
                } else {
                    db.User.create({
                        email: req.body.email,
                        password: hash,
                        name: req.body.name,
                        status: "active"
                    })
                    .then(() => {   
                        res.status(200).send('New user has been added')
                    })
                    .catch(err => res.send(err))
                }
            })
        })
    }
})

// login user
router.post('/login', (req, res) => {
    db.User.findAll({ where: { email: req.body.email } })
    .then(user => {
        if(user.length < 1) {
            return res.status(401).send("Auth failed")
        }
        bycript.compare(req.body.password, user[0].password, (err, result) => {
            if(err) { return res.status(401).send("Auth failed")}
            if(result) {
                const token = jwt.sign({
                    id: user[0].id,
                    email: user[0].email,
                    name: user[0].name
                },
                "secret",
                {
                    expiresIn: "1d"
                }
                )
                return res.status(200).send({
                    message: "Auth successfull",
                    token: token
                })
            }
            res.status(401).send("Auth failed")
        })
        
    })
    .catch(err => res.status(500).send(err))
})

// get all users
router.get('/', (req, res) => {
    db.User.findAll()
    .then(users => res.status(200).send(users))
    .catch(err => res.send(err))
})

// get all active users
router.get('/active', (req, res) => {
    db.User.findAll({ where: { status: 'Active '} })
    .then(users => res.status(200).send(users))
    .catch(err => res.send(err))
})

// get single user
router.get('/:id', async (req, res) => {
    const data = await db.User.findOne({ where: {id: req.params.id} })
    if(data === null) return res.status(404).send('Data not found')
    
    db.User.findOne({where: { id: req.params.id }})
    .then(user => res.status(200).send(user))
    .catch((err) => res.send(err))
})


// // edit author
// router.put('/edit/:id', async (req, res) => {
//     const data = await db.Author.findOne({ where: {id: req.params.id} })
//     if(data === null) return res.status(404).send('Data not found')

//     db.Author.update(
//         {
//             authorName: req.body.authorName
//         },
//         {
//             where: { id: req.params.id }
//         }
//     )
//     .then(() => res.status(200).send("Data has been updated"))
//     .catch(err => res.send(err))
// })

// // delete author
// router.put('/delete/:id', async (req, res) => {
//     const data = await db.Author.findOne({ where: {id: req.params.id} })
//     if(data === null) return res.status(404).send('Data not found')

//     db.Author.update(
//         {
//             authorStatus: 'deleted'
//         },
//         {
//             where: { id: req.params.id }
//         }
//     )
//     .then(() => res.status(200).send("Data has been deleted"))
//     .catch(err => res.send(err))
// })

module.exports = router