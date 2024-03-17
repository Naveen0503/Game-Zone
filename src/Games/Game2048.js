
import cloneDeep from "lodash.clonedeep";
import React, { useEffect } from "react";
import { useState } from 'react';
import { getColors, useEvent } from "./util";
import { updateScore } from "./api";


function Game2048() {

  const UP_ARROW = 38;
  const DOWN_ARROW = 40;
  const LEFT_ARROW = 37;
  const RIGHT_ARROW = 39;

  const[data,setdata]=useState([
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
    [0,0,0,0],
  ]);

  const [gameOver, setGameOver] = useState(false);
  const [score,setscore] = useState(0);

  const initialize = () => {

    let newGrid = cloneDeep(data);
    console.log(newGrid);

    addNumber(newGrid);
    console.table(newGrid);

    addNumber(newGrid);
    console.table(newGrid);

    setdata(newGrid);
  }

  const addNumber = (newGrid) => {
     let added = false;
     let gridFull = false;
     let attempts = 0 ;
     while(!added){
      if(gridFull){
        break;
      }

      let rand1 = Math.floor(Math.random() * 4);
      let rand2 = Math.floor(Math.random() * 4);
      attempts++;
      if(newGrid[rand1][rand2]===0){
       newGrid[rand1][rand2] = Math.random() > 0.5 ? 2 : 4
       added = true ;

      }

      if(attempts > 50){
        gridFull = true ;
        let gameoverr = checkIfGameOver();
        if(gameoverr){
            //setGameOver(true);
        }
        //setGameOver(true);
      }
     }           

  }
  const swipeLeft = (dummy) => {
    
    let oldGrid = data;
    let newArray = cloneDeep(data);
    let totalScore = 0;
    for (let i = 0; i < 4; i++) {
      let b = newArray[i];
      let slow = 0;
      let fast = 1;
      while (slow < 4) {
        if (fast === 4) {
          fast = slow + 1;
          slow++;
          continue;
        }
        if (b[slow] === 0 && b[fast] === 0) {
          fast++;
        } else if (b[slow] === 0 && b[fast] !== 0) {
          b[slow] = b[fast];
          b[fast] = 0;
          fast++;
        } else if (b[slow] !== 0 && b[fast] === 0) {
          fast++;
        } else if (b[slow] !== 0 && b[fast] !== 0) {
          if (b[slow] === b[fast]) {
            b[slow] = b[slow] + b[fast];
            b[fast] = 0;
            fast = slow + 1;
            totalScore += b[slow];
            slow++;
            
          } else {
            slow++;
            fast = slow + 1;
          }
        }
      }
    }
    if (totalScore > 0) {
      setscore(score + totalScore);
    }
    if (JSON.stringify(oldGrid) !== JSON.stringify(newArray)) {
      addNumber(newArray);
    }
    if(dummy){
      return newArray;
    }
    else{
      setdata(newArray);
    }
    
  };

  const swipeRight = (dummy) => {
    console.log("swipe right");
    let oldData = data;
    let newArray = cloneDeep(data);
    let totalScore = 0;
    for (let i = 3; i >= 0; i--) {
      let b = newArray[i];
      let slow = b.length - 1;
      let fast = slow - 1;
      while (slow > 0) {
        if (fast === -1) {
          fast = slow - 1;
          slow--;
          continue;
        }
        if (b[slow] === 0 && b[fast] === 0) {
          fast--;
        } else if (b[slow] === 0 && b[fast] !== 0) {
          b[slow] = b[fast];
          b[fast] = 0;
          fast--;
        } else if (b[slow] !== 0 && b[fast] === 0) {
          fast--;
        } else if (b[slow] !== 0 && b[fast] !== 0) {
          if (b[slow] === b[fast]) {
            b[slow] = b[slow] + b[fast];
            b[fast] = 0;
            fast = slow - 1;
            totalScore += b[slow];
            slow--;
           
          } else {
            slow--;
            fast = slow - 1;
          }
        }
      }
    }
    if (totalScore > 0) {
      setscore(score + totalScore);
    }
    if (JSON.stringify(newArray) !== JSON.stringify(oldData)) {
      addNumber(newArray);
    }
    
    if(dummy){
      return newArray;
    }
    else{
      setdata(newArray);
    }
    
  };

  const swipeDown = (dummy) => {
    console.log("swipe down");
    console.log(data);
    let b = cloneDeep(data);
    let oldData = JSON.parse(JSON.stringify(data));
    let totalScore = 0;

    for (let i = 3; i >= 0; i--) {
      let slow = b.length - 1;
      let fast = slow - 1;
      while (slow > 0) {
        if (fast === -1) {
          fast = slow - 1;
          slow--;
          continue;
        }
        if (b[slow][i] === 0 && b[fast][i] === 0) {
          fast--;
        } else if (b[slow][i] === 0 && b[fast][i] !== 0) {
          b[slow][i] = b[fast][i];
          b[fast][i] = 0;
          fast--;
        } else if (b[slow][i] !== 0 && b[fast][i] === 0) {
          fast--;
        } else if (b[slow][i] !== 0 && b[fast][i] !== 0) {
          if (b[slow][i] === b[fast][i]) {
            b[slow][i] = b[slow][i] + b[fast][i];
            b[fast][i] = 0;
            fast = slow - 1;
            totalScore += b[slow][i];
            slow--;
           
          } else {
            slow--;
            fast = slow - 1;
          }
        }
      }
    }
    if (totalScore > 0) {
      setscore(score + totalScore);
    }
    if (JSON.stringify(b) !== JSON.stringify(oldData)) {
      addNumber(b);
    }
    
    if(dummy){
      return b;
    }
    else{
      setdata(b);
    }
    
  };

  const swipeUp = (dummy) => {
    console.log("swipe up");
    let b = cloneDeep(data);
    let oldData = JSON.parse(JSON.stringify(data));
    let totalScore = 0;
    for (let i = 0; i < 4; i++) {
      let slow = 0;
      let fast = 1;
      while (slow < 4) {
        if (fast === 4) {
          fast = slow + 1;
          slow++;
          continue;
        }
        if (b[slow][i] === 0 && b[fast][i] === 0) {
          fast++;
        } else if (b[slow][i] === 0 && b[fast][i] !== 0) {
          b[slow][i] = b[fast][i];
          b[fast][i] = 0;
          fast++;
        } else if (b[slow][i] !== 0 && b[fast][i] === 0) {
          fast++;
        } else if (b[slow][i] !== 0 && b[fast][i] !== 0) {
          if (b[slow][i] === b[fast][i]) {
            b[slow][i] = b[slow][i] + b[fast][i];
            b[fast][i] = 0;
            fast = slow + 1;
            totalScore += b[slow][i];
            slow++;
           
          } else {
            slow++;
            fast = slow + 1;
          }
        }
      }
    }
    if (totalScore > 0) {
      setscore(score + totalScore);
    }
    if (JSON.stringify(oldData) !== JSON.stringify(b)) {
      addNumber(b);
    }
   
    if(dummy){
      return b;
    }
    else{
      setdata(b);
    }
    
  };

 const handleKeyDown = (event) => {
  if(gameOver){
    return ;
  }
  switch(event.keyCode){
    case UP_ARROW:
      // alert("up");
      // console.table(data);
      swipeUp();
      // console.table(data);
      break;
    case DOWN_ARROW:
      // console.table(data);
      swipeDown();
      // console.table(data);
      break;
    case LEFT_ARROW:
      // console.table(data);
      swipeLeft();
      // console.table(data);
      break;
    case RIGHT_ARROW:
      // console.table(data);
      swipeRight();
      // console.table(data);
      break;
    default:
      break;
  }

  let gameoverr = checkIfGameOver();
  if(gameoverr){
     localStorage.setItem("2048highestScores",sessionStorage.getItem("2048highestScores") > score ? sessionStorage.getItem("2048highestScores"): score)
     updateScore({game: "2048", gameScore: score , gamerId: sessionStorage.getItem("user")});
    setGameOver(true);
  }
 }

 const checkIfGameOver = () => {
  console.log("CHECKING GAME OVER");
  // let original = cloneDeep(data);
  let checker = swipeLeft(true);

  if (JSON.stringify(data) !== JSON.stringify(checker)) {
    return false;
  }

  let checker2 = swipeDown(true);
  console.log("CHECKER DOWN");
  console.table(data);
  console.table(checker2);
  if (JSON.stringify(data) !== JSON.stringify(checker2)) {
    return false;
  }

  let checker3 = swipeRight(true);

  if (JSON.stringify(data) !== JSON.stringify(checker3)) {
    return false;
  }

  let checker4 = swipeUp(true);

  if (JSON.stringify(data) !== JSON.stringify(checker4)) {
    return false;
  }

  return true;
};

const resetGame = () => {
  setscore(0);
  setGameOver(false);
  const emptyGrid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  addNumber(emptyGrid);
  addNumber(emptyGrid);
  setdata(emptyGrid);
};

  useEffect(() =>{
    initialize();
  },[])
  
  useEvent("keydown",handleKeyDown);

  return(
    <div className="App" style={{
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "90vh",
      display: "flex",
      flexDirection: "column"
  }}>
    <div
     style={{
      background : "#57407c",
      width : "max-content",
      margin : "auto",
      padding : 5,
      borderRadius : 5,
      marginTop : "7rem",
      marginBottom:"0px"
     }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ ...style.newGameButton, textAlign: "center" }}>Score <br></br> {score}</div>
        <div style={{ ...style.newGameButton, textAlign: "center" }}>HighScore  {sessionStorage.getItem("2048highestScores")}</div>
       
    </div>
      {data.map((row,oneIndex)=>{
        return(
          <div style={{display : "flex"}} key={oneIndex}>
            {row.map((digit,index) =>(
              <Block num={digit} gameoverrr={gameOver} key={index}/>
            ))}
          </div>
        )
      })}
       
    </div>
    <br></br>
    <div onClick={resetGame} style={{...style.newGameButton ,
      textAlign:"center"}}>
              {gameOver ? <> Try Again</> : <>NEW GAME </>}
            </div>
    </div>
  )
}

const Block = ({num,gameoverrr}) => {

  const {blockStyle} = style;

  const image = getColors(num,gameoverrr);

  return (
    
      
    <div
      style={{
        ...blockStyle,
        position: "relative",
        backgroundImage: num !== 0 ? image : "",
        backgroundColor: num === 0 ? "#3d2963" : "",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {num !== 0 && <span style={{ visibility: "hidden" }}>{num}</span>}
    </div>

  )
};

const style = {
  blockStyle : {
   height : 80,
   width : 80,
   background : "#3d2963",
   margin : 3,
   display : "flex",
   justifyContent : "center",
   alignItems : "center" ,
   fontSize : 45,
   fontWeight : "800",
   color : "white",
  },
  newGameButton: {
    padding: 10,
    background: "#3d2963",
    color: "#F8F5F0",
    width: 95,
    borderRadius: 7,
    fontWeight: "900",
    marginLeft: "auto",
    marginRight : "auto",
    marginBottom: "auto",
    cursor: "pointer",
  },
}
export default Game2048;
