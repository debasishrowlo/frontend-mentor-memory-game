import { useRef, useState } from "react"
import classnames from "classnames"
import { Dialog } from "@headlessui/react"

const elapsed = (startTime:number, endTime:number) => {
  let result = ""

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

const generateGrid = (size:number) => {
  let grid = Array.from(Array(size / 2).keys()).map(num => num + 1)
  grid = [...grid, ...grid]

  for (let i = grid.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const s = grid[i] 
    grid[i] = grid[j]
    grid[j] = s
  }

  return grid
}

const Home = () => {
  const gridRef = useRef(generateGrid(16))
  const grid = gridRef.current
  const cellsPerRow = 4
  const [cell1, setCell1] = useState<number|null>(null)
  const [cell2, setCell2] = useState<number|null>(null)
  const [solved, setSolved] = useState<number[]>([])
  const [moveCount, setMoveCount] = useState(0)
  const [startTime, setStartTime] = useState(null)

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
    return elapsed(startTime, Date.now())
  }

  const restart = () => {
    setStartTime(Date.now())
    setSolved([])
  }

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-wrap" style={{ width: "350px" }}>
          {grid.map((num, index) => {
            const hidden = isHidden(index)

            return (
              <button 
                key={index} 
                style={{ width: `${100/cellsPerRow}%` }}
                className={classnames("aspect-square border border-black text-24 font-bold text-black rounded-full", {
                  "bg-black": hidden,
                })}
                onClick={() => handleCellClick(index)}
              >
                {num}
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

export default Home