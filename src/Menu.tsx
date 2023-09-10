import classnames from "classnames"

const Menu = ({
  gridSize,
  setGridSize,
  startGame,
} : {
  gridSize: number,
  setGridSize: Function,
  startGame: Function,
}) => {
  return (
    <div className="h-screen flex items-center justify-center">
      <div>
        <p>Grid Size</p>
        <div>
          <button 
            type="button" 
            className={classnames("w-1/2 border border-black", {
              "bg-white text-black": gridSize !== 4,
              "bg-black text-white": gridSize === 4,
            })}
            onClick={() => setGridSize(4)}
          >
            4x4
          </button>
          <button 
            type="button" 
            className={classnames("w-1/2 border border-black", {
              "bg-white text-black": gridSize !== 6,
              "bg-black text-white": gridSize === 6,
            })}
            onClick={() => setGridSize(6)}
          >
            6x6
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