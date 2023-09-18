import { gameTypes, Config } from "./App"

import classnames from "classnames"

const Menu = ({
  config,
  setConfig,
  startGame,
} : {
  config: Config,
  setConfig: Function,
  startGame: Function,
}) => {
  const setGridSize = (gridSize:number) => {
    setConfig({ ...config, gridSize })
  }

  const setGameType = (gameType:gameTypes) => {
    setConfig({ ...config, gameType })
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-1/2">
        <p>Grid Size</p>
        <div>
          <button 
            type="button" 
            className={classnames("w-1/2 border border-black", {
              "bg-white text-black": config.gridSize !== 4,
              "bg-black text-white": config.gridSize === 4,
            })}
            onClick={() => setGridSize(4)}
          >
            4x4
          </button>
          <button
            type="button" 
            className={classnames("w-1/2 border border-black", {
              "bg-white text-black": config.gridSize !== 6,
              "bg-black text-white": config.gridSize === 6,
            })}
            onClick={() => setGridSize(6)}
          >
            6x6
          </button>
        </div>
        <div>
          <button 
            type="button" 
            className={classnames("w-1/2 border border-black", {
              "bg-white text-black": config.gameType !== gameTypes.numbers,
              "bg-black text-white": config.gameType === gameTypes.numbers,
            })}
            onClick={() => setGameType(gameTypes.numbers)}
          >
            Numbers
          </button>
          <button
            type="button" 
            className={classnames("w-1/2 border border-black", {
              "bg-white text-black": config.gameType !== gameTypes.icons,
              "bg-black text-white": config.gameType === gameTypes.icons,
            })}
            onClick={() => setGameType(gameTypes.icons)}
          >
            Icons
          </button>
        </div>
        <button 
          type="button"
          onClick={() => startGame()}
        >
          Start Game
        </button>
      </div>
    </div>
  )
}

export default Menu