import React, { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 20;

type Point = { x: number; y: number };

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef(direction);
  const isGameOverRef = useRef(gameOver);
  const hasStartedRef = useRef(false);

  // Keep refs in sync for the interval closure
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { isGameOverRef.current = gameOver; }, [gameOver]);

  const foodRef = useRef(food);
  useEffect(() => { foodRef.current = food; }, [food]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on the snake
      const collision = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!collision) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    const initialFood = generateFood(INITIAL_SNAKE);
    setFood(initialFood);
    foodRef.current = initialFood;
    hasStartedRef.current = false;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && isGameOverRef.current) {
        resetGame();
        return;
      }

      if (e.key === ' ' && !isGameOverRef.current) {
        setIsPaused(p => !p);
        hasStartedRef.current = true;
        return;
      }

      hasStartedRef.current = true;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const moveSnake = () => {
      if (isGameOverRef.current || isPaused || !hasStartedRef.current) return;

      setSnake((prev) => {
        if (!prev || prev.length === 0) return prev; // Safety check
        
        const newHead = {
          x: prev[0].x + directionRef.current.x,
          y: prev[0].y + directionRef.current.y,
        };

        // Check walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prev;
        }

        // Check self collision
        if (prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];
        const currentFood = foodRef.current;

        // Check food collision
        if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
          // Schedule side effects outside of the render cycle
          setTimeout(() => {
            setScore((s) => s + 10);
            setFood(generateFood(newSnake));
          }, 0);
          // Keep the tail (snake grows)
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 120);
    return () => clearInterval(interval);
  }, [isPaused, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      <div 
        className="relative w-full aspect-square max-w-[480px] bg-black rounded-2xl border-2 border-pink-500/30 shadow-[0_0_50px_rgba(236,72,153,0.1)] overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Game Grid Simulation */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{
               backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
               backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
             }}>
        </div>

        {/* Draw food */}
        <div 
          className="bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,1)] rounded-full z-10"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            margin: '2px'
          }}
        />

        {/* Draw snake */}
        {snake.map((segment, idx) => {
          const isHead = idx === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${idx}`}
              className={`${
                isHead ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)] z-10' : 'bg-cyan-400/80 shadow-[0_0_8px_rgba(34,211,238,0.6)]'
              } rounded-sm transition-all duration-75`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
                margin: '1px',
                opacity: Math.max(0.2, 1 - (idx * 0.05))
              }}
            />
          );
        })}

        {/* Overlay HUD */}
        <div className="absolute top-4 left-4 font-mono text-pink-500 text-lg md:text-xl tracking-tighter drop-shadow-[0_0_5px_rgba(236,72,153,0.8)] z-20 pointer-events-none">
          SCORE: {score.toString().padStart(5, '0')}
        </div>
        <div className="absolute top-4 right-4 font-mono text-cyan-400 text-sm tracking-tighter z-20 pointer-events-none">
          {gameOver ? 'GAME OVER' : isPaused ? 'PAUSED' : 'MULTIPLIER: x1.5'}
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
            <h2 className="text-4xl text-pink-500 mb-2 font-bold uppercase tracking-widest drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">System Failure</h2>
            <p className="text-gray-300 font-mono mb-6 uppercase">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-pink-500 hover:bg-pink-400 text-black font-bold uppercase tracking-widest rounded shadow-[0_0_15px_rgba(236,72,153,0.8)] hover:shadow-[0_0_25px_rgba(236,72,153,1)] transition-all"
            >
              Reboot sequence
            </button>
          </div>
        )}

        {/* Start Overlay */}
        {!hasStartedRef.current && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-30">
             <h2 className="text-2xl text-cyan-400 mb-4 font-bold uppercase tracking-widest animate-pulse drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]">Press Arrow Keys</h2>
             <p className="text-gray-400 font-mono text-sm uppercase tracking-wide">Or Spacebar to pause</p>
          </div>
        )}
      </div>

       {/* Game Controls Hint */}
       <div className="mt-6 flex gap-4 text-slate-500 font-mono text-[10px] uppercase tracking-widest">
        <span><span className="px-2 py-1 border border-slate-700 rounded text-slate-300 mr-1">WASD</span>to Navigate</span>
        <span><span className="px-2 py-1 border border-slate-700 rounded text-slate-300 mr-1">SPACE</span>to Pause</span>
      </div>
    </div>
  );
}
