import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trophy, Target } from 'lucide-react';

const ClickTheDot: React.FC = () => {
const [gameRunning, setGameRunning] = useState(false);
const [score, setScore] = useState(0);
const [timeLeft, setTimeLeft] = useState(30);
const [dotPosition, setDotPosition] = useState({ x: 50, y: 50 });
const [gameOver, setGameOver] = useState(false);
const [highScore, setHighScore] = useState(() => {
return parseInt(localStorage.getItem('click-dot-high-score') || '0');
});
const [dotSpeed, setDotSpeed] = useState(2000);

const generateNewPosition = useCallback(() => {
const x = Math.random() * 80 + 10;
const y = Math.random() * 80 + 10;
setDotPosition({ x, y });
}, []);

const startGame = () => {
setGameRunning(true);
setGameOver(false);
setScore(0);
setTimeLeft(30);
setDotSpeed(2000);
generateNewPosition();
};

const endGame = useCallback(() => {
setGameRunning(false);
setGameOver(true);

if (score > highScore) {
setHighScore(score);
localStorage.setItem('click-dot-high-score', score.toString());
}
}, [score, highScore]);

const handleDotClick = () => {
if (!gameRunning) return;

setScore(prev => prev + 1);
generateNewPosition();

if ((score + 1) % 5 === 0) {
setDotSpeed(prev => Math.max(500, prev - 200));
}
};

useEffect(() => {
if (gameRunning && timeLeft > 0) {
const timer = setTimeout(() => {
setTimeLeft(prev => prev - 1);
}, 1000);
return () => clearTimeout(timer);
} else if (timeLeft === 0) {
endGame();
}
}, [gameRunning, timeLeft, endGame]);

useEffect(() => {
if (gameRunning) {
const timer = setTimeout(() => {
generateNewPosition();
}, dotSpeed);
return () => clearTimeout(timer);
}
}, [gameRunning, dotPosition, dotSpeed, generateNewPosition]);

return (
<div className="h-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex flex-col items-center justify-center p-4">
<div className="text-center mb-6">
<h1 className="text-3xl font-bold mb-2 flex items-center justify-center space-x-2">
<Target className="w-8 h-8" />
<span>Click the Dot</span>
</h1>
<div className="flex items-center justify-center space-x-6 text-lg">
<div>Score: {score}</div>
<div>Time: {timeLeft}s</div>
<div className="flex items-center space-x-1">
<Trophy className="w-5 h-5 text-yellow-400" />
<span>Best: {highScore}</span>
</div>
</div>
</div>

<div className="relative w-96 h-96 bg-white/10 rounded-lg border-2 border-white/20 mb-6">
{gameRunning && (
<button
onClick={handleDotClick}
className="absolute w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
style={{
left: `${dotPosition.x}%`,
top: `${dotPosition.y}%`,
transform: 'translate(-50%, -50%)'
}}
/>
)}

{gameOver && (
<div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
<div className="text-center">
<h2 className="text-2xl font-bold mb-2">Game Over!</h2>
<p className="text-lg mb-4">Final Score: {score}</p>
{score === highScore && score > 0 && (
<p className="text-yellow-400 mb-4"> New High Score!</p>
)}
</div>
</div>
)}

{!gameRunning && !gameOver && (
<div className="absolute inset-0 flex items-center justify-center">
<div className="text-center">
<Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
<p className="text-lg">Click the red dot as fast as you can!</p>
<p className="text-sm opacity-75 mt-2">The dot moves faster as you score more points</p>
</div>
</div>
)}
</div>

<div className="flex space-x-4">
<button
onClick={gameOver ? startGame : gameRunning ? () => setGameRunning(false) : startGame}
className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
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
<span>Start Game</span>
</>
)}
</button>
</div>

<div className="mt-4 text-center text-sm opacity-75">
<p>Click the red dot before it moves to score points</p>
<p>Game lasts 30 seconds - how many can you click?</p>
</div>
</div>
);
};

export default ClickTheDot;