# Resume Manager API
**This project provides a simple Express.js API to manage resumes stored in a MySQL database. 
The API allows you to insert, update, delete, and display resume data in JSON format for a specified email address. 
The resume can then be displayed as a PDF.**

## Features
- Easy to use and supports file format PDF.
- Insert, update and delete json data.
- Uses postman for api requests.
- Uses mysql database to store json data.

## Technologies Used
- Node.js
- Express.js
- MYSQL2
- body-parser
- Streams
- pdfkit

## Overview
- the index.js file is the main file that contains all the code for inserting, updating, deleting the json data and displaying the resume
- It uses mysql database for storing the json data for the resume(all the data is stored in the databse named json inside a table resume)
- It uses postman for api requests and sending json datas.

## Overview of files
- index.js => It is the main file that send api request and gets response.
- resumeCreator.js => It contains the function that creates resume.

## prerequisites before cloning the repo
- Before running the program you must have created a database using mysql.
- run the following code once entered mysql cmd using **_ mysql -u root -p _** then enter your password for entering root.
- once entered mysql cmd run **_ create database json; _** then run **_ use json _**
- once it shows database changed run following lines of code
- **_create table resume(data json, email varchar(50));_**
- Now you are set to run the main program.

## Installation
- git clone https://github.com/itsspyner/Db_insert_update_delete_display.git
- cd Db_insert_update_delete_display
- npm install

## Implementation
- node index.js its should say "Listening on port 3000" and "connected successfully".
- Then head to postman->file hit new and click in http.
- Then change the get request to post request and write any of the given url.
- Then in the body section choose raw and put the JSON resume data.
- Then click on send the resume will be generated in postman.
