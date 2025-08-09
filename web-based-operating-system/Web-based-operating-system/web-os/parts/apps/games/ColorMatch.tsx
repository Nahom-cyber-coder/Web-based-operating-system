import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trophy, Palette } from 'lucide-react';

interface Tile {
id: number;
color: string;
matched: boolean;
}

const ColorMatch: React.FC = () => {
const [tiles, setTiles] = useState<Tile[]>([]);
const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
const [score, setScore] = useState(0);
const [moves, setMoves] = useState(0);
const [gameRunning, setGameRunning] = useState(false);
const [gameOver, setGameOver] = useState(false);
const [highScore, setHighScore] = useState(() => {
return parseInt(localStorage.getItem('color-match-high-score') || '0');
});

const colors = [
'#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
'#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

const initializeGame = useCallback(() => {
const newTiles: Tile[] = [];
for (let i = 0; i < 64; i++) {
newTiles.push({
id: i,
color: colors[Math.floor(Math.random() * colors.length)],
matched: false
});
}
setTiles(newTiles);
setSelectedTiles([]);
setScore(0);
setMoves(0);
setGameOver(false);
}, []);

const startGame = () => {
setGameRunning(true);
initializeGame();
};

const handleTileClick = (tileId: number) => {
if (!gameRunning || gameOver || tiles[tileId].matched) return;

if (selectedTiles.length < 2 && !selectedTiles.includes(tileId)) {
const newSelected = [...selectedTiles, tileId];
setSelectedTiles(newSelected);

if (newSelected.length === 2) {
setMoves(prev => prev + 1);

setTimeout(() => {
const [first, second] = newSelected;
if (tiles[first].color === tiles[second].color) {
setTiles(prev => prev.map(tile => 
tile.id === first || tile.id === second 
? { ...tile, matched: true }
: tile
));
setScore(prev => prev + 10);

checkForMatches();
}
setSelectedTiles([]);
}, 500);
}
}
};

const checkForMatches = () => {
const newTiles = [...tiles];
let matchFound = false;

for (let row = 0; row < 8; row++) {
for (let col = 0; col < 6; col++) {
const index = row * 8 + col;
const color = newTiles[index].color;

if (!newTiles[index].matched &&
newTiles[index + 1].color === color &&
newTiles[index + 2].color === color) {

let matchLength = 3;
while (col + matchLength < 8 && 
newTiles[row * 8 + col + matchLength].color === color) {
matchLength++;
}

for (let i = 0; i < matchLength; i++) {
newTiles[row * 8 + col + i].matched = true;
}

setScore(prev => prev + matchLength * 5);
matchFound = true;
}
}
}

for (let col = 0; col < 8; col++) {
for (let row = 0; row < 6; row++) {
const index = row * 8 + col;
const color = newTiles[index].color;

if (!newTiles[index].matched &&
newTiles[(row + 1) * 8 + col].color === color &&
newTiles[(row + 2) * 8 + col].color === color) {

let matchLength = 3;
while (row + matchLength < 8 && 
newTiles[(row + matchLength) * 8 + col].color === color) {
matchLength++;
}

for (let i = 0; i < matchLength; i++) {
newTiles[(row + i) * 8 + col].matched = true;
}

setScore(prev => prev + matchLength * 5);
matchFound = true;
}
}
}

if (matchFound) {
setTiles(newTiles);

setTimeout(() => {
dropTiles();
}, 300);
}
};

const dropTiles = () => {
const newTiles = [...tiles];

for (let col = 0; col < 8; col++) {
const column = [];
for (let row = 7; row >= 0; row--) {
const tile = newTiles[row * 8 + col];
if (!tile.matched) {
column.push(tile);
}
}

while (column.length < 8) {
column.push({
id: Date.now() + Math.random(),
color: colors[Math.floor(Math.random() * colors.length)],
matched: false
});
}

for (let row = 0; row < 8; row++) {
newTiles[row * 8 + col] = column[7 - row];
}
}

setTiles(newTiles);

setTimeout(() => {
checkForMatches();
}, 100);
};

useEffect(() => {
if (score > highScore) {
setHighScore(score);
localStorage.setItem('color-match-high-score', score.toString());
}
}, [score, highScore]);

return (
<div className="h-full bg-gradient-to-br from-pink-500 to-orange-500 text-white flex flex-col items-center justify-center p-4">
<div className="text-center mb-4">
<h1 className="text-3xl font-bold mb-2 flex items-center justify-center space-x-2">
<Palette className="w-8 h-8" />
<span>Color Match</span>
</h1>
<div className="flex items-center justify-center space-x-6 text-lg">
<div>Score: {score}</div>
<div>Moves: {moves}</div>
<div className="flex items-center space-x-1">
<Trophy className="w-5 h-5 text-yellow-400" />
<span>Best: {highScore}</span>
</div>
</div>
</div>

<div className="grid grid-cols-8 gap-1 mb-6 bg-white/10 p-4 rounded-lg">
{tiles.map((tile, index) => (
<button
key={tile.id}
onClick={() => handleTileClick(index)}
className={`w-8 h-8 rounded transition-all duration-300 ${
tile.matched 
? 'opacity-30 scale-75' 
: selectedTiles.includes(index)
? 'scale-110 ring-2 ring-white'
: 'hover:scale-105'
}`}
style={{ backgroundColor: tile.color }}
disabled={tile.matched || selectedTiles.length >= 2}
/>
))}
</div>

<div className="flex space-x-4">
<button
onClick={gameRunning ? () => setGameRunning(false) : startGame}
className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
>
{gameRunning ? (
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

<button
onClick={initializeGame}
className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
>
<RotateCcw className="w-5 h-5" />
<span>New Game</span>
</button>
</div>

<div className="mt-4 text-center text-sm opacity-75 max-w-md">
<p>Click two tiles to swap their colors</p>
<p>Match 3 or more of the same color to score points</p>
<p>Longer matches give bonus points!</p>
</div>
</div>
);
};

export default ColorMatch;