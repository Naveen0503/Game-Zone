import { useEffect, useState } from "react";
import './CandyCrush.css'
import blueCandy from "./images/blue-candy.png"
import greenCandy from "./images/green-candy.png"
import orangeCandy from "./images/orange-candy.png"
import purpleCandy from "./images/purple-candy.png"
import redCandy from "./images/red-candy.png"
import yellowCandy from "./images/yellow-candy.png"
import blank from "./images/blank.png"

const width = 8
const candycolors = [
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy
]

const CandyCrush = () => {
  
   const [currentcolorArrangement,setcurrentcolorArrangement] = useState([])
   const [squareBeingDragged,setsquareBeingDragged] = useState(null)
   const [squareBeingReplaced,setsquareBeingReplaced] = useState(null)
   const [scoreDisplay,setScoreDisplay]= useState(0)

   const checkColumnOfThree = () =>{
    for(let i = 0;i <= 47; i ++)
    {
      const columnOfThree = [i,i+width,i+width*2]
      const decidedColor = currentcolorArrangement[i]
      const isBlank = currentcolorArrangement[i] === blank

      if(columnOfThree.every(square => currentcolorArrangement[square] === decidedColor && !isBlank)){
        setScoreDisplay((score)=> score + 3)
        columnOfThree.forEach(square => currentcolorArrangement[square] = blank)
        return true
      }
    }
   }

   const checkColumnOfFour = () =>{
    for(let i = 0;i <= 39; i ++)
    {
      const columnOfFour = [i,i+width,i+width*2,i+width*3]
      const decidedColor = currentcolorArrangement[i]

      if(columnOfFour.every(square => currentcolorArrangement[square] === decidedColor)){
        setScoreDisplay((score)=> score + 4)
        columnOfFour.forEach(square => currentcolorArrangement[square] = blank)
        return true
      }
    }
   }

   const checkColumnOfFive = () =>{
    for(let i = 0;i <= 31; i ++)
    {
      const columnOfFive = [i,i+width,i+width*2,i+width*3,i+width*4]
      const decidedColor = currentcolorArrangement[i]

      if(columnOfFive.every(square => currentcolorArrangement[square] === decidedColor)){
        setScoreDisplay((score)=> score + 5)
        columnOfFive.forEach(square => currentcolorArrangement[square] = blank)
        return true
      }
    }
   }

   const checkRowOfThree = () =>{
    for(let i = 0;i < 64; i ++)
    {
      const rowOfThree = [i,i+1,i+2]
      const decidedColor = currentcolorArrangement[i]
      const notvalid =[6,7,14,15,22,23,30,31,38,39,46,47,54,55,62,63]

      if(notvalid.includes(i)) continue

      if(rowOfThree.every(square => currentcolorArrangement[square] === decidedColor)){
        setScoreDisplay((score)=> score + 3)
        rowOfThree.forEach(square => currentcolorArrangement[square] = blank)
        return true
      }
    }
   }

   const checkRowOfFour = () =>{
    for(let i = 0;i < 64; i ++)
    {
      const rowOfFour = [i,i+1,i+2,i+3]
      const decidedColor = currentcolorArrangement[i]
      const notvalid =[5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,61,62,63]

      if(notvalid.includes(i)) continue

      if(rowOfFour.every(square => currentcolorArrangement[square] === decidedColor)){
        setScoreDisplay((score)=> score + 4)
        rowOfFour.forEach(square => currentcolorArrangement[square] = blank)
        return true
      }
    }
   }

   const checkRowOfFive = () =>{
    for(let i = 0;i < 64; i ++)
    {
      const rowOfFive = [i,i+1,i+2,i+3,i+4]
      const decidedColor = currentcolorArrangement[i]
      const notvalid =[4,5,6,7,12,13,14,15,20,21,22,23,28,29,30,31,36,37,38,39,44,45,46,47,52,53,54,55,60,61,62,63]

      if(notvalid.includes(i)) continue

      if(rowOfFive.every(square => currentcolorArrangement[square] === decidedColor)){
        setScoreDisplay((score)=> score + 5)
        rowOfFive.forEach(square => currentcolorArrangement[square] = blank)
        return true
      }
    }
   }

   const moveSquareIntoBelow = () => {
    for(let i= 0 ; i < 64 - width;i++){
      const firstRow = [0,1,2,3,4,5,6,7]
      const isFirstRow = firstRow.includes(i);

     if(isFirstRow && currentcolorArrangement[i] === blank){
      let randomNumber = Math.floor(Math.random()* candycolors.length)
      currentcolorArrangement[i] = candycolors[randomNumber]
     }  

     if(currentcolorArrangement[i+width] === blank)
     {
      currentcolorArrangement[i+width] = currentcolorArrangement[i];
      currentcolorArrangement[i]= blank;
     }
    }
   }

   const dragStart = (e) =>{
     setsquareBeingDragged(e.target)
   }

   const dragDrop = (e) =>{
     setsquareBeingReplaced(e.target)
   }

   const dragEnd = (e) =>{
      const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
      const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

      const validMoves = [
        squareBeingDraggedId-1,
        squareBeingDraggedId-width,
        squareBeingDraggedId+1,
        squareBeingDraggedId+width
      ]

      const validMove = validMoves.includes(squareBeingReplacedId)

    if(validMove){
      currentcolorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
      currentcolorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')
    }


     const isAColumnOfFive = checkColumnOfFive();
     const isARowOfFive = checkRowOfFive();

     const isAColumnOfFour = checkRowOfFour();
     const isARowOfFour = checkColumnOfFour();
      
     const isAColumnOfThree = checkColumnOfThree();
     const isARowOfThree =  checkRowOfThree();

     if(squareBeingReplacedId && validMove && 
      ( isAColumnOfFive || isARowOfFive ||
         isAColumnOfFour || isARowOfFour || 
         isAColumnOfThree || isARowOfThree)){
          setsquareBeingDragged(null)
          setsquareBeingReplaced(null)
         }
      else{
        currentcolorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
        currentcolorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
        setcurrentcolorArrangement([...currentcolorArrangement])
      }
      
   }

   const createBoard = () =>{
      const randomcolorArrangement = []
      for(let i=0;i<width * width;i++){
        const randomcolor = candycolors[Math.floor(Math.random() * candycolors.length)]
        randomcolorArrangement.push(randomcolor)
      }
      setcurrentcolorArrangement(randomcolorArrangement)
   }

    useEffect(() =>{
      createBoard();
    },[])

    useEffect(()=>{
    const timer = setInterval(() => {
      checkColumnOfFive();
      checkRowOfFive();

      checkRowOfFour();
      checkColumnOfFour();
      
      checkColumnOfThree();
      checkRowOfThree();

      moveSquareIntoBelow();
      setcurrentcolorArrangement([...currentcolorArrangement])
    }, 100);
    return () => clearInterval(timer)
    },[checkColumnOfFive,checkRowOfFive,
      checkColumnOfFour,checkRowOfFour,
      checkColumnOfThree,checkRowOfThree,
      moveSquareIntoBelow,currentcolorArrangement])

  return (
    <div className="CandyCrush" style={{
      height:"100vh",
      display: "flex",
      flexDirection: "column",
      width: "100%",
  }}>
    <div class="scoreboard">
  <h2>Score</h2>
  <p>{scoreDisplay}</p>
</div>


    <div className="game">
      {currentcolorArrangement.map((candycolor,index)=>
      <img 
      key={index}
      src={candycolor}
      alt={candycolor}
      data-id = {index}
      draggable= {true}
      onDragStart={dragStart}
      onDragOver={(e)=>e.preventDefault()}
      onDragEnter={(e)=>e.preventDefault()}
      onDragLeave={(e)=>e.preventDefault()}
      onDrop={dragDrop}
      onDragEnd={dragEnd}
      />)}
    </div>
   
  </div>
  );
}

export default CandyCrush;
