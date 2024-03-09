import './App.css';
import {BrowserRouter , Routes , Route} from "react-router-dom"
import CandyCrush from './Games/CandyCrush';
import FlappyBird from './Games/FlappyBird';
import Game2048 from './Games/Game2048';
import LandingPage from './Games/LandingPage';

function App() {
  return (
    <div className="App">
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/candycrush" element={<CandyCrush/>} />
      <Route path="/flappybird" element={<FlappyBird/>} />
      <Route path="/2048" element={<Game2048/>} />
     </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
