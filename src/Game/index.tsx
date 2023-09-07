import { useRef, useState } from "react"
import classnames from "classnames"
import { Dialog } from "@headlessui/react"

const Home = () => {
  const grid = [
    1, 6, 2, 5,
    8, 3, 4, 7,
    5, 2, 1, 6,
    7, 4, 8, 3,
  ]
  const cellsPerRow = 4
  const [cell1, setCell1] = useState<number|null>(null)
  const [cell2, setCell2] = useState<number|null>(null)
  const [solved, setSolved] = useState<number[]>([])
  const [moveCount, setMoveCount] = useState(0)
  const startTime = useRef(Date.now())

  const isGameOver = grid.length === solved.length

  const isHidden = (index:number) => {
    if (index === cell1 || index === cell2) {
      return false
    }

    return !solved.includes(index)
  }

  const handleCellClick = (index:number) => {
    if (!isHidden(index)) { return }

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
    return (((Date.now() - startTime.current) / 1000) / 60).toFixed(2)
  }

  const restart = () => {
    startTime.current = Date.now()
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
              <p className="text-center">Game Over</p>
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