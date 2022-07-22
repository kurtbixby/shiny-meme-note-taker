const express = require('express');
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

const DB_LOCATION = './db/db.json';

const router = express.Router();

router.get('/notes', (req, res) => {
    readFromFile(DB_LOCATION).then((data) => res.json(JSON.parse(data)));
});

router.post('/notes', (req, res) => {
    const { title, text } = req.body;

    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuid(),
        };

        readAndAppend(newNote, DB_LOCATION);
        res.json('Tip added successfully');
    } else {
        res.errored('Error adding tip');
    }
});

router.delete('/notes/:noteId', (req, res) => {
    const { noteId } = req.params;

    readFromFile(DB_LOCATION).then((rawData) => {
        let data = JSON.parse(rawData);
        let index = 0;
        for (; index < data.length; index++) {
            const element = data[index];
            console.log(element);
            if (element.id == noteId) {
                break;
            }
        }
        data.splice(index, 1)
        writeToFile(DB_LOCATION, data);
        res.json(`Note ${noteId} deleted`);
    })
});

module.exports = router;