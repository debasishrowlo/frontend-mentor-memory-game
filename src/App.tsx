import { useState } from "react"

import Menu from "./Menu"
import Game from "./Game"

export const enum gameTypes {
  numbers = "numbers",
  icons = "icons"
}

export type Config = {
  gridSize: number,
  gameType: gameTypes,
}

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [config, setConfig] = useState<Config>({
    gridSize: 4,
    gameType: gameTypes.numbers,
  })

  const startGame= () => setIsPlaying(true)

  return !isPlaying 
    ? (
      <Menu
        startGame={startGame}
        config={config}
        setConfig={setConfig}
      /> 
    ) : (
      <Game 
        gridSize={config.gridSize}
        gameType={config.gameType}
      />
    )
}

export default App