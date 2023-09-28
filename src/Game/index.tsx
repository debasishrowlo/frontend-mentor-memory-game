import { useRef, useState } from "react"
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

import SinglePlayerGame from "./SinglePlayerGame"
import MultiPlayerGame from "./MultiPlayerGame"

import { IconProp } from "@fortawesome/fontawesome-svg-core"

import { GameSettings, gameTypes } from '@/App'

export type IconMap = {
  [key:number]: IconProp,
}

export const enum actionTypes {
  cellClick = "cellClick",
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

const generateNumberGrid = (cellCount:number) => {
  const grid = Array
    .from(Array(Math.round(cellCount / 2)).keys())
    .map(num => num + 1)

  return shuffle([...grid, ...grid])
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
  gameSettings,
} : {
  gameSettings: GameSettings,
}) => {
  const cellCount = gameSettings.gridSize * gameSettings.gridSize

  const iconMapRef = useRef<IconMap>(generateIconMap(cellCount))
  const iconMap = iconMapRef.current

  const gridRef = useRef(generateNumberGrid(cellCount))
  const grid = gridRef.current

  const [cell1, setCell1] = useState<number|null>(null)
  const [cell2, setCell2] = useState<number|null>(null)
  const [solved, setSolved] = useState<number[]>([])

  const isGameOver = grid.length === solved.length

  const isHidden = (index:number) => {
    if (index === cell1 || index === cell2) {
      return false
    }

    return !solved.includes(index)
  }

  const handleCellClick = (index:number, dispatch:Function) => {
    if (!isHidden(index)) { return }

    dispatch(actionTypes.cellClick)

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

  const restart = () => {
    gridRef.current = generateNumberGrid(cellCount)
    if (gameSettings.gameType === gameTypes.icons) {
      iconMapRef.current = generateIconMap(cellCount)
    }

    setSolved([])
  }

  if (gameSettings.numPlayers === 1) {
    return (
      <SinglePlayerGame 
        gameSettings={gameSettings}
        grid={grid}
        iconMap={iconMap}
        isGameOver={isGameOver}
        isHidden={isHidden}
        handleCellClick={handleCellClick}
        restart={restart}
      />
    )
  }

  return (
    <MultiPlayerGame 
      gameSettings={gameSettings}
      grid={grid}
      iconMap={iconMap}
      isGameOver={isGameOver}
      isHidden={isHidden}
      handleCellClick={handleCellClick}
      restart={restart}
    />
  )
}

export default Game