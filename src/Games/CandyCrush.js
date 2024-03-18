import { useEffect, useState } from "react";
import './CandyCrush.css'
import blueCandy from "./images/blue-candy.png"
import greenCandy from "./images/green-candy.png"
import orangeCandy from "./images/orange-candy.png"
import purpleCandy from "./images/purple-candy.png"
import redCandy from "./images/red-candy.png"
import yellowCandy from "./images/yellow-candy.png"
import blank from "./images/blank.png"
import vstripedblue from "./images/Striped_blue_v.png"
import hstripedblue from "./images/Striped_blue_h.png"
import vstripedgreen from "./images/Striped_green_v.png"
import hstripedgreen from "./images/Striped_green_h.png"
import vstripedorange from "./images/Striped_orange_v.png"
import hstripedorange from "./images/Striped_orange_h.png"
import vstripedpurple from "./images/Striped_purple_v.png"
import hstripedpurple from "./images/Striped_purple_h.png"
import vstripedred from "./images/Striped_red_v.png"
import hstripedred from "./images/Striped_red_h.png"
import vstripedyellow from "./images/Striped_yellow_v.png"
import hstripedyellow from "./images/Striped_yellow_h.png"
import { updateScore } from "./api";


const width = 8
const candycolors = [
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
]

const stripedcolors = [
  vstripedblue,
  hstripedblue,
  vstripedgreen,
  hstripedgreen,
  vstripedorange,
  hstripedorange,
  vstripedpurple,
  hstripedpurple,
  vstripedred,
  hstripedred,
  vstripedyellow,
  hstripedyellow
]
const getstripedcolor = (color , direction) =>{
  if(direction === "h"){
    if(color.includes("blue")) return  stripedcolors[1]
    if(color.includes("green")) return stripedcolors[3]
    if(color.includes("orange")) return stripedcolors[5]
    if(color.includes("purple")) return stripedcolors[7]
    if(color.includes("red")) return stripedcolors[9]
    if(color.includes("yellow")) return stripedcolors[11]
    if(color.includes("blank")) return blank
  }
  else{
    if(color.includes("blue")) return  stripedcolors[0]
    if(color.includes("green")) return stripedcolors[2]
    if(color.includes("orange")) return stripedcolors[4]
    if(color.includes("purple")) return stripedcolors[6]
    if(color.includes("red")) return stripedcolors[8]
    if(color.includes("yellow")) return stripedcolors[10]
    if(color.includes("blank")) return blank
  }
}

const getColors = (color) =>{
  if(color.includes("blue")) return  'blue'
  if(color.includes("green")) return 'green'
  if(color.includes("orange")) return 'orange'
  if(color.includes("purple")) return  'purple'
  if(color.includes("red")) return 'red'
  if(color.includes("yellow")) return 'yellow'
  if(color.includes("blank")) return 'blank'

}

const CandyCrush = () => {
  
   const [currentcolorArrangement,setcurrentcolorArrangement] = useState([])
   const [squareBeingDragged,setsquareBeingDragged] = useState(null)
   const [squareBeingReplaced,setsquareBeingReplaced] = useState(null)
   const [scoreDisplay,setScoreDisplay]= useState(0)

   const checkColumnOfThree = () =>{
    for(let i = 0;i <= 47; i ++)
    {
      const columnOfThree = [i,i+width,i+width*2]
      const decidedColor = currentcolorArrangement[i].color
      const isBlank = currentcolorArrangement[i] === blank

      if(columnOfThree.every(square => currentcolorArrangement[square].color === decidedColor && !isBlank)){
        setScoreDisplay((score)=> score + 3)
        columnOfThree.forEach(square => {currentcolorArrangement[square].src = blank
        currentcolorArrangement[square].color = "blank"})
        return true
      }
    }
   }

   const checkColumnOfFour = () =>{
    for(let i = 0;i <= 39; i ++)
    {
      const columnOfFour = [i,i+width,i+width*2,i+width*3]
      const decidedColor = currentcolorArrangement[i].color
     
      if(columnOfFour.every(square => currentcolorArrangement[square].color === decidedColor)){
        setScoreDisplay((score)=> score + 4)
        columnOfFour.forEach(square => {currentcolorArrangement[square].src = blank
        currentcolorArrangement[square].color = "blank"});
        const square = columnOfFour[0];
        const c = getstripedcolor(decidedColor,"v")
        console.log(c);
        currentcolorArrangement[square].src = c
        currentcolorArrangement[square].color = decidedColor
        return true
      }
    }
   }

   const checkColumnOfFive = () =>{
    for(let i = 0;i <= 31; i ++)
    {
      const columnOfFive = [i,i+width,i+width*2,i+width*3,i+width*4]
      const decidedColor = currentcolorArrangement[i].color;

      if(columnOfFive.every(square => currentcolorArrangement[square].color === decidedColor)){
        setScoreDisplay((score)=> score + 5)
        columnOfFive.forEach(square => {currentcolorArrangement[square].src = blank
        currentcolorArrangement[square].color = "blank"})
        return true
      }
    }
   }

   const checkRowOfThree = () =>{
    for(let i = 0;i < 64; i ++)
    {
      const rowOfThree = [i,i+1,i+2]
      const decidedColor = currentcolorArrangement[i].color;
      const notvalid =[6,7,14,15,22,23,30,31,38,39,46,47,54,55,62,63]

      if(notvalid.includes(i)) continue

      if(rowOfThree.every(square => currentcolorArrangement[square].color === decidedColor)){
        setScoreDisplay((score)=> score + 3)
        rowOfThree.forEach(square => {currentcolorArrangement[square].src = blank
        currentcolorArrangement[square].color = "blank"})
        return true
      }
    }
   }

   const checkRowOfFour = () =>{
    for(let i = 0;i < 64; i ++)
    {
      const rowOfFour = [i,i+1,i+2,i+3]
      const decidedColor = currentcolorArrangement[i].color;
      const notvalid =[5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,61,62,63]

      if(notvalid.includes(i)) continue
      if(rowOfFour.every(square => currentcolorArrangement[square].color === decidedColor)){
        setScoreDisplay((score)=> score + 4)
        rowOfFour.forEach(square => {currentcolorArrangement[square].src = blank
        currentcolorArrangement[square].color = "blank"});
          const square = rowOfFour[0];
          const c = getstripedcolor(decidedColor,"h")
         currentcolorArrangement[square].src = c
         currentcolorArrangement[square].color = decidedColor
        return true
      }
    }
   }

   const checkRowOfFive = () =>{
    for(let i = 0;i < 64; i ++)
    {
      const rowOfFive = [i,i+1,i+2,i+3,i+4]
      const decidedColor = currentcolorArrangement[i].color;
      const notvalid =[4,5,6,7,12,13,14,15,20,21,22,23,28,29,30,31,36,37,38,39,44,45,46,47,52,53,54,55,60,61,62,63]

      if(notvalid.includes(i)) continue

      if(rowOfFive.every(square => currentcolorArrangement[square].color === decidedColor)){
        setScoreDisplay((score)=> score + 5)
        rowOfFive.forEach(square => {currentcolorArrangement[square].src = blank
        currentcolorArrangement[square].color = "blank"})
        return true
      }
    }
   }

   const moveSquareIntoBelow = () => {
    for(let i= 0 ; i < 64 - width;i++){
      const firstRow = [0,1,2,3,4,5,6,7]
      const isFirstRow = firstRow.includes(i);

     if(isFirstRow && currentcolorArrangement[i].src === blank){
      let randomNumber = Math.floor(Math.random()* candycolors.length)
      currentcolorArrangement[i].src = candycolors[randomNumber]
      currentcolorArrangement[i].color = getColors(candycolors[randomNumber])
     }  

     if(currentcolorArrangement[i+width].src === blank)
     {
      currentcolorArrangement[i+width].src = currentcolorArrangement[i].src;
      currentcolorArrangement[i+width].color = currentcolorArrangement[i].color;
      currentcolorArrangement[i].src= blank;
      currentcolorArrangement[i].color = "blank";
     }
    }
   }

   const dragStart = (e) =>{
     setsquareBeingDragged(e.target)
   }

   const dragDrop = (e) =>{
     setsquareBeingReplaced(e.target)
   }

   const dragEnd = (e) => {
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'));
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'));
    const validMoves = [
        squareBeingDraggedId - 1,
        squareBeingDraggedId - width,
        squareBeingDraggedId + 1,
        squareBeingDraggedId + width
    ];
    const validMove = validMoves.includes(squareBeingReplacedId);

    if (validMove) {
        currentcolorArrangement[squareBeingReplacedId].src = squareBeingDragged.getAttribute('src');
        currentcolorArrangement[squareBeingDraggedId].color= squareBeingReplaced.getAttribute('alt');
        currentcolorArrangement[squareBeingDraggedId].src = squareBeingReplaced.getAttribute('src');
        currentcolorArrangement[squareBeingReplacedId].color = squareBeingDragged.getAttribute('alt');
    }

    const isAColumnOfFive = checkColumnOfFive();
    const isARowOfFive = checkRowOfFive();
    const isAColumnOfFour = checkRowOfFour();
    const isARowOfFour = checkColumnOfFour();
    const isAColumnOfThree = checkColumnOfThree();
    const isARowOfThree = checkRowOfThree();

    if (squareBeingReplacedId && validMove && (
        isAColumnOfFive || isARowOfFive ||
        isAColumnOfFour || isARowOfFour ||
        isAColumnOfThree || isARowOfThree
    )) {
        setsquareBeingDragged(null);
        setsquareBeingReplaced(null);
    } else {
        currentcolorArrangement[squareBeingReplacedId].src = squareBeingReplaced.getAttribute('src');
        currentcolorArrangement[squareBeingReplacedId].color = squareBeingReplaced.getAttribute('alt');
        currentcolorArrangement[squareBeingDraggedId].src = squareBeingDragged.getAttribute('src');
        currentcolorArrangement[squareBeingDraggedId].color = squareBeingDragged.getAttribute('alt');
        setcurrentcolorArrangement([...currentcolorArrangement]);
    }

    updateScore({ game: "Candy Crush", gameScore: scoreDisplay, gamerId: sessionStorage.getItem("user") });
}


const createBoard = () => {
  const randomcolorArrangement = [];
  for (let i = 0; i < width * width; i++) {
      const randomColor = candycolors[Math.floor(Math.random() * candycolors.length)];
      const colorObj = {
          src: randomColor,
          color: getColors(randomColor)
      };
      randomcolorArrangement.push(colorObj);
  }
  setcurrentcolorArrangement(randomcolorArrangement);
};


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
      height:"90vh",
      display: "flex",
      flexDirection: "column",
      width: "100%",
  }}>
    <div className="scoreboard">
  <h2>Score</h2>
  <p>{scoreDisplay}</p>
</div>


    <div className="game">
    {currentcolorArrangement.map((candy, index) => (
    <img 
        key={index}
        src={candy.src}
        alt={candy.color}
        data-id={index}
        draggable={true}
        onDragStart={dragStart}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={(e) => e.preventDefault()}
        onDragLeave={(e) => e.preventDefault()}
        onDrop={dragDrop}
        onDragEnd={dragEnd}
    />
))}
    </div>
   
  </div>
  );
}

export default CandyCrush;
