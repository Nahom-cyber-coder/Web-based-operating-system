import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WifiOff as WifiOffIcon, RotateCcw, Trophy } from 'lucide-react';

interface Obstacle {
x: number;
width: number;
height: number;
}

const WifiOff: React.FC = () => {
const [isJumping, setIsJumping] = useState(false);
const [isGameRunning, setIsGameRunning] = useState(false);
const [gameOver, setGameOver] = useState(false);
const [score, setScore] = useState(0);
const [highScore, setHighScore] = useState(() => {
return parseInt(localStorage.getItem('wifi-off-high-score') || '0');
});
const [obstacles, setObstacles] = useState<Obstacle[]>([]);
const [dinoY, setDinoY] = useState(0);
const [gameSpeed, setGameSpeed] = useState(5);

const gameLoopRef = useRef<number>();
const obstacleSpawnRef = useRef<number>();

const DINO_HEIGHT = 60;
const GROUND_HEIGHT = 100;
const JUMP_HEIGHT = 120;
const GAME_WIDTH = 800;

const startGame = useCallback(() => {
setIsGameRunning(true);
setGameOver(false);
setScore(0);
setObstacles([]);
setDinoY(0);
setGameSpeed(5);
}, []);

const endGame = useCallback(() => {
setIsGameRunning(false);
setGameOver(true);

if (score > highScore) {
setHighScore(score);
localStorage.setItem('wifi-off-high-score', score.toString());
}

if (gameLoopRef.current) {
cancelAnimationFrame(gameLoopRef.current);
}
if (obstacleSpawnRef.current) {
clearInterval(obstacleSpawnRef.current);
}
}, [score, highScore]);

const jump = useCallback(() => {
if (!isJumping && isGameRunning && !gameOver) {
setIsJumping(true);
setDinoY(JUMP_HEIGHT);

setTimeout(() => {
setDinoY(0);
setTimeout(() => {
setIsJumping(false);
}, 100);
}, 300);
}
}, [isJumping, isGameRunning, gameOver]);

const checkCollision = useCallback((currentObstacles: Obstacle[], currentDinoY: number) => {
const dinoLeft = 100;
const dinoRight = dinoLeft + 50;
const dinoTop = GROUND_HEIGHT - DINO_HEIGHT - currentDinoY;
const dinoBottom = GROUND_HEIGHT - currentDinoY;

return currentObstacles.some(obstacle => {
const obstacleLeft = obstacle.x;
const obstacleRight = obstacle.x + obstacle.width;
const obstacleTop = GROUND_HEIGHT - obstacle.height;
const obstacleBottom = GROUND_HEIGHT;

return (
dinoRight > obstacleLeft &&
dinoLeft < obstacleRight &&
dinoBottom > obstacleTop &&
dinoTop < obstacleBottom
);
});
}, []);

const gameLoop = useCallback(() => {
if (!isGameRunning || gameOver) return;

let currentObstacles: Obstacle[] = [];
let currentDinoY = dinoY;

setObstacles(prev => {
currentObstacles = prev
.map(obstacle => ({ ...obstacle, x: obstacle.x - gameSpeed }))
.filter(obstacle => obstacle.x + obstacle.width > 0);

return currentObstacles;
});

setScore(prev => prev + 1);

setGameSpeed(prev => Math.min(prev + 0.001, 12));

if (checkCollision(currentObstacles, currentDinoY)) {
endGame();
return;
}

gameLoopRef.current = requestAnimationFrame(gameLoop);
}, [isGameRunning, gameOver, gameSpeed, dinoY, checkCollision, endGame]);

const spawnObstacle = useCallback(() => {
if (!isGameRunning || gameOver) return;

const obstacleTypes = [
{ width: 20, height: 40 },
{ width: 30, height: 60 },
{ width: 40, height: 50 },
];

const randomType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

setObstacles(prev => [...prev, {
x: GAME_WIDTH,
width: randomType.width,
height: randomType.height
}]);
}, [isGameRunning, gameOver]);

useEffect(() => {
if (isGameRunning && !gameOver) {
gameLoopRef.current = requestAnimationFrame(gameLoop);

obstacleSpawnRef.current = setInterval(() => {
spawnObstacle();
}, 1500 + Math.random() * 1000);
}

return () => {
if (gameLoopRef.current) {
cancelAnimationFrame(gameLoopRef.current);
}
if (obstacleSpawnRef.current) {
clearInterval(obstacleSpawnRef.current);
}
};
}, [isGameRunning, gameOver, gameLoop, spawnObstacle]);

useEffect(() => {
const handleKeyPress = (e: KeyboardEvent) => {
if (e.code === 'Space' || e.code === 'ArrowUp') {
e.preventDefault();
if (gameOver) {
startGame();
} else {
jump();
}
}
};

const handleClick = (e: MouseEvent) => {
const target = e.target as HTMLElement;
if (!target.closest('.game-area')) return;

if (gameOver) {
startGame();
} else {
jump();
}
};

window.addEventListener('keydown', handleKeyPress);
document.addEventListener('click', handleClick);

return () => {
window.removeEventListener('keydown', handleKeyPress);
document.removeEventListener('click', handleClick);
};
}, [jump, gameOver, startGame]);

return (
<div className="h-full bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-8">
<div className="text-center mb-8">
<WifiOffIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">No Internet Connection</h1>
<p className="text-gray-600 dark:text-gray-400 mb-4">
Check your WiFi connection and try again
</p>
<p className="text-sm text-gray-500 dark:text-gray-500">
While you wait, play this game!
</p>
</div>

<div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-4xl">
<div className="flex items-center justify-between mb-4">
<h2 className="text-xl font-bold text-gray-900 dark:text-white">🦕 Offline Game</h2>
<div className="flex items-center space-x-4 text-sm">
<div className="flex items-center space-x-2">
<span className="text-gray-600 dark:text-gray-400">Score:</span>
<span className="font-bold text-gray-900 dark:text-white">{score}</span>
</div>
<div className="flex items-center space-x-2">
<Trophy className="w-4 h-4 text-yellow-500" />
<span className="font-bold text-gray-900 dark:text-white">{highScore}</span>
</div>
</div>
</div>

<div 
className="game-area relative bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden cursor-pointer"
style={{ width: GAME_WIDTH, height: 200 }}
onClick={() => {
if (gameOver) {
startGame();
} else if (isGameRunning) {
jump();
} else {
startGame();
}
}}
>
<div 
className="absolute bottom-0 w-full bg-gray-300 dark:bg-gray-600"
style={{ height: GROUND_HEIGHT }}
/>

<div
className={`absolute bg-green-500 rounded transition-all duration-300 ${isJumping ? 'animate-bounce' : ''}`}
style={{
left: 100,
bottom: GROUND_HEIGHT - dinoY,
width: 50,
height: DINO_HEIGHT,
}}
>
<div className="w-full h-full flex items-center justify-center text-2xl">
🦕
</div>
</div>

{obstacles.map((obstacle, index) => (
<div
key={index}
className="absolute bg-red-500 rounded"
style={{
left: obstacle.x,
bottom: GROUND_HEIGHT - obstacle.height,
width: obstacle.width,
height: obstacle.height,
}}
>
<div className="w-full h-full flex items-center justify-center text-lg">
🌵
</div>
</div>
))}

{gameOver && (
<div className="absolute inset-0 bg-black/75 flex items-center justify-center rounded-lg">
<div className="text-center text-white">
<h3 className="text-2xl font-bold mb-2">Game Over!</h3>
<p className="text-lg mb-4">Score: {score}</p>
{score === highScore && score > 0 && (
<p className="text-yellow-400 mb-4">🎉 New High Score!</p>
)}
<button
onClick={startGame}
className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors mx-auto"
>
<RotateCcw className="w-4 h-4" />
<span>Play Again</span>
</button>
</div>
</div>
)}

{!isGameRunning && !gameOver && (
<div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
<div className="text-center text-white">
<h3 className="text-xl font-bold mb-4">🎮 Click to Start Game</h3>
<p className="text-sm opacity-75">Press SPACE or click the game area to jump</p>
</div>
</div>
)}
</div>

<div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
<p>Press SPACE or click to jump over obstacles</p>
<p>The game gets faster as your score increases!</p>
</div>
</div>
</div>
);
};

export default WifiOff;