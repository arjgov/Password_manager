const express = require('express');
const app = express();
const PORT = 3001;
const mysql = require('mysql');
const cors = require('cors');
const {encrypt,decrypt} = require('./Encryption.js');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "password",
    database: "passwordmanager"
})

app.post("/addpassword",(req,res)=>{
  const {password,title} = req.body
  
  const encryptedPassword = encrypt(password);


  db.query("INSERT INTO PASSWORDS (password,title,iv) VALUES (?,?,?)",[encryptedPassword.password,title,encryptedPassword.iv],
  (err,result) => {
    if(err){ 
     console.log(err);}
    else{
     res.send("Success");} 
  });
});

app.get("/showpasswords",(req, res) => {
  db.query("SELECT * FROM PASSWORDS;",(err, result) =>{
    if(err){
      console.log(err);
    }
    else{
     res.send(result);
    }
  });
});

app.post("/decryptpassword",(req,res)=>{
  res.send(decrypt(req.body));
})

app.listen(PORT,()=> {
   console.log('Server is Running');
});