import { useState } from "react"

import Menu from "./Menu"
import Game from "./Game"

export const enum gameTypes {
  numbers = "numbers",
  icons = "icons"
}

const App = () => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [gridSize, setGridSize] = useState(4)

  const startGame= () => setIsPlaying(true)

  return !isPlaying 
    ? <Menu
        gridSize={gridSize}
        setGridSize={setGridSize}
        startGame={startGame}
      /> 
    : <Game 
        gridSize={gridSize}
        gameType={gameTypes.icons}
      />
}

export default App