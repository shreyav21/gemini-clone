import { createContext, useState } from "react";
import run from '../config/gemini';

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(function(){
        setResultData(prev=>prev+nextWord);
    },75*index)
  };

  const newChat = ()=>{
    setLoading(false)
    setShowResult(false)
  }

  const onSent = async (prompt) => {
    setResultData(""); // Clear previous result
    setLoading(true);  // Set loading state to true
    setShowResult(true);
    let Response;
    if(prompt!==undefined){
        Response = await run(prompt);
        setRecentPrompt(prompt)
    }else{
        setPrevPrompts(prev=>[...prev,input])
        setRecentPrompt(input)
        Response = await run(input)
    }
    setRecentPrompt(input); // Set the recent prompt
    setPrevPrompts(prev=>[...prev,input])
    const response = await run(input);
    if (!response) {
      setResultData("No response received.");
      setLoading(false);
      return;
    }

    let responseArray = response.split("**"); // Split the response by "**"

    let newResponse = ""; // Initialize newResponse as an empty string

    // Loop through the response array and format it
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i]; // Append as normal text
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>"; // Wrap in <b> for bold text
      }
    }

    // Split further by "*" and replace with </br> for line breaks
    let newResponse2 = newResponse.split("*").join("</br>");
    let newResponseArray = newResponse2.split(" ");
    for(let i=0;i<newResponseArray.length;i++){
        const nextWord = newResponseArray[i];
        delayPara(i,nextWord+" ")
    }
    
    setLoading(false); // Turn off loading state
    setInput(""); // Clear the input field
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
