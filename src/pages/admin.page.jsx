import {useState, useEffect} from 'react';
import settings from '../config/settings.json'


function AdminPage() {
    let [userThemes, setUserThemes] = useState([]);
    let [currentThemeID, setCurrentThemeID] = useState("");
    let [themeName, setThemeName] = useState("");
    let [phrases, setPhrases] = useState([]);
    let [comments, setComments] = useState("");
    let [method, setMethod] = useState("");
    let [shouldUpdate, setShouldUpdate] = useState(false)

    useEffect(() => {
        fetch(`${settings.serverUrl}/api/themes/admin`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
          .then((res) => res.json())
          .then((data) => {
            setUserThemes(data);
          })
          .catch((err) => {
            console.error(err);
          });
      }, []);

      function getPhrases(id, name) {
        setMethod('approval');
        setThemeName(name);
        setCurrentThemeID(id);
        fetch(`${settings.serverUrl}/api/responses/responsesForTheme/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ themeId: id })
          })
            .then((res) => res.json())
            .then((data) => {
              setPhrases(data)
            })
            .catch((err) => {
              console.error(err);
            });
      }

      function updateTheme(approval) {
            let updatedType = approval ? "public" : "private";
            let reqBody = {
                id: currentThemeID,
                type: updatedType,
                comments: comments,
                approved: approval
            }
            fetch(`${settings.serverUrl}/api/themes/adminUpdate`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(reqBody)
            })
            .then((res) => res.json())
            .then((data) => {
                setPhrases(data)
            })
            .catch((err) => {
                console.error(err);
            });
            setShouldUpdate(!shouldUpdate);
      }

    return (
        <div>
            <div className='center'>
                Admin Page
            </div>
            <div className='space-small'></div>
            {userThemes.length === 0  &&
            <div>
                There are no themes that need your approval.
            </div>
            }
            <div className='admin-grid'>
                <div className='admin-column'>
                    
                    {userThemes.length > 0 &&
                    <>
                        <div className='admin-grid-title'>
                            Select a Theme to Review
                        </div>
                        <div>
                                    <table className="themes-table">
                                        <tbody>
                                        {userThemes.map((t) =>
                                            <tr key={t.ThemeID} value={t.ThemeID} onClick={e => getPhrases(t.ThemeID, t.Name)}>
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
                                
                        </div>
                    </>
                    }
                </div>
                <div className='admin-column'>
                            {phrases.length > 0 && 
                            <div>
                                <div className='admin-grid-title-2'>
                                    {themeName}
                                </div>
                                <div>
                                    <table className='phrase-table'>
                                        <tbody>
                                            {phrases.map((p) =>
                                                <tr key={p.ResponseID} value={p.ResponseID}>
                                                    <td> 
                                                        {p.Phrase}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                            }
                    </div>
            </div>
            {method==='approval' && 
            <div className='approve-grid'>
                <div className='approve-grid-comments'>
                    <div>
                        <label htmlFor="comments">Comments:</label>
                    </div>
                    <div> 
                        <input type='text' id='comments' name='comments' value={comments} onChange={e => setComments(e.target.value)}/>
                    </div> 
                </div>
                <div className='approve-grid-comments'>
                    <div>
                        <button id='approve' name='approve' onClick={()=>updateTheme(true)}>Approve</button>
                    </div>
                    <div>
                        <button id='approve' name='approve' onClick={()=>updateTheme(false)}>Deny</button>
                    </div>
                </div>
                
            </div>
            }
            
            
        </div>

    )
}

export default AdminPage


