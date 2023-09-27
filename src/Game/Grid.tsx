import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { gameTypes } from '@/App'
import { IconMap } from "./SinglePlayerGame"

const Grid = ({
  grid,
  gridSize,
  gameType,
  iconMap,
  isHidden,
  handleCellClick,
} : {
  grid: number[],
  gridSize: number,
  gameType: gameTypes,
  iconMap: IconMap,
  isHidden: Function,
  handleCellClick: Function,
}) => {
  const cellsPerRow = gridSize

  return (
    <div className="flex flex-wrap select-none" style={{ width: "500px" }}>
      {grid.map((num, index) => {
        const hidden = isHidden(index)

        const symbol = (gameType === gameTypes.numbers)
          ? num
          : <FontAwesomeIcon icon={iconMap[num]} className="text-40" />

        return (
          <button
            key={index}
            style={{ width: `${100/cellsPerRow}%` }}
            className="relative aspect-square border border-black text-24 font-bold text-black rounded-full overflow-hidden"
            onClick={() => handleCellClick(index)}
          >
            {hidden && (
              <div className="absolute inset-0 bg-black/20"></div>
            )}
            {!hidden && <>{symbol}</>}
          </button>
        )
      })}
    </div>
  )
}

export default Grid