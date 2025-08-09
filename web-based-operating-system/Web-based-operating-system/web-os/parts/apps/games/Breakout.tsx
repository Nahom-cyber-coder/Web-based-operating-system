import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react';

interface Ball {
x: number;
y: number;
dx: number;
dy: number;
}

interface Paddle {
x: number;
width: number;
}

interface Brick {
x: number;
y: number;
width: number;
height: number;
color: string;
destroyed: boolean;
}

const Breakout: React.FC = () => {
const canvasRef = useRef<HTMLCanvasElement>(null);
const [gameRunning, setGameRunning] = useState(false);
const [gameOver, setGameOver] = useState(false);
const [score, setScore] = useState(0);
const [lives, setLives] = useState(3);
const [level, setLevel] = useState(1);
const [highScore, setHighScore] = useState(() => {
return parseInt(localStorage.getItem('breakout-high-score') || '0');
});

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PADDLE_HEIGHT = 10;
const BALL_SIZE = 10;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 5;

const [ball, setBall] = useState<Ball>({
x: CANVAS_WIDTH / 2,
y: CANVAS_HEIGHT - 30,
dx: 4,
dy: -4
});

const [paddle, setPaddle] = useState<Paddle>({
x: CANVAS_WIDTH / 2 - 50,
width: 100
});

const [bricks, setBricks] = useState<Brick[]>([]);

const initializeBricks = useCallback(() => {
const newBricks: Brick[] = [];
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

for (let row = 0; row < BRICK_ROWS; row++) {
for (let col = 0; col < BRICK_COLS; col++) {
newBricks.push({
x: col * (BRICK_WIDTH + BRICK_PADDING) + BRICK_PADDING,
y: row * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_PADDING + 50,
width: BRICK_WIDTH,
height: BRICK_HEIGHT,
color: colors[row % colors.length],
destroyed: false
});
}
}
setBricks(newBricks);
}, []);

const resetGame = useCallback(() => {
setBall({
x: CANVAS_WIDTH / 2,
y: CANVAS_HEIGHT - 30,
dx: 4 * level,
dy: -4 * level
});
setPaddle({
x: CANVAS_WIDTH / 2 - 50,
width: 100
});
setScore(0);
setLives(3);
setLevel(1);
setGameOver(false);
initializeBricks();
}, [level, initializeBricks]);

const startGame = () => {
setGameRunning(true);
resetGame();
};

const draw = useCallback(() => {
const canvas = canvasRef.current;
if (!canvas) return;

const ctx = canvas.getContext('2d');
if (!ctx) return;

ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

ctx.fillStyle = '#333';
ctx.fillRect(paddle.x, CANVAS_HEIGHT - PADDLE_HEIGHT - 10, paddle.width, PADDLE_HEIGHT);

ctx.fillStyle = '#FF6B6B';
ctx.beginPath();
ctx.arc(ball.x, ball.y, BALL_SIZE / 2, 0, Math.PI * 2);
ctx.fill();

bricks.forEach(brick => {
if (!brick.destroyed) {
ctx.fillStyle = brick.color;
ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
}
});
}, [ball, paddle, bricks]);

const updateGame = useCallback(() => {
if (!gameRunning || gameOver) return;

setBall(prevBall => {
let newBall = { ...prevBall };

newBall.x += newBall.dx;
newBall.y += newBall.dy;

if (newBall.x <= BALL_SIZE / 2 || newBall.x >= CANVAS_WIDTH - BALL_SIZE / 2) {
newBall.dx = -newBall.dx;
}

if (newBall.y <= BALL_SIZE / 2) {
newBall.dy = -newBall.dy;
}

if (newBall.y >= CANVAS_HEIGHT - PADDLE_HEIGHT - 20 - BALL_SIZE / 2 &&
newBall.x >= paddle.x && newBall.x <= paddle.x + paddle.width) {
newBall.dy = -Math.abs(newBall.dy);
const hitPos = (newBall.x - paddle.x) / paddle.width;
newBall.dx = (hitPos - 0.5) * 8;
}

if (newBall.y >= CANVAS_HEIGHT) {
setLives(prev => {
const newLives = prev - 1;
if (newLives <= 0) {
setGameOver(true);
setGameRunning(false);
if (score > highScore) {
setHighScore(score);
localStorage.setItem('breakout-high-score', score.toString());
}
} else {
newBall = {
x: CANVAS_WIDTH / 2,
y: CANVAS_HEIGHT - 30,
dx: 4 * level,
dy: -4 * level
};
}
return newLives;
});
}

setBricks(prevBricks => {
const newBricks = [...prevBricks];
let hitBrick = false;

for (let i = 0; i < newBricks.length; i++) {
const brick = newBricks[i];
if (!brick.destroyed &&
newBall.x >= brick.x && newBall.x <= brick.x + brick.width &&
newBall.y >= brick.y && newBall.y <= brick.y + brick.height) {
brick.destroyed = true;
newBall.dy = -newBall.dy;
hitBrick = true;
setScore(prev => prev + 10);
break;
}
}

const remainingBricks = newBricks.filter(brick => !brick.destroyed);
if (remainingBricks.length === 0) {
setLevel(prev => prev + 1);
setTimeout(() => {
initializeBricks();
setBall({
x: CANVAS_WIDTH / 2,
y: CANVAS_HEIGHT - 30,
dx: 4 * (level + 1),
dy: -4 * (level + 1)
});
}, 1000);
}

return newBricks;
});

return newBall;
});
}, [gameRunning, gameOver, paddle, level, score, highScore, initializeBricks]);

useEffect(() => {
const gameLoop = setInterval(() => {
updateGame();
draw();
}, 16);

return () => clearInterval(gameLoop);
}, [updateGame, draw]);

useEffect(() => {
const handleMouseMove = (e: MouseEvent) => {
if (!gameRunning) return;
const canvas = canvasRef.current;
if (!canvas) return;

const rect = canvas.getBoundingClientRect();
const mouseX = e.clientX - rect.left;
setPaddle(prev => ({
...prev,
x: Math.max(0, Math.min(CANVAS_WIDTH - prev.width, mouseX - prev.width / 2))
}));
};

const handleKeyDown = (e: KeyboardEvent) => {
if (!gameRunning) return;

if (e.key === 'ArrowLeft') {
setPaddle(prev => ({
...prev,
x: Math.max(0, prev.x - 20)
}));
} else if (e.key === 'ArrowRight') {
setPaddle(prev => ({
...prev,
x: Math.min(CANVAS_WIDTH - prev.width, prev.x + 20)
}));
}
};

window.addEventListener('mousemove', handleMouseMove);
window.addEventListener('keydown', handleKeyDown);

return () => {
window.removeEventListener('mousemove', handleMouseMove);
window.removeEventListener('keydown', handleKeyDown);
};
}, [gameRunning]);

useEffect(() => {
initializeBricks();
}, [initializeBricks]);

return (
<div className="h-full bg-gradient-to-br from-blue-900 to-purple-900 text-white flex flex-col items-center justify-center p-4">
<div className="text-center mb-4">
<h1 className="text-3xl font-bold mb-2">🧱 Breakout</h1>
<div className="flex items-center justify-center space-x-6 text-lg">
<div>Score: {score}</div>
<div>Lives: {lives}</div>
<div>Level: {level}</div>
<div className="flex items-center space-x-1">
<Trophy className="w-5 h-5 text-yellow-400" />
<span>Best: {highScore}</span>
</div>
</div>
</div>

<div className="relative">
<canvas
ref={canvasRef}
width={CANVAS_WIDTH}
height={CANVAS_HEIGHT}
className="border-2 border-white/20 rounded-lg bg-black/50"
/>

{gameOver && (
<div className="absolute inset-0 bg-black/75 flex items-center justify-center rounded-lg">
<div className="text-center">
<h2 className="text-2xl font-bold mb-2">Game Over!</h2>
<p className="text-lg mb-4">Final Score: {score}</p>
{score === highScore && score > 0 && (
<p className="text-yellow-400 mb-4">🎉 New High Score!</p>
)}
</div>
</div>
)}
</div>

<div className="mt-4 flex items-center space-x-4">
<button
onClick={gameOver ? startGame : gameRunning ? () => setGameRunning(false) : startGame}
className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
>
{gameOver ? (
<>
<RotateCcw className="w-5 h-5" />
<span>Play Again</span>
</>
) : gameRunning ? (
<>
<Pause className="w-5 h-5" />
<span>Pause</span>
</>
) : (
<>
<Play className="w-5 h-5" />
<span>Start</span>
</>
)}
</button>

<button
onClick={resetGame}
className="flex items-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
>
<RotateCcw className="w-5 h-5" />
<span>Reset</span>
</button>
</div>

<div className="mt-4 text-center text-sm opacity-75">
<p>Move your mouse or use arrow keys to control the paddle</p>
<p>Break all the bricks to advance to the next level!</p>
</div>
</div>
);
};

export default Breakout;