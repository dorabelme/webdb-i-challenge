const express = require("express");
const db = require("../data/dbConfig.js");

const router = express.Router();

// GET requests for projects
router.get('/', (req, res) => {
    db("accounts")
        .then(accounts => res.status(200).json(accounts))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The accounts information could not be retrieved." });
        });
});

router.get('/:id', (req, res) => {
    db("accounts")
        .where({ id: req.params.id })
        .first()
        .then(account => {
            console.log(account);
            if (account) {
                res.status(200).json(account);
            } else {
                res.status(404).json({ error: "Account with ID does not exist."});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Error getting the account from the database"});
        });
});


// POST request for projects
router.post('/', (req, res) => {
    console.log(req.body);
    // const { name, budget } = req.body;
    if (!req.body.name || !req.body.budget) {
        return res.status(400).json({ error: "Requires name and budget."});
    }
    db("accounts")
        .insert({ name: req.body.name, budget: req.body.budget })
        .then(([id]) => {
            db("accounts")
                .where({ id })
                .first()
                .then(account => {
                    console.log(account);
                    if (account) {
                        res.status(201).json(account);
                    } else {
                        res.status(404).json({error: "Account with ID does not exist."})
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: "Server error retrieving account."});
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Server error inserting account."});
        });
});


// DELETE request for projects
router.delete('/:id', (req, res) => {
    db("accounts")
        .where({ id: req.params.id })
        .del()
        .then(account => {
            console.log(account);
            if (account) {
                res.status(204).end();
            } else {
                res.status(404).json({ error: "Account with ID does not exist." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Server error deleting account." });
        });
});


// PUT request for projects
router.put('/:id', (req, res) => {
    if (!req.body.name || !req.body.budget) {
        return res.status(400).json({ error: "Requires name and budget." });
    }
    
    db("accounts")
        .where({ id: req.params.id })
        .update({ name: req.body.name, budget: req.body.budget })
        .then(updated => {
            console.log(updated);
            if (updated) {
                db("accounts")
                    .where({ id: req.params.id })
                    .first()
                    .then(account => res.status(200).json(account))
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: "Error retrieving account."});
                    });
            } else {
                res.status(404).json({ error: "Account with ID is not found." });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Server error updating account." });
        });
});


module.exports = router;

