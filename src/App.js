import { BrowserRouter, Routes, Route} from "react-router-dom";
import CandyCrush from "./Games/CandyCrush";
import FlappyBird from "./Games/FlappyBird";
import Game2048 from "./Games/Game2048";
import LandingPage from "./Games/LandingPage";
import "./App.css";
import Dashboard from "./Games/dashboard";
import TicTacToe from "./Games/tictactoe";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Dashboard/>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/candycrush" element={<CandyCrush />} />
          <Route path="/flappybird" element={<FlappyBird />} />
          <Route path="/2048" element={<Game2048 />} />
          <Route path="/tictactoe" element={<TicTacToe/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
