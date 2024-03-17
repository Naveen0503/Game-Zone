import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { updateScore } from './api';

const BIRD_SIZE = 40;
const GAME_WIDTH = 1000;
const GAME_HEIGHT = 500;
const GRAVITY = 6;
const JUMP_HEIGHT = 100;
const OBSTACLE_WIDTH = 52;
const OBSTACLE_GAP = 200;

function FlappyBird() {

const [birdposition,setbirdposition] = useState(250);
const [gamehasstarted,setgamehasstarted] = useState(false);
const [obstacleheight,setobstacleheight] = useState(50);
const [obstacleleft,setobstacleleft] = useState(GAME_WIDTH-OBSTACLE_WIDTH)
const [score,setscore] = useState(0);
const [visibility,setvisibility]= useState(true);


const bottomobstacleheight = GAME_HEIGHT - OBSTACLE_GAP - obstacleheight;
useEffect(() => {
  let timeid ;
  if(gamehasstarted&&birdposition < GAME_HEIGHT - BIRD_SIZE){
    timeid = setInterval(() => {
      setbirdposition((birdposition)=> birdposition + GRAVITY)
    },24);
  }
  return () => {
   clearInterval(timeid);
  };
},[birdposition,gamehasstarted]);
 
useEffect(() => {
let obstacleid;
if(gamehasstarted && obstacleleft >= -OBSTACLE_WIDTH)
{
  obstacleid = setInterval(() => {
    setobstacleleft((obstacleleft) => obstacleleft - 5);
  }, 24);
  return () => {
    clearInterval(obstacleid)
  }
}
else
{
  
  setobstacleleft(GAME_WIDTH-OBSTACLE_WIDTH);
  setobstacleheight(Math.floor(Math.random() * (GAME_HEIGHT-OBSTACLE_GAP)));
  if (gamehasstarted) {
    setscore((score) => score + 1);
  }
}
},[gamehasstarted,obstacleleft]);

useEffect(() => {
  const hascollidedwithtopobstacle = birdposition >= 0 && birdposition < obstacleheight ;
  const hascollidedwithbottomobstacle = birdposition <= GAME_HEIGHT && birdposition >= GAME_HEIGHT - bottomobstacleheight ;

  if( birdposition <= 0 || birdposition >= GAME_HEIGHT - BIRD_SIZE || (obstacleleft >= 0 && obstacleleft <= OBSTACLE_WIDTH && 
    (hascollidedwithtopobstacle || hascollidedwithbottomobstacle)))
    {
      sessionStorage.setItem("FlappyBirdhighestScores",(sessionStorage.getItem("FlappyBirdhighestScores") > score ? sessionStorage.getItem("FlappyBirdhighestScores") : score))
      setscore(0);
      setgamehasstarted(false)
      setvisibility(true)
      setbirdposition(250)
      updateScore({game: "Flappy Bird", gameScore: score , gamerId: sessionStorage.getItem("user")});
    }

},[birdposition,obstacleheight,bottomobstacleheight,obstacleleft])

const handleclick = () =>{
  let newbirdposition = birdposition - JUMP_HEIGHT;
  if(!gamehasstarted){
    setgamehasstarted(true);
    setvisibility(false);
    
  }
  else if(newbirdposition < 0){
    setbirdposition(0)
  }
  else{
  setbirdposition(newbirdposition);
  }
}
  return (
    <Div onClick={handleclick}>
      <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
        
        {visibility ? <Startboard>tap to start Highscore : {sessionStorage.getItem("FlappyBirdhighestScores")}</Startboard>: null}
        
      <Obstacle
        top = {0}
        width ={OBSTACLE_WIDTH}
        height ={obstacleheight} 
        left = {obstacleleft}
        deg ={180}/>

      <Obstacle
        top = {GAME_HEIGHT - (obstacleheight + bottomobstacleheight)}
        width ={OBSTACLE_WIDTH}
        height ={bottomobstacleheight} 
        left = {obstacleleft}
        deg ={0}/>
      <Bird size={BIRD_SIZE} top = {birdposition}/>
      </GameBox>
      <span>{score}</span>
    </Div>
  );
}

export default FlappyBird;


const Bird = styled.div`
 position: absolute;
 background-image: url("./images/bird.png");
  background-repeat: no-repeat;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
 height: ${(props) => props.size}px;
 width: ${(props) => props.size}px;
 top: ${(props) => props.top}px;
 border-radius: 50%;
 `;

const Div = styled.div`
display: flex;
width: 100%;
justify-content: center;
& span{
  color: white;
  font-size: 24px;
  position: absolute;
}
`;

const GameBox = styled.div`
height: ${(props) =>props.height}px;
width: ${(props) =>props.width}px;

background-image: url("./images/img.png");
overflow: hidden;
`;

const Obstacle = styled.div`
position: relative;
background-image: url("./images/pipe-green.png");
width: ${(props) => props.width}px;
height: ${(props) => props.height}px;
left: ${(props) => props.left}px;
top: ${(props) => props.top}px;
transform: rotate(${(props) => props.deg}deg);
`;

const Startboard = styled.div`
  position: absolute;
  top: 49%;
  background-color: black;
  padding: 10px;
  width: 150px;
  left: 45%;
  margin-left: -50px;
  text-align: center;
  font-size: 20px;
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
`;
