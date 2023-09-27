import SinglePlayerGame from "./SinglePlayerGame"

import { gameTypes } from '@/App'

const Game = ({
  gridSize,
  gameType,
} : {
  gridSize: number,
  gameType: gameTypes,
}) => {
  return (
    <SinglePlayerGame 
      gridSize={gridSize}
      gameType={gameType}
    />
  )
}

export default Game