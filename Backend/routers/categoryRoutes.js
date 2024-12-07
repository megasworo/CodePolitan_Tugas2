const express = require('express')
const router = express.Router()
const db = require('../models')

// create new category
router.post('/create', (req, res) => {
    db.Category.create({
        catName: req.body.catName
    })
    .then((category) => res.status(200).json({ 
        message: 'New category created',
        data: category
    }))
    .catch(err => res.send(err))
})

// get all categories
router.get('/', (req, res) => {
    db.Category.findAll()
    .then(categories => res.status(200).send(categories))
    .catch(err => res.send(err))
})

// get single category
router.get('/:id', async (req, res) => {
    const data = await db.Category.findOne({ where: { id: req.params.id }})
    if(data === null) return res.status(404).send("Data not found")

    db.Category.findOne({
        where: { id: req.params.id }
    })
    .then(category => res.status(200).send(category))
    .catch(err => res.send(err))
})

// edit category
router.put('/edit/:id', async (req, res) => {
    const data = await db.Category.findOne({ where: { id: req.params.id }})
    if(data === null) return res.status(404).send("Data not found")

    db.Category.update(
        {
            catName: req.body.catName
        },
        {
            where: { id: req.params.id }
        }
    )
    .then(() => res.status(200).send("Data is updated"))
    .catch(err => res.send(err))
})

// delete category
router.delete('/delete/:id', async (req, res) => {
    const data = await db.Category.findOne({ where: { id: req.params.id }})
    if(data === null) return res.status(404).send("Data not found")

    db.Category.destroy(
        {
            where: { id: req.params.id }
        }
    )
    .then(() => res.status(200).send("Data is deleted"))
    .catch(err => res.send(err))
})



module.exports = router