import { useState } from "react"
import { Dialog } from "@headlessui/react"

import Grid from "./Grid"

import { GameSettings } from '@/App'
import { actionTypes, IconMap } from './index'

const SinglePlayerGame = ({
  gameSettings,
  grid,
  iconMap,
  isHidden,
  handleCellClick: handleCellClickProp,
  isGameOver,
  restart: restartProp,
} : {
  gameSettings: GameSettings,
  grid: number[],
  iconMap: IconMap,
  isGameOver: boolean,
  isHidden: Function,
  handleCellClick: Function,
  restart: Function,
}) => {
  const [moveCount, setMoveCount] = useState(0)
  const [startTime, setStartTime] = useState(null)

  const reducer = (action:actionTypes) => {
    if (action === actionTypes.cellClick) {
      if (startTime === null) {
        setStartTime(Date.now())
      }

      setMoveCount(moveCount + 1)
    }
  }

  const restart = () => {
    setStartTime(Date.now())
    setMoveCount(0)
    restartProp()
  }

  const handleCellClick = (index:number) => {
    handleCellClickProp(index, reducer)
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

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <Grid
          grid={grid}
          gameSettings={gameSettings}
          iconMap={iconMap}
          isHidden={isHidden}
          handleCellClick={handleCellClick}
        />
      </div>
      <Dialog open={isGameOver} onClose={() => {}}>
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-25"></div>
          <Dialog.Panel className="p-4 relative z-10 bg-white">
            <div>
              <p className="text-center">You did it!</p>
              <p className="text-center">Moves Taken: {moveCount}</p>
              <p className="text-center">Time elapsed: {getTimeElapsed()}</p>
              <button type="button" onClick={() => restart()}>Restart</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

export default SinglePlayerGame