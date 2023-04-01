import { useState, useRef} from "react";
import {useNavigate} from 'react-router-dom';
import settings from '../config/settings.json'

function Register() {
  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage,setErrMessage] = useState("");
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const pwdRef = useRef(null);
  const navigate = useNavigate();
  
 

  function onSubmit(event) {
      event.preventDefault();
      setErrMessage("");
      const reqBody = {
          name,
          emailAddress,
          password
      };


      fetch(`${settings.serverUrl}/api/authlocal/register`, {
            method: "POST", 
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(reqBody),
      })
      .then((res) => res.json())
      .then((data) => {
          if (data.success === false) {
            setErrMessage(data.message)
          }
          else {
            setErrMessage(data.message)
            setName("");
            setEmailAddress("");
            setPassword("");
            setTimeout(() => {
                  navigate('/login');
              }, 1500);
          }
      })
      .catch((err) => {
          console.error(err);
          setErrMessage(err);
      })
    };

  return (
  
    
    <div className="card">
        <div className="register-container">
            
            <div className="user-form">
                <div className="message form-header">
                   {errMessage}
                </div>
                <form>
                    <div className="form-item">
                        <input type="text" className="form-control" ref={nameRef} id="username" placeholder='Display name' onChange={(e)=>setName(e.target.value)} />
                    </div>
                    <div className="form-item">
                        <input type="email" className="form-control" ref={emailRef} id="emailaddress" placeholder='Email address'onChange={(e)=>setEmailAddress(e.target.value)}/>
                    </div>
                    <div className="form-item">
                        <input type="password" className="form-control" ref={pwdRef} id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className="form-button">
                        <button onClick={e => onSubmit(e)} className="btn">Register</button>
                    </div>
                </form>
            </div>
        </div>
    </div>


  );
}

export default Register;