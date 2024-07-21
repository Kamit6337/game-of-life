import { useState, useCallback, useRef, useEffect } from "react";

const numRows = 30;
const numCols = 30;

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const GameOfLife = () => {
  const [grid, setGrid] = useState(generateEmptyGrid());
  const [running, setRunning] = useState(false);
  const [timer, setTimer] = useState(100);
  const differ = 100;

  const runningRef = useRef(running);
  runningRef.current = running;

  const timerRef = useRef(timer);
  timerRef.current = timer;

  const increaseTimer = () => {
    setTimer((prev) => (prev + differ > 1000 ? prev : prev + differ));
  };

  const decreaseTimer = () => {
    setTimer((prev) => (prev - differ < 100 ? prev : prev - differ));
  };

  useEffect(() => {
    timerRef.current = timer;
  }, [timer]);

  // Function to calculate the next state
  const calculateNextState = useCallback((grid: number[][]) => {
    const newGrid = grid.map((arr) => [...arr]);
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        let neighbors = 0;
        const directions = [
          [0, 1],
          [0, -1],
          [1, 0],
          [-1, 0],
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ];

        directions.forEach(([x, y]) => {
          const newI = i + x;
          const newJ = j + y;
          if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
            neighbors += grid[newI][newJ];
          }
        });

        if (grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
          newGrid[i][j] = 0;
        } else if (grid[i][j] === 0 && neighbors === 3) {
          newGrid[i][j] = 1;
        }
      }
    }
    return newGrid;
  }, []);

  // Function to handle the running state
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return calculateNextState(g);
    });

    setTimeout(runSimulation, timerRef.current);
  }, [calculateNextState]);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Conway's Game of Life</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((_, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = grid.map((arr) => [...arr]);
                newGrid[i][k] = grid[i][k] ? 0 : 1;
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "black" : undefined,
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button
          onClick={() => {
            const newGrid = generateEmptyGrid();
            for (let i = 0; i < numRows; i++) {
              for (let j = 0; j < numCols; j++) {
                if (Math.random() > 0.7) {
                  newGrid[i][j] = 1;
                }
              }
            }
            setGrid(newGrid);
          }}
        >
          Random
        </button>
        <button onClick={() => setGrid(generateEmptyGrid())}>Clear</button>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <p>Timer</p>
          <div style={{ display: "flex" }}>
            <button style={{ fontSize: "20px" }} onClick={decreaseTimer}>
              -
            </button>
            <button style={{ fontSize: "20px" }} onClick={increaseTimer}>
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOfLife;
