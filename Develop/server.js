const dbData = require('./db/db.json')
const express = require('express');
const fs = require('fs')

const path = require('path');

const app = express();

const PORT = 3001;

app.use(express.static('public'));

app.use(express.json());


app.get('/notes', (req, res) => 
res.sendFile(path.join(__dirname, 'public/notes.html')));

app.get('/api/notes', (req, res) => res.json(dbData));

app.post('/api/notes', (req, res) => {
   /**
    * Request Body:
    * [{title: 'test title', text: 'text 1'}, {title: 'test title2', text: 'text 2'}]
    */
   const newNotes = req.body

   //TODO: create uuid identifiers
   newData = JSON.stringify([...dbData, ...newNotes], null, 4)

   fs.writeFile(`./db/db.json`, newData, (err) =>
      err
        ? console.error(err)
        : console.log(
            `Wrote db.json file successfully.`
          )
    );

   res.sendStatus(201)
})

app.get('*', (req, res) => 
   res.sendFile(path.join(__dirname, 'public/index.html')));

 app.listen(PORT, () =>
    console.log(`Listening at http://localhost:${PORT}`));

