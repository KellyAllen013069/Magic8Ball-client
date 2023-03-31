
/* eslint-disable react-hooks/exhaustive-deps */

import { useContext, useState, useEffect, useRef } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { AuthContext } from "../components/AuthContext";



function DefaultPage() {
    let [themes, setThemes] = useState([]);
    let [currentThemeName, setCurrentThemeName] = useState("");
    let [currentThemeCont, setCurrentThemeCont] = useState("");
    //responses holds all possible responses for 8 ball fortune
    let [responses, setResponses] = useState([]);
    //random phrase will be the random one response from the response object array
    //set initially to empty string
    let [randomPhrase, setRandomPhrase] = useState("");
    let {authUser} = useContext(AuthContext);
    let [isLoading, setIsLoading] = useState(true);
    let themeSelector = useRef(null);

    const {
      transcript,
      listening,
      browserSupportsSpeechRecognition,
    } = useSpeechRecognition();


    function getAllThemes() {
    
      if(authUser) {
        let reqBody = {id:authUser.id}
        fetch(`/api/themes/publicAndUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqBody)
        })
        .then((res) => res.json())
        .then((data) => {
          setThemes(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setThemes("");
        });
      } else {
      
        fetch(`/api/themes/public`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => res.json())
        .then((data) => {
          setThemes(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setThemes("");
        });
      }
    }

    function getDefaultResponses() {
      fetch(`/api/responses/default`)
          .then((res) => res.json())
          .then((data) => setResponses(data))
          .catch((err) => {
            console.error(err);
            setResponses("");
          });    
    }

    function updateTheme(themeId) {
      //let currentTheme = themeSelector.current.options[themeSelector.current.selectedIndex].getAttribute("id");
      let currentTheme = themeSelector.current.selectedIndex;
      setCurrentThemeName(themes[currentTheme].Name);
      setCurrentThemeCont(themes[currentTheme].UserName)
      fetch(`/api/responses/responsesForTheme`,{
        'method': 'POST',
        'headers': {
          'content-type': 'application/json'
        },
        body: JSON.stringify({themeId:themeId})
      })
      .then((res) => res.json())
          .then((data) => setResponses(data))
          .catch((err) => {
            console.error(err);
            setResponses("");
          });    
    }


    function shake(){
      let ball= document.getElementById("ball")
      //css animation
      ball.classList.add("shake");
      //remove shake class
      setTimeout(function(){ ball.classList.remove("shake"); }, 1500);
    }

    function listen() {
      setRandomPhrase("");
      SpeechRecognition.startListening();
    }

    //update fortune(random phrase) on an event
    function updatePhrase() {
      SpeechRecognition.stopListening();
        setRandomPhrase("");
        shake();
        setTimeout(() => {

          if (transcript.toLowerCase().includes("javascript")) {
            setRandomPhrase("JAVASCRIPT RULES!!!")
          }else {
            
            let random = responses[Math.floor(Math.random()*responses.length)];
            setRandomPhrase(`${random.Phrase}`);
          
          }
        }, 1500);  
    };

    //get 8 ball responses on initial load (when component mounts)
    useEffect( () => {
      getAllThemes();
      getDefaultResponses();
      setCurrentThemeName("Basic")
    },[]);
  
    if (!browserSupportsSpeechRecognition) {
      return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
       
          <div className="main-page-flex center">
            
            <div className="main-page-flex">
              <div className="space-tiny"></div>
              <div className="theme-selection">
                <div>
                  Select a Theme
                </div>
                <div>
                  <select name="themes" id="themes" ref={themeSelector} onChange={(e) => updateTheme(e.target.value)} defaultValue="default">
                    {!isLoading &&
                      themes.map((t) => (
                        <option key={t.ThemeID} value={t.ThemeID} id={t.Name} selected={t.Name === "Basic"}>
                          {t.Name}
                          {authUser && t.UserID === authUser.id ? "*" : ""}
                          {t.Type === 'private' ? ' (private)' : ""}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
    
              <div className="mainpage-sep center">
                <hr />
              </div>
            </div>
            <div className="main-header">
            {currentThemeName} Theme{currentThemeCont !== "" && currentThemeCont !== "default" && currentThemeCont !== 'developer' && currentThemeCont !== undefined ? ` (contributed by ${currentThemeCont})` : ""}
            </div>
            <div className="space"></div>
            <div>
              <div className="wrapper center">
                <div>
                  <div className="main-image">
                    <img className="ball" id="ball" alt="Magic 8 Ball" src="./images/8ball.png" />
                  </div>
                </div>
                <div className="fortune-container">
                  <div>
                    <p>Microphone: {listening ? "on" : "off"}</p>
                  </div>
                  <div>
                    <button id="btnAsk" onClick={listen}>
                      Ask Me Anything
                    </button>
                  </div>
                  <div>
                    <p>{transcript}? </p>
                  </div>
                  <div>
                    <button id="btnFortune" onClick={updatePhrase}>
                      Get Fortune
                    </button>
                  </div>
                  <div>
                    <p id="fortuneDisplay" className="fortune">
                      {randomPhrase}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      
    );
    
}

export default DefaultPage;

