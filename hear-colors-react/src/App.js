import "./App.css";
import Header from "./components/Header";
import ColorPlayer from "./components/ColorPlayer";
import AnimatedCursor from "react-animated-cursor";

function App() {
  return (
    <div className="App">
      <AnimatedCursor color="255,255,255" showSystemCursor={false} />
      <Header></Header>
      <ColorPlayer></ColorPlayer>
    </div>
  );
}

export default App;
