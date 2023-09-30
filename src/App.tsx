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

import Logo from "./Logo"

import { IconProp } from "@fortawesome/fontawesome-svg-core"

export const enum gameTypes {
  numbers = "numbers",
  icons = "icons"
}

const enum resultTypes {
  win = "win",
  tie = "tie",
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

  const isGameOver = grid.length > 1 && (grid.length === solved.length)
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

  let gameResults:{
    resultType: resultTypes,
    maxScore: number,
    players: Array<{
      index: number,
      score: number,
    }>
  } = {
    resultType: resultTypes.win,
    maxScore: 0,
    players: [],
  }
  if (isGameOver && !isSinglePlayerGame) {
    gameResults.players = scores.map((score, index) => ({ index, score, }))
    gameResults.players.sort((p1, p2) => p2.score - p1.score)

    const maxScore = gameResults.players[0].score
    gameResults.maxScore = maxScore

    const playersWithMaxScore = gameResults.players.filter(player => player.score === maxScore)
    if (playersWithMaxScore.length > 1) {
      gameResults.resultType = resultTypes.tie
    } else {
      gameResults.resultType = resultTypes.win
    }
  }

  if (!isPlaying) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-700">
        <div className="px-6 w-full max-w-screen-sm">
          <div className="flex justify-center">
            <Logo className="md:w-auto fill-gray-100" />
          </div>
          <div className="mt-12 md:mt-20 p-6 md:p-14 bg-gray-100 rounded-[20px]">
            <div>
              <p className="text-16 md:text-20 font-bold text-gray-500">Select Theme</p>
              <div className="mt-2 flex space-x-3 md:space-x-7">
                {[
                  {
                    type: gameTypes.numbers,
                    name: "Numbers",
                  },
                  {
                    type: gameTypes.icons,
                    name: "Icons",
                  }
                ].map((data, index) => (
                  <button 
                    type="button" 
                    className={classnames("w-1/2 py-2.5 text-16 md:text-26 font-bold text-gray-100 rounded-full transition-colors duration-200", {
                      "bg-gray-300 hover:bg-gray-400": gameType !== data.type,
                      "bg-gray-600": gameType === data.type,
                    })}
                    onClick={() => setGameType(data.type)}
                    key={index}
                  >
                    {data.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-6">
              <p className="text-16 md:text-20 font-bold text-gray-500">Number of Players</p>
              <div className="mt-2 flex space-x-3 md:space-x-5">
                {[...Array(4).keys()].map(index => {
                  const num = index + 1

                  return (
                    <button 
                      type="button" 
                      className={classnames("w-1/2 py-2.5 text-16 md:text-26 font-bold text-gray-100 rounded-full transition-colors duration-200", {
                        "bg-gray-300 hover:bg-gray-400": numPlayers !== num,
                        "bg-gray-600": numPlayers === num,
                      })}
                      onClick={() => setNumPlayers(num)}
                      key={index}
                    >
                      {num}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="mt-6">
              <p className="text-16 md:text-20 font-bold text-gray-500">Grid Size</p>
              <div className="mt-2 flex space-x-3 md:space-x-7">
                {[4, 6].map((size, index) => (
                  <button 
                    type="button" 
                    className={classnames("w-1/2 py-2.5 text-16 md:text-26 font-bold text-gray-100 rounded-full transition-colors duration-200", {
                      "bg-gray-300 hover:bg-gray-400": gridSize !== size,
                      "bg-gray-600": gridSize === size,
                    })}
                    onClick={() => setGridSize(size)}
                    key={index}
                  >
                    {size}x{size}
                  </button>
                ))}
              </div>
            </div>
            <button 
              type="button"
              className="w-full mt-8 py-4 bg-orange-200 hover:bg-orange-100 text-18 md:text-32 font-bold text-gray-100 rounded-full transition-colors duration-200"
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
                    <div className="absolute inset-0 bg-black"></div>
                  )}
                  {!hidden && <>{symbol}</>}
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
                    {(gameResults.resultType === resultTypes.win) ? (
                      <p>Player {gameResults.players[0].index + 1} Wins!</p>
                    ) : (
                      <p>It's a tie!</p>
                    )}
                    <p className="text-center">Game over! Here are the results...</p>
                    {gameResults.players.map((player, index) => (
                      <div className="flex justify-between" key={index}>
                        <p>
                          Player {player.index + 1}
                          {(player.score === gameResults.maxScore) && (
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