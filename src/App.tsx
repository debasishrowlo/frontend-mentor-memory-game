import { useState } from "react"

import Menu from "./Menu"
import Game from "./Game"

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [gridSize, setGridSize] = useState(4)

  const startGame= () => setIsPlaying(true)

  return !isPlaying 
    ? <Menu 
        gridSize={gridSize}
        setGridSize={setGridSize}
        startGame={startGame}
      /> 
    : <Game gridSize={gridSize} />
}

export default App