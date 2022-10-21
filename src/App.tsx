import React, { useState, useEffect} from 'react';
import './App.css';
import Grid from './components/Grid'
import GraphemeSplitter from 'grapheme-splitter';
import axios from "axios"

function App() {
  const baseApiUrl= "http://mmatasic.duckdns.org:5000/wordle?lang=hr&globs="
  const [guess, setGuess] = useState("");
  const [states, setStates] = useState((new Array<number>(30)).fill(0));
  const [apiResponse, setApiResponse] = useState({eliminationSuggestions:[{}], possible:[], topTip:[]});
  const onChar = (value: string) => {
      setGuess(`${guess}${value}`)
  }

  const onDelete = () => {
    setGuess(
      new GraphemeSplitter().splitGraphemes(guess).slice(0, -1).join('')
    )
  }

  const onEnter = () => {
   apiCall(); 
   console.log(apiResponse);
  }

  function constructApiUrl(): string{
    let trimmedGuess = "";
    if(guess.length%5===0) {
      trimmedGuess = guess;
    } else {
      trimmedGuess = guess.substring(0,guess.length-(guess.length%5));
    }
    let globs='';
    for(let i = 0; i < trimmedGuess.length; i ++) {
      let j = 0
      while (j<5) {
        globs=globs + trimmedGuess[i+j];
        let modifier = '-'
        switch (states[i+j]) {
          case 0:
          case 1:
            modifier = '-'
            break;
          case 2: 
            modifier = '*'
            break;
          case 3: 
            modifier = '+'
            break;
        }
        globs = globs + modifier;
        j ++;
      }
      i+=4;
      if(i+2<trimmedGuess.length) {
        globs = globs + ','
      }
    }
    console.log(baseApiUrl + globs);
    return baseApiUrl + globs;
  }

  const apiCall=()=>{
    axios
        .get(constructApiUrl())
            .then((response) => {
                setApiResponse(response.data);
            })
        .catch((error) => {
            console.log(error);
        });
  }

  const onItemClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    let index:number = 0;
    if(target.dataset['key']) {
      index = parseInt(target.dataset['key']);
    }
    if(index || index === 0) {
      const newState = (states[index] +1) %4
      let newStates:number[] = [...states];
      newStates.splice(index,1,newState);
      setStates(newStates);
    }
  }

  return (
    <div className="App">
    <Grid onChar={onChar}
          onDelete={onDelete}
          onEnter={onEnter}
          guess={guess}
          states={states}
          onItemClick={onItemClick}
          />
    <div className='result'>
      
      {apiResponse.possible && 
        <div className='possible'><ul>{apiResponse.possible.map((item,index:number) => {return <li key={index}>{item}</li>})}</ul></div>
      }
    </div>
      
    </div>
  );
  
}
export default App;
