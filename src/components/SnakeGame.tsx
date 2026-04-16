import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const [isPaused, setIsPaused] = useState(false);
  
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Point>({ x: 5, y: 5 });
  const directionRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirectionRef = useRef<Point>({ x: 1, y: 0 });
  const speedRef = useRef(INITIAL_SPEED);
  const lastUpdateTimeRef = useRef(0);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on snake
    if (snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }
    return newFood;
  }, []);

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    foodRef.current = generateFood();
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    speedRef.current = INITIAL_SPEED;
    setGameStarted(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gameStarted && !gameOver) {
          setIsPaused(p => !p);
        } else if (!gameStarted || gameOver) {
          resetGame();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (directionRef.current.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (directionRef.current.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (directionRef.current.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, gameOver]);

  const update = useCallback((time: number) => {
    if (gameOver || !gameStarted || isPaused) return;

    if (time - lastUpdateTimeRef.current < speedRef.current) {
      requestAnimationFrame(update);
      return;
    }

    lastUpdateTimeRef.current = time;
    directionRef.current = nextDirectionRef.current;

    const head = { ...snakeRef.current[0] };
    head.x += directionRef.current.x;
    head.y += directionRef.current.y;

    // Check collisions
    if (
      head.x < 0 || head.x >= GRID_SIZE ||
      head.y < 0 || head.y >= GRID_SIZE ||
      snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
      return;
    }

    const newSnake = [head, ...snakeRef.current];

    // Check food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore(s => s + 10);
      foodRef.current = generateFood();
      speedRef.current = Math.max(50, INITIAL_SPEED - (score / 10) * SPEED_INCREMENT);
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();
    requestAnimationFrame(update);
  }, [gameOver, gameStarted, generateFood, score]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid (subtle)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ff00ff'; // Neon Pink
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      foodRef.current.x * cellSize + cellSize / 2,
      foodRef.current.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Snake
    snakeRef.current.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : '#008888'; // Neon Cyan
      ctx.shadowBlur = index === 0 ? 10 : 0;
      ctx.shadowColor = '#00ffff';
      
      const padding = 2;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
    });
    ctx.shadowBlur = 0;
  }, []);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      requestAnimationFrame(update);
    }
    draw();
  }, [gameStarted, gameOver, update, draw]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] items-center border-b-2 border-[#00ffff]/30 pb-2">
        <h2 className="text-lg font-bold text-[#00ffff] tracking-widest uppercase glitch-text" data-text="GRID_PROTOCOL_01">GRID_PROTOCOL_01</h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#ff00ff] uppercase tracking-tighter">DATA_COLLECTED:</span>
          <Badge variant="outline" className="text-[#ff00ff] border-[#ff00ff] bg-[#ff00ff]/10 rounded-none px-3 font-mono">
            {score}
          </Badge>
        </div>
      </div>

      <div className="relative">
        {/* Decorative corners */}
        <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-[#ff00ff]" />
        <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-[#ff00ff]" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-[#ff00ff]" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-[#ff00ff]" />

        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border-2 border-[#00ffff]/50 bg-black shadow-[0_0_20px_rgba(0,255,255,0.1)]"
        />
        
        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
            <button
              onClick={resetGame}
              className="px-10 py-4 bg-[#00ffff] text-black font-bold uppercase tracking-[0.2em] hover:bg-[#ff00ff] hover:text-white transition-colors relative group"
            >
              <span className="relative z-10">INITIATE_LINK</span>
              <div className="absolute inset-0 bg-white/20 translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform" />
            </button>
            <p className="mt-6 text-[#00ffff]/40 text-[10px] uppercase tracking-[0.4em] animate-pulse">Waiting for human interface...</p>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-[1px]">
            <h3 className="text-5xl font-black text-[#ff00ff] mb-2 tracking-tighter uppercase glitch-text" data-text="SIGNAL_INTERRUPT">SIGNAL_INTERRUPT</h3>
            <p className="text-[#00ffff] font-mono text-[10px] uppercase tracking-[0.5em]">Press Space to Re-sync</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md">
            <h3 className="text-5xl font-black text-[#ff00ff] mb-2 tracking-tighter uppercase glitch-text" data-text="CRITICAL_FAILURE">CRITICAL_FAILURE</h3>
            <p className="text-[#00ffff] mb-8 font-mono text-xs uppercase tracking-widest">Neural link severed. Score: {score}</p>
            <button
              onClick={resetGame}
              className="px-10 py-4 border-2 border-[#ff00ff] text-[#ff00ff] font-bold uppercase tracking-[0.2em] hover:bg-[#ff00ff] hover:text-black transition-all"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
