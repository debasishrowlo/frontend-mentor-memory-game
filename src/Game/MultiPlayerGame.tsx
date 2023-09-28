import { GameSettings } from '@/App'

import Grid from "./Grid"

import { IconMap } from './index'

const MultiPlayerGame = ({
  gameSettings,
  grid,
  iconMap,
  isHidden,
  handleCellClick,
  isGameOver,
  restart,
} : {
  gameSettings: GameSettings,
  grid: number[],
  iconMap: IconMap,
  isGameOver: boolean,
  isHidden: Function,
  handleCellClick: Function,
  restart: Function,
}) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Grid
        grid={grid}
        gameSettings={gameSettings}
        iconMap={iconMap}
        isHidden={isHidden}
        handleCellClick={handleCellClick}
      />
    </div>
  )
}

export default MultiPlayerGame