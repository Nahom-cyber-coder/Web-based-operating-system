import React, { useState } from 'react';
import { Play, Trophy, Star, Users } from 'lucide-react';
import ClickTheDot from '../games/ClickTheDot';
import ColorMatch from '../games/ColorMatch';
import Breakout from '../games/Breakout';

interface Game {
id: string;
title: string;
thumbnail: string;
category: string;
rating: number;
plays: string;
description: string;
}

const PokiGames: React.FC = () => {
const [selectedGame, setSelectedGame] = useState<Game | null>(null);

const games: Game[] = [
{
id: 'click-the-dot',
title: 'Click the Dot',
thumbnail: 'https://shared.steamstatic.com/store_item_assets/steam/apps/2587190/header.jpg?t=1695493274',
category: 'Arcade',
rating: 4.5,
plays: '2.1M',
description: 'Click the moving dot as fast as you can!'
},
{
id: 'color-match',
title: 'Color Match',
thumbnail: 'https://store-images.microsoft.com/image/apps.50392.9007199266525864.ce45f025-c167-45dd-a3ee-d1e7f2d9b3b4.18818b62-aa49-4ac2-9e29-acef1fc05d39?h=307',
category: 'Puzzle',
rating: 4.3,
plays: '1.8M',
description: 'Match colors to clear the board'
},
{
id: 'breakout',
title: 'Breakout',
thumbnail: 'https://www.coolmathgames.com/sites/default/files/styles/blog_node_image/public/2022-11/Retro%20Game%20Atari%20Breakout%20Blog%20Thumbnail.png.webp?itok=ybbO_NF4',
category: 'Arcade',
rating: 4.4,
plays: '1.5M',
description: 'Classic brick-breaking arcade game'
}
];

const TicTacToe: React.FC = () => {
const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
const [winner, setWinner] = useState<string | null>(null);

const checkWinner = (squares: (string | null)[]) => {
const lines = [
[0, 1, 2], [3, 4, 5], [6, 7, 8],
[0, 3, 6], [1, 4, 7], [2, 5, 8],
[0, 4, 8], [2, 4, 6]
];

for (const [a, b, c] of lines) {
if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
return squares[a];
}
}
return null;
};

const handleClick = (index: number) => {
if (board[index] || winner) return;

const newBoard = [...board];
newBoard[index] = currentPlayer;
setBoard(newBoard);

const gameWinner = checkWinner(newBoard);
if (gameWinner) {
setWinner(gameWinner);
} else {
setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
}
};

const resetGame = () => {
setBoard(Array(9).fill(null));
setCurrentPlayer('X');
setWinner(null);
};

return (
<div className="flex flex-col items-center justify-center h-full bg-blue-50 dark:bg-blue-900/20 p-8">
<h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Tic Tac Toe</h2>

{winner && (
<div className="mb-4 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
<p className="text-green-800 dark:text-green-200 font-semibold">
{winner === 'X' || winner === 'O' ? `Player ${winner} wins!` : "It's a tie!"}
</p>
</div>
)}

<div className="grid grid-cols-3 gap-2 mb-4">
{board.map((cell, index) => (
<button
key={index}
onClick={() => handleClick(index)}
className="w-20 h-20 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-2xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
>
{cell}
</button>
))}
</div>

<div className="text-center">
<p className="text-gray-700 dark:text-gray-300 mb-4">
Current Player: <span className="font-bold">{currentPlayer}</span>
</p>
<button
onClick={resetGame}
className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
>
New Game
</button>
</div>
</div>
);
};

const MemoryGame: React.FC = () => {
const [cards, setCards] = useState<{ id: number; value: string; flipped: boolean; matched: boolean }[]>([]);
const [flippedCards, setFlippedCards] = useState<number[]>([]);
const [moves, setMoves] = useState(0);
const [gameWon, setGameWon] = useState(false);

const symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎪', '🎯'];

const initializeGame = () => {
const shuffledCards = [...symbols, ...symbols]
.sort(() => Math.random() - 0.5)
.map((symbol, index) => ({
id: index,
value: symbol,
flipped: false,
matched: false
}));
setCards(shuffledCards);
setFlippedCards([]);
setMoves(0);
setGameWon(false);
};

React.useEffect(() => {
initializeGame();
}, []);

const handleCardClick = (id: number) => {
if (flippedCards.length === 2 || cards[id].flipped || cards[id].matched) return;

const newCards = [...cards];
newCards[id].flipped = true;
setCards(newCards);

const newFlippedCards = [...flippedCards, id];
setFlippedCards(newFlippedCards);

if (newFlippedCards.length === 2) {
setMoves(moves + 1);

setTimeout(() => {
const [first, second] = newFlippedCards;
if (cards[first].value === cards[second].value) {
newCards[first].matched = true;
newCards[second].matched = true;

if (newCards.every(card => card.matched)) {
setGameWon(true);
}
} else {
newCards[first].flipped = false;
newCards[second].flipped = false;
}

setCards([...newCards]);
setFlippedCards([]);
}, 1000);
}
};

return (
<div className="flex flex-col items-center justify-center h-full bg-purple-50 dark:bg-purple-900/20 p-8">
<h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Memory Match</h2>

<div className="mb-4 text-center">
<p className="text-gray-700 dark:text-gray-300">Moves: {moves}</p>
{gameWon && (
<p className="text-green-600 dark:text-green-400 font-bold">Congratulations! You won!</p>
)}
</div>

<div className="grid grid-cols-4 gap-2 mb-4">
{cards.map((card) => (
<button
key={card.id}
onClick={() => handleCardClick(card.id)}
className={`w-16 h-16 rounded-lg text-2xl font-bold transition-all duration-300 ${
card.flipped || card.matched
? 'bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-600'
: 'bg-purple-200 dark:bg-purple-800 hover:bg-purple-300 dark:hover:bg-purple-700'
}`}
>
{card.flipped || card.matched ? card.value : '?'}
</button>
))}
</div>

<button
onClick={initializeGame}
className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
>
New Game
</button>
</div>
);
};

if (selectedGame) {
let GameComponent;
switch (selectedGame.id) {
case 'click-the-dot':
GameComponent = ClickTheDot;
break;
case 'color-match':
GameComponent = ColorMatch;
break;
case 'breakout':
GameComponent = Breakout;
break;
default:
GameComponent = () => (
<div className="flex items-center justify-center h-full">
<div className="text-center">
<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
{selectedGame.title}
</h2>
<button
onClick={() => setSelectedGame(null)}
className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
>
Back to Games
</button>
</div>
</div>
);
}

return (
<div className="h-full">
<div className="border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
<button
onClick={() => setSelectedGame(null)}
className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm transition-colors"
>
← Back to Games
</button>
<h1 className="font-bold text-gray-900 dark:text-white">{selectedGame.title}</h1>
<div></div>
</div>
<GameComponent />
</div>
);
}

return (
<div className="h-full bg-white dark:bg-gray-900">
<div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
<div className="flex items-center space-x-3">
<div className="text-3xl">🎮</div>
<h1 className="text-3xl font-bold text-white">Poki Games</h1>
</div>
<p className="text-purple-100 mt-2">Free online games for everyone</p>
</div>

<div className="p-6 overflow-y-auto" style={{ height: 'calc(100% - 120px)' }}>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{games.map((game) => (
<div
key={game.id}
onClick={() => setSelectedGame(game)}
className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
>
<div className="relative">
<img
src={game.thumbnail}
alt={game.title}
className="w-full h-48 object-cover rounded-t-lg"
/>
<div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
{game.category}
</div>
<div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded-t-lg">
<Play className="w-12 h-12 text-white" />
</div>
</div>

<div className="p-4">
<h3 className="font-semibold text-gray-900 dark:text-white mb-2">
{game.title}
</h3>
<p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
{game.description}
</p>

<div className="flex items-center justify-between">
<div className="flex items-center space-x-2">
<div className="flex items-center space-x-1">
<Star className="w-4 h-4 text-yellow-500 fill-current" />
<span className="text-sm text-gray-600 dark:text-gray-400">{game.rating}</span>
</div>
<div className="flex items-center space-x-1">
<Users className="w-4 h-4 text-gray-500" />
<span className="text-sm text-gray-600 dark:text-gray-400">{game.plays}</span>
</div>
</div>

<button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors">
Play Now
</button>
</div>
</div>
</div>
))}
</div>
</div>
</div>
);
};

export default PokiGames;