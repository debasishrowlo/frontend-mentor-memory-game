import { useState } from "react"

import Menu from "./Menu"
import Game from "./Game"

export const enum gameTypes {
  numbers = "numbers",
  icons = "icons"
}

export type GameSettings = {
  gridSize: number,
  gameType: gameTypes,
  numPlayers: number,
}

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    gridSize: 4,
    gameType: gameTypes.numbers,
    numPlayers: 1,
  })

  const startGame = () => setIsPlaying(true)

  return !isPlaying 
    ? (
      <Menu
        startGame={startGame}
        gameSettings={gameSettings}
        setGameSettings={setGameSettings}
      /> 
    ) : (
      <Game gameSettings={gameSettings} />
    )
}

export default App