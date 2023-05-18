const express = require('express');
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

const path = require('path');

const readDatabase = () => JSON.parse(fs.readFileSync('./db/db.json'))

const app = express();

const PORT = 3001;

app.use(express.static('public'));

app.use(express.json());


app.get('/notes', (req, res) => 
res.sendFile(path.join(__dirname, 'public/notes.html')));

app.get('/api/notes', (req, res) => {
   const dbData = readDatabase()
   res.json(dbData)
});

// Usage: DELETE /api/notes/444-frd-556-sdff-445
app.delete('/api/notes/:uuid', (req, res) => {
   const allNotes = readDatabase()
   const allOtherNotes = JSON.stringify(allNotes.filter(item=>item.uuid !== req.params.uuid), null, 4)

   fs.writeFile(`./db/db.json`, allOtherNotes, (err) =>
   err
     ? console.error(err)
     : console.log(
         `Wrote db.json file successfully. (deleted note)`
       )
 );
   res.status(204) // http 204 = deleted
})

app.post('/api/notes', (req, res) => {
   /**
    * Request Body:
    * [{title: 'test title', text: 'text 1'}, {title: 'test title2', text: 'text 2'}]
    */

   const notesWithUuids = req.body?.map(current => {
      /**
       * Input: {title: 'test title', text: 'text 1'}
       * Output: {title: 'test title', text: 'text 1', uuid: '333-444-rr-44-4-4'}
       */
      current.uuid = uuidv4()
      return current
   })


   newData = JSON.stringify([...readDatabase(), ...notesWithUuids], null, 4)

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

