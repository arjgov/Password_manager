
import './App.css';
import { useState,useEffect } from "react";
import Axios from "axios";

function App() {

  const [password,setPassword] = useState('');
  const [title,setTitle] = useState(''); 
  const [passwordList,setPasswordList] = useState([]);

  useEffect(() => {
     Axios.get("http://localhost:3001/showpasswords").then((response)=>{
       setPasswordList(response.data);
     })
  }, [])

  const addPassword = () => {
    Axios.post("http://localhost:3001/addpassword", {
      password: password,
      title: title,
    });
  };

  const decryptPassword = (encryption) => {
     Axios.post("http://localhost:3001/decryptpassword",{
       password: encryption.password,
       iv: encryption.iv,
       id: encryption.id,
     }).then((response)=>{
       setPasswordList(passwordList.map((val)=>{
         return val.id == encryption.id ? {id: val.id, password:val.password, title: response.data, iv:val.iv} : val
       }))
     });
  };

  return (
    <div className="App">
      <div className="AddingPassword"> 
        <input type="text"
         placeholder="passoword@123"
         onChange={(event)=>{
           setPassword(event.target.value)
         }} />
        <input type="text"
         placeholder="Linkedin"
         onChange={(event)=>{
          setTitle(event.target.value)
        }} />
        <button onClick={addPassword}> Add password </button>
      </div>
      <div className="passwordlist">
       {passwordList.map((val,key) => {
         return <div className="passwords" onClick={()=>{decryptPassword({password:val.password, iv:val.iv ,id:val.id})}}key={key}>
           <h3>{val.title}</h3>
           </div>
       })}
      </div>
    </div>
  );
}

export default App;