import { useEffect, useState, useContext, useRef } from "react";
import {MdEdit, MdDelete} from 'react-icons/md';
import { AuthContext } from "../components/AuthContext";


function UserThemes() {
  const [name, setName] = useState("");
  const nameRef = useRef(null);
  const publicRef = useRef(null);
  const [userThemes, setUserThemes] = useState([]);
  const { authUser } = useContext(AuthContext);
  const [shouldUpdate, setShouldUpdate] = useState(false);
  const [themeID, setThemeID] = useState(null);
  const [adminComments, setAdminComments] = useState(null);
  
  
  const [approval, setApproval] = useState(false);
  const [phrases, setPhrases] = useState([]);
  const [makePublic, setMakePublic] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [method, setMethod] = useState('add');
  const [additionalPhraseNum, setAdditionalPhraseNum] = useState(0);
  const [additionalPhrases, setAdditionalPhrases] = useState([]);
  const [responseData, setResponseData] = useState([]);


  useEffect(() => {
    if(!authUser) return;
    fetch(`/api/themes/userThemes/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: authUser.id })
    })
      .then((res) => res.json())
      .then((data) => {
        setUserThemes(data)
      })
      .catch((err) => {
        console.error(err);
      });
  }, [authUser, shouldUpdate]);

  function addTheme() {
    setErrorMessage("");

    if (name==="") {
      setErrorMessage("Please name your theme");
      nameRef.current.focus();
      return;
    }
    if (phrases.length<5) {
      setErrorMessage("You must add at least 5 phrases.")
      return;
    }

    const reqBody = {
      UserId: authUser.id,
      Name: name,
      Type: makePublic ? 'publish' : 'private',
    }

    fetch(`/api/themes/addTheme`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody)
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 'success') {
        const phraseReqBody = {
          themeID: data.theme.insertId,
          phrases: phrases 
        }
    
        fetch(`/api/responses/addAllResponses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(phraseReqBody)
        })
        .then((res) => res.json())
        .then((data) => {
            clearFields();
            setPhrases(Array(20).fill(""));
        })
        .catch((err) => {
          console.error(err);
        })
      }
    })
    .catch((err) => {
      console.error(err);
    })
  }

  function updateTheme() {
  
    setErrorMessage("");
  
    if (name==="") {
      setErrorMessage("Please name your theme");
      nameRef.current.focus();
      return;
    }
  
    if (responseData.length < 5) {
      setErrorMessage("You must add at least 5 phrases.");
      return;
    }
  
    const reqBody = {
      Name: name,
      Type: makePublic ? 'publish' : 'private',
    }
    fetch(`/api/themes/updateTheme/${themeID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody)
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 'success') {
        const phrasesToUpdate = responseData.map(response => ({
          ResponseID: response.ResponseID,
          Phrase: response.Phrase.replace(/'/g, "''")
        }));
        fetch(`/api/responses/updateAllResponses`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ responses: phrasesToUpdate })
        })
        .then((res) => res.json())
        .then((data) => {
          console.log(JSON.stringify(data));
        })
        .catch((err) => {
          console.error(err);
        })
  
        if (additionalPhrases.length > 0) {
          const phraseReqBody = {
            themeID: themeID,
            phrases: additionalPhrases
          }
  
          fetch(`/api/responses/addAllResponses`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(phraseReqBody)
          })
          .then((res) => res.json())
          .then((data) => {
            console.log(JSON.stringify(data));
          })
          .catch((err) => {
            console.error(err);
          })
        }
      }
    })
    .catch((err) => {
      console.error(err);
    })
    setMethod('add');
    clearFields();
    setShouldUpdate(!shouldUpdate)
   
  }
  

  function onSubmit(e) {
    e.preventDefault();

    method==='edit' ? updateTheme() : addTheme()
  }

  function getEditTheme(id) {
    setMethod('edit');
    setThemeID(id);
    //get theme info
    fetch(`/api/themes/byid/${id}`)
    .then(res=>res.json())
    .then(data => {
      setName(data.Name);
      setAdminComments(data.AdminComments);
      setApproval(data.AdminApproval)
      //get responses for that theme
      fetch(`/api/responses/responsesForTheme`,{
        'method': 'POST',
        'headers': {
          'content-type': 'application/json'
        },
        body: JSON.stringify({themeId:id})
      })
      .then((res) => res.json())
      .then((data) => {
        setAdditionalPhraseNum(20-data.length);
        setResponseData(data)
      })
      .catch((err) => {
        console.error(err);
      });    
    })
  }

  function removeTheme(id, name) {
    const confirmed = window.confirm(`Are you sure you want to delete ${name} ?`);
    if (!confirmed) return;
    fetch(`/api/themes/deleteTheme/${id}`, {
      method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
    })
    .then(res=>res.json)
    .then((data)=> {
      setMethod('add');
      setShouldUpdate(!shouldUpdate);
    })
    .catch(err => {
      console.error(err);
    })

  }

  function updateToAdd() {
    setMethod('add');
    clearFields();
  }

  function clearFields() {
    setName("");
    nameRef.value = "";
    publicRef.current.checked = false;
    setAdminComments(null);
  }

  function handleChange(e, responseID) {
    const newValue = e.target.value;
    setResponseData(prevState => prevState.map(response => {
      if (response.ResponseID === responseID) {
        return { ...response, Phrase: newValue };
      }
      return response;
    }));
  }

  

  return (
    <div className="theme-grid">
      <div className="themes-grid-item">
        <div className="space-small"></div>
        <div className="current-themes">
            
            <div className="theme-grid-item-title">
              Current Themes
            </div>
            <div>
              {userThemes && userThemes.length > 0 ? (
                <table className="themes-table">
                  <tbody>
                    {userThemes.map((t) =>
                        <tr key={t.ThemeID} value={t.ThemeID}>
                          
                          <td>
                            <MdDelete id={t.ThemeID} onClick={() => removeTheme(t.ThemeID, t.Name)}/>
                          </td>
                          <td>
                            <MdEdit id={t.ThemeID} onClick={() => getEditTheme(t.ThemeID)}/>
                          </td>
                          <td>
                            {t.Name}
                          </td>
                          <td>
                            {t.Type}
                          </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <>
                  You have no currently added themes.
                </>
              )}
            </div>
            {method ==='edit' && (
              <div>
                <button className="default-button" onClick={()=>{updateToAdd()}}>Add a Theme</button>
              </div>
            )}
        </div>
        </div>
        <div className="themes-grid-item add-theme" >
                      <div className="message">
                        {errorMessage}
                      </div>
                      <div className="theme-grid-item-title2">
                        {method==='edit'? `Update ` : `Add a `}Theme
                      </div>
                      <div className="theme-form center">
                            <form onSubmit={onSubmit}>
                                <div>
                                  <label htmlFor="name">Theme Name:&nbsp;</label>
                                </div>
                                <div>
                                  <input id="name"
                                    ref={nameRef}
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                  />
                                </div>
                                <div>
                                Phrases
                                </div>
                                {method === 'edit' ?
                                  <div>
                                  <div>
                                    
                                      {responseData.map((response) => (
                                        <div key={response.ResponseID}>
                                          <input 
                                            className="phrase-input" 
                                            type="text" 
                                            id={response.ResponseID}
                    
                                            value={response.Phrase}
                                            maxLength={80}
                                            onChange={(e) => {
                                              handleChange(e, response.ResponseID)
                                            }}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                    <div>
                                      
                                      {[...Array(additionalPhraseNum)].map((_, i) => (
                                    <div key={i}>
                                    <input className="phrase-input" type="text" 
                                        id={`phrase${i}`}
                                        value={phrases[i]}
                                        onChange={(event) => setAdditionalPhrases([...additionalPhrases.slice(0, i), event.target.value, ...additionalPhrases.slice(i+1)])} maxLength={50}/>

                                    </div>
                                  ))}
                                    </div>
                                  
                                    
                                  </div>
                                :
                                <div>
                                  {[...Array(20)].map((_, i) => (
                                    <div key={i}>
                                    <input className="phrase-input" type="text" 
                                        id={`phrase${i}`}
                                        value={phrases[i]}
                                        onChange={(event) => setPhrases([...phrases.slice(0, i), event.target.value, ...phrases.slice(i+1)])} maxLength={50}/>

                                    </div>
                                  ))}
                                </div>
                                }
                                <div>
                                  <input type='checkbox' id='publicCheck' name='publicCheck' ref={publicRef} onChange={(e) => setMakePublic(!makePublic)}/>
                                  Public
                                </div>
                                <div className="public-info">
                                  Checking public will allow others to use your theme after approval.
                                </div>
                                <div>
                                  <button className="default-button" type="submit">{method==='edit' ? `Update ` : 'Add '} Theme</button>
                                </div>
                          </form>
                      </div>
                      {method==='edit' && adminComments !=="" && adminComments != null &&
                          <div className='admin-display'>
                            {approval ? ( 
                              <div className="approve">
                                Approved
                              </div>
                            ): (
                              <div className="deny">
                                Denied
                              </div>
                            )}
                            <div >
                              Admin Comments:
                            </div>
                            <div>
                              {adminComments}
                            </div>
                          </div>
                        }
                    
          </div>
      </div>
      
  )
}

export default UserThemes;
