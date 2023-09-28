import { gameTypes, GameSettings } from "./App"

import classnames from "classnames"

const Menu = ({
  gameSettings,
  setGameSettings,
  startGame,
} : {
  gameSettings: GameSettings,
  setGameSettings: Function,
  startGame: Function,
}) => {
  const setGridSize = (gridSize:number) => {
    setGameSettings({ ...gameSettings, gridSize })
  }

  const setGameType = (gameType:gameTypes) => {
    setGameSettings({ ...gameSettings, gameType })
  }

  const setNumPlayers = (numPlayers:number) => {
    setGameSettings({ ...gameSettings, numPlayers })
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-1/2">
        <div>
          <p>Grid Size</p>
          <div className="mt-2">
            <button 
              type="button" 
              className={classnames("w-1/2 border border-black", {
                "bg-white text-black": gameSettings.gridSize !== 4,
                "bg-black text-white": gameSettings.gridSize === 4,
              })}
              onClick={() => setGridSize(4)}
            >
              4x4
            </button>
            <button
              type="button" 
              className={classnames("w-1/2 border border-black", {
                "bg-white text-black": gameSettings.gridSize !== 6,
                "bg-black text-white": gameSettings.gridSize === 6,
              })}
              onClick={() => setGridSize(6)}
            >
              6x6
            </button>
          </div>
        </div>
        <div className="mt-4">
          <p>Select Theme</p>
          <div className="mt-2">
            <button 
              type="button" 
              className={classnames("w-1/2 border border-black", {
                "bg-white text-black": gameSettings.gameType !== gameTypes.numbers,
                "bg-black text-white": gameSettings.gameType === gameTypes.numbers,
              })}
              onClick={() => setGameType(gameTypes.numbers)}
            >
              Numbers
            </button>
            <button
              type="button" 
              className={classnames("w-1/2 border border-black", {
                "bg-white text-black": gameSettings.gameType !== gameTypes.icons,
                "bg-black text-white": gameSettings.gameType === gameTypes.icons,
              })}
              onClick={() => setGameType(gameTypes.icons)}
            >
              Icons
            </button>
          </div>
        </div>
        <div className="mt-4">
          <p>Number of Players</p>
          <div className="mt-2 flex">
            {[...Array(4).keys()].map(index => {
              const num = index + 1
              const isSelected = gameSettings.numPlayers === num

              return (
                <button 
                  type="button" 
                  className={classnames("w-1/4 border", {
                    "border-transparent bg-black text-white": isSelected,
                    "border-black bg-white text-black": !isSelected,
                  })}
                  onClick={() => setNumPlayers(num)}
                >
                  {num}
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex justify-center">
          <button 
            type="button"
            className="mt-6"
            onClick={() => startGame()}
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  )
}

export default Menu