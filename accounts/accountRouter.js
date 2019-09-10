const express = require("express");
// const db = require("../data/dbConfig.js");

const Account = require("../data/dbHelpers.js");


const router = express.Router();

// GET requests for projects
router.get('/', (req, res) => {
    Account.get()
    // db("accounts")
        .then(accounts => res.status(200).json(accounts))
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "The accounts information could not be retrieved." });
        });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    Account.getById(id)
    // db("accounts")
    //     .where({ id: req.params.id })
    //     .first()
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

    Account.insert({name: req.body.name, budget: req.body.budget})
    // db("accounts")
    //     .insert({ name: req.body.name, budget: req.body.budget })
        .then(({id}) => {
            Account.getById(id)
            // db("accounts")
            //     .where({ id })
            //     .first()
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
    const { id } = req.params;
    Account.remove(id)
    // db("accounts")
    //     .where({ id: req.params.id })
    //     .del()
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
    const { id } = req.params;
    if (!req.body.name || !req.body.budget) {
        return res.status(400).json({ error: "Requires name and budget." });
    }
    
    Account.update(id, {name: req.body.name, budget: req.body.budget})
    // db("accounts")
    //     .where({ id: req.params.id })
    //     .update({ name: req.body.name, budget: req.body.budget })
        .then(updated => {
            console.log(updated);
            if (updated) {
                Account.getById(id)
                // db("accounts")
                //     .where({ id: req.params.id })
                //     .first()
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

