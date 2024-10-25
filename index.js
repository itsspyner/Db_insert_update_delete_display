const express = require('express');
var mysql = require('mysql2');
const bodyParser = require('body-parser');
const { Writable } = require('stream');
const { resume } = require('./resumeGenerator.js');

const app = express();
app.use(bodyParser.json());
 
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "json"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected successfully.");
});
// To insert data in the database
app.post('/insertData', (req, res) => {

  const jsonData = req.body;

  const email = "specturet@gmail.com";

  con.query('select email from resume', (err, result) => {
    if (err) throw err;
    const emailExists = result.some((element) => element.email === email);

    if (emailExists) {
      
      return res.status(400).send("Email already in use.");
    }
    con.query('insert into resume (email,data) values (?,?)', [email, JSON.stringify(jsonData)], (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        return;
      }

      res.send('Data inserted successfully');
    });
  });
});
//function to fetch json data from database of that specific email provided.
const fetchData = (email, callback) => {
  con.query('SELECT data FROM resume WHERE email = ?', [email], (err, result) => {
      if (err) return callback(err, null);
      if (result.length > 0) {
          let data = result[0].data;
          return callback(null, data);
      } else {
          return callback(new Error("No data found for this email"), null);
      }
  });
};
//function to update the json data of that specific email that is fetched.
const updateData = (email, updatedData, callback) => {
  const jsonData = JSON.stringify(updatedData);
  con.query('UPDATE resume SET data = ? WHERE email = ?', [jsonData, email], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
  });
};
//To add skills in json data of that specific email provided.
app.post('/addSkills/:email', (req, res) => {
  const email = req.params.email;
  const newSkills = req.body;

  fetchData(email, (err, data) => {
      if (err) return res.status(404).send(err.message);

      data.skills = [...data.skills, ...newSkills];

      updateData(email, data, (err, result) => {
          if (err) return res.status(500).send("Error updating skills.");
          res.send("Skills updated successfully.");
          console.log("Skills updated successfully.");
      });
  });
});
//To add education in json data of that specific email provided.
app.post('/addEducation/:email', (req, res) => {
  const email = req.params.email;
  const newEducation = req.body;

  fetchData(email, (err, data) => {
      if (err) return res.status(404).send(err.message);

      data.education.push(newEducation);

      updateData(email, data, (err, result) => {
          if (err) return res.status(500).send("Error updating education.");
          res.send("Education updated successfully.");
      });
  });
});
//To add experience in json data of that specific email provided.
app.post('/addExperience/:email', (req, res) => {
  const email = req.params.email;
  const newExperience = req.body;

  fetchData(email, (err, data) => {
      if (err) return res.status(404).send(err.message);

      data.experiences.push(newExperience);

      updateData(email, data, (err, result) => {
          if (err) return res.status(500).send("Error updating experiences.");
          res.send("Experiences updated successfully.");
          console.log("Experiences updated successfully.");
      });
  });
});
//To delete the json data of that specific email provided.
app.post('/deleteData/:email', (req,res)=>{
  const email = req.params.email;
  
  con.query('DELETE FROM resume WHERE email = ?',[email],(err,result)=>{
      if(err) throw err;
      res.send("Data deleted duccessfully");
      console.log("Data deleted duccessfully");
  });
});
//To display the resume for the provided email.
app.post('/display/:email', (req, res) => {

  const email = req.params.email;

  con.query('SELECT *FROM resume where email = ?', [email], (err, result) => {
      if (err) throw err;
          try {
              const doc = resume(result[0].data);

              let pdfChunk = [];
              const bufferStream = new Writable({
                  write(chunk, encodine, next) {
                      pdfChunk.push(chunk);
                      next();
                  }
              });

              doc.pipe(bufferStream);

              bufferStream.on('finish', () => {
                  const pdfBuffer = Buffer.concat(pdfChunk);
                  res.setHeader('Content-Type', 'application/pdf');
                  res.send(pdfBuffer);
                  console.log("Resume created successfully.");
              });

          }catch (jsonErr) {
              console.error('Error parsing JSON data:', jsonErr);
          }
      });
});


app.listen(3000, () => {
  console.log("Listening in port 3000");
});

