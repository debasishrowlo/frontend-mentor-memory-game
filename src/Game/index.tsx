import { useRef, useState } from "react"
import { Dialog } from "@headlessui/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faAnchor, 
  faBomb,
  faBug,
  faCar,
  faCloud,
  faCompass,
  faFire,
  faFlask, 
  faFutbol, 
  faGhost,
  faHandSpock,
  faMoon,
  faRocket,
  faSnowflake,
  faSun,
  faTurkishLiraSign,
  faUmbrella,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons'

import { gameTypes } from '@/App'
import { IconProp } from "@fortawesome/fontawesome-svg-core"

const shuffle = (arr:any[]) => {
  const result = [...arr]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const s = result[i] 
    result[i] = result[j]
    result[j] = s
  }

  return result
}

const generateNumberGrid = (cellCount:number) => {
  const grid = Array
    .from(Array(Math.round(cellCount / 2)).keys())
    .map(num => num + 1)

  return shuffle([...grid, ...grid])
}

type IconMap = {
  [key:number]: IconProp,
}

const generateIconMap = (cellCount:number) => {
  const iconMap:IconMap = {}

  const icons = shuffle([
    faAnchor, 
    faBomb,
    faBug,
    faCar,
    faCloud,
    faCompass,
    faFire,
    faFlask, 
    faFutbol, 
    faGhost,
    faHandSpock,
    faMoon,
    faRocket,
    faSnowflake,
    faSun,
    faTurkishLiraSign,
    faUmbrella,
    faWandMagicSparkles,
  ])

  for (let i = 0; i < (cellCount / 2); i++) {
    iconMap[i + 1] = icons[i]
  }

  return iconMap
}

const Game = ({
  gridSize,
  gameType,
} : {
  gridSize: number
  gameType: gameTypes,
}) => {
  const cellCount = gridSize * gridSize

  const gridRef = useRef(generateNumberGrid(cellCount))
  const grid = gridRef.current

  const iconMapRef = useRef<IconMap>(generateIconMap(cellCount))
  const iconMap = iconMapRef.current

  const [cell1, setCell1] = useState<number|null>(null)
  const [cell2, setCell2] = useState<number|null>(null)
  const [solved, setSolved] = useState<number[]>([])
  const [moveCount, setMoveCount] = useState(0)
  const [startTime, setStartTime] = useState(null)

  const cellsPerRow = gridSize

  const isGameOver = grid.length === solved.length

  const isHidden = (index:number) => {
    if (index === cell1 || index === cell2) {
      return false
    }

    return !solved.includes(index)
  }

  const handleCellClick = (index:number) => {
    if (!isHidden(index)) { return }

    if (startTime === null) {
      setStartTime(Date.now())
    }

    setMoveCount(moveCount + 1)

    if (cell1 === null) {
      setCell1(index)
      return
    }

    const cell2Value = index
    setCell2(cell2Value)

    if (grid[cell1] === grid[cell2Value]) {
      setSolved([
        ...solved,
        cell1,
        cell2Value,
      ])
      setCell1(null)
      setCell2(null)
    } else {
      setTimeout(() => {
        setCell1(null)
        setCell2(null)
      }, 500)
    }
  }

  const getTimeElapsed = () => {
    let result = ""

    const endTime = Date.now()
    const timeInMs = endTime - startTime

    let diff = timeInMs / 1000
    let seconds = Math.round(diff % 60)
    let secondsText = seconds.toString()
    if (seconds < 10) { secondsText = `0${seconds}` }

    diff = Math.round(diff / 60)
    const minutes = Math.round(diff % 60)

    diff = Math.round(diff / 60)
    result = `${minutes}:${secondsText}`

    const hours = Math.round(diff % 24)
    if (hours > 0) {
      let minutesText = minutes.toString()
      if (minutes < 10) { minutesText = `0${minutes}` }

      result = `${hours}:${minutesText}:${secondsText}`
    }

    return result
  }

  const restart = () => {
    gridRef.current = generateNumberGrid(cellCount)
    if (gameType === gameTypes.icons) {
      iconMapRef.current = generateIconMap(cellCount)
    }

    setStartTime(Date.now())
    setSolved([])
  }

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
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
                  <div className="absolute inset-0 bg-black"></div>
                )}
                {!hidden && <>{symbol}</>}
              </button>
            )
          })}
        </div>
      </div>
      <Dialog open={isGameOver} onClose={() => {}}>
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-25"></div>
          <Dialog.Panel className="p-4 relative z-10 bg-white">
            <div>
              <p className="text-center">You did it!</p>
              <p className="text-center">Moves Taken: {moveCount}</p>
              <p className="text-center">Time elapsed: {getTimeElapsed()}</p>
              <button type="button" onClick={restart}>Restart</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

export default Game