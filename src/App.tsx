import { useRef, useState } from "react"
import classnames from "classnames"
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

import { IconProp } from "@fortawesome/fontawesome-svg-core"

export const enum gameTypes {
  numbers = "numbers",
  icons = "icons"
}

export type IconMap = {
  [key:number]: IconProp,
}

export const shuffle = (arr:any[]) => {
  const result = [...arr]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const s = result[i] 
    result[i] = result[j]
    result[j] = s
  }

  return result
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

const generateNumberGrid = (cellCount:number) => {
  const grid = Array
    .from(Array(Math.round(cellCount / 2)).keys())
    .map(num => num + 1)

  return shuffle([...grid, ...grid])
}

const initialGridSize = 4
const initialGameType = gameTypes.numbers
const initialNumPlayers = 1

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [gridSize, setGridSize] = useState(initialGridSize)
  const [gameType, setGameType] = useState(initialGameType)
  const [numPlayers, setNumPlayers] = useState(initialNumPlayers)

  const [cell1, setCell1] = useState<number|null>(null)
  const [cell2, setCell2] = useState<number|null>(null)
  const [solved, setSolved] = useState<number[]>([])

  const [moveCount, setMoveCount] = useState(0)
  const [startTime, setStartTime] = useState(null)

  const [activePlayerIndex, setActivePlayerIndex] = useState(0)
  const [scores, setScores] = useState([])

  const cellCount = gridSize * gridSize

  const iconMapRef = useRef<IconMap>()
  const iconMap = iconMapRef.current

  const gridRef = useRef([])
  const grid = gridRef.current

  const isGameOver = grid.length === solved.length
  const isSinglePlayerGame = numPlayers === 1

  const generateGrid = () => {
    gridRef.current = generateNumberGrid(cellCount)

    if (gameType === gameTypes.icons) {
      iconMapRef.current = generateIconMap(cellCount)
    }
  }

  const initScores = () => {
    setScores(Array(numPlayers).fill(0))
  }

  const startGame = () => {
    generateGrid()

    if (!isSinglePlayerGame) {
      initScores()
    }

    setIsPlaying(true)
  }

  const newGame = () => {
    setIsPlaying(false)

    setGridSize(initialGridSize)
    setGameType(initialGameType)
    setNumPlayers(initialNumPlayers)
  }

  const restart = () => {
    generateGrid()

    setSolved([])

    if (isSinglePlayerGame) {
      setStartTime(null)
      setMoveCount(0)
    } else {
      initScores()
    }
  }

  const isHidden = (index:number) => {
    if (index === cell1 || index === cell2) {
      return false
    }

    return !solved.includes(index)
  }

  const handleCellClick = (index:number) => {
    if (!isHidden(index)) { return }

    if (isSinglePlayerGame) {
      if (startTime === null) {
        setStartTime(Date.now())
      }

      setMoveCount(moveCount + 1)
    }

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

      if (!isSinglePlayerGame) {
        setScores([
          ...scores.slice(0, activePlayerIndex),
          scores[activePlayerIndex] + 1,
          ...scores.slice(activePlayerIndex + 1),
        ])
      }
    } else {
      setTimeout(() => {
        setCell1(null)
        setCell2(null)
      }, 500)

      if (!isSinglePlayerGame) {
        const newIndex = (activePlayerIndex === numPlayers - 1) ? 0 : activePlayerIndex + 1
        setActivePlayerIndex(newIndex)
      }
    }
  }

  const padZero = (value:number):string => {
    if (value < 10) {
      return `0${value}`
    }

    return value.toString()
  }

  const getTimeElapsed = () => {
    let result = ""

    const endTime = Date.now()
    let diff = endTime - startTime

    diff /= 1000
    const seconds = Math.round(diff % 60)

    diff = Math.round(diff / 60)
    const minutes = Math.round(diff % 60)

    diff = Math.round(diff / 60)
    const hours = Math.round(diff % 24)
    
    if (hours > 0) {
      result = `${hours}:${padZero(minutes)}:${padZero(seconds)}`
    } else {
      result = `${minutes}:${padZero(seconds)}`
    }

    return result
  }

  let gameResults:Array<{
    index: number,
    score: number,
  }> = []
  if (isGameOver && !isSinglePlayerGame) {
    gameResults = scores.map((score, index) => ({ index, score, }))
    gameResults.sort((p1, p2) => p2.score - p1.score)
  }

  if (!isPlaying) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-1/2">
          <div>
            <p>Grid Size</p>
            <div className="mt-2">
              {[4, 6].map(size => (
                <button 
                  type="button" 
                  className={classnames("w-1/2 border border-black", {
                    "bg-white text-black": gridSize !== size,
                    "bg-black text-white": gridSize === size,
                  })}
                  onClick={() => setGridSize(size)}
                >
                  {size}x{size}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <p>Select Theme</p>
            <div className="mt-2">
              {[
                {
                  type: gameTypes.numbers,
                  name: "Numbers",
                },
                {
                  type: gameTypes.icons,
                  name: "Icons",
                }
              ].map(data => (
                <button 
                  type="button" 
                  className={classnames("w-1/2 border border-black", {
                    "bg-white text-black": gameType !== data.type,
                    "bg-black text-white": gameType === data.type,
                  })}
                  onClick={() => setGameType(data.type)}
                >
                  {data.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <p>Number of Players</p>
            <div className="mt-2 flex">
              {[...Array(4).keys()].map(index => {
                const num = index + 1

                return (
                  <button 
                    type="button" 
                    className={classnames("w-1/4 border", {
                      "border-transparent bg-black text-white": numPlayers === num,
                      "border-black bg-white text-black": numPlayers !== num,
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
              className="mt-6 px-4 py-2 border border-black"
              onClick={() => startGame()}
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    ) 
  }

  return (
    <>
      <div className="w-full h-screen flex flex-col">
        <div className="flex grow items-center justify-center">
          <div className="flex flex-wrap select-none" style={{ width: "500px" }}>
            {grid.map((num, index) => {
              const hidden = isHidden(index)

              const symbol = (gameType === gameTypes.numbers)
                ? num
                : <FontAwesomeIcon icon={iconMap[num]} className="text-40" />

              return (
                <button
                  key={index}
                  style={{ width: `${100/gridSize}%` }}
                  className="relative aspect-square border border-black text-24 font-bold text-black rounded-full overflow-hidden"
                  onClick={() => handleCellClick(index)}
                >
                  {hidden && (
                    <div className="absolute inset-0 bg-black/20"></div>
                  )}
                  {/* {!hidden && <>{symbol}</>} */}
                  {true && <>{symbol}</>}
                </button>
              )
            })}
          </div>
        </div>
        {!isSinglePlayerGame && (
          <div className="w-full max-w-screen-md mx-auto pb-6 flex justify-center">
            {scores.map((score, index) => {
              const active = index === activePlayerIndex

              return (
                <div 
                  key={index}
                  className={classnames("w-1/4 px-4 py-2 flex justify-between border border-black", {
                    "bg-black text-white": active,
                  })}
                >
                  <p>Player {index + 1}</p>
                  <p className="font-bold">{score}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
      {isGameOver && (
        <Dialog open={isGameOver} onClose={() => {}}>
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-25"></div>
            <Dialog.Panel className="p-4 relative z-10 bg-white">
              <>
                {isSinglePlayerGame ? (
                  <>
                    <p className="text-center">You did it!</p>
                    <p className="text-center">Moves Taken: {moveCount}</p>
                    <p className="text-center">Time elapsed: {getTimeElapsed()}</p>
                    <button type="button" onClick={() => restart()}>Restart</button>
                  </>
                ) : (
                  <>
                    <p>Player {gameResults[0].index + 1} Wins!</p>
                    <p className="text-center">Game over! Here are the results...</p>
                    {gameResults.map((player, index) => (
                      <div className="flex justify-between" key={index}>
                        <p>
                          Player {player.index + 1}
                          {(index === 0) && (
                            <span className="ml-1">(Winner!)</span>
                          )}
                        </p>
                        <p>{player.score} Pairs</p>
                      </div>
                    ))}
                    <button type="button" onClick={() => restart()}>Restart</button>
                  </>
                )}
              </>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </>
  )
}

export default App