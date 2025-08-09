import React, { useState, useEffect, useRef } from 'react';
import { useFileSystem } from '../../settings/FileSystemContext';
import { useScrollPersistence } from '../../helpers/useScrollPersistence';

interface TerminalProps {}

const Terminal: React.FC<TerminalProps> = () => {
const [input, setInput] = useState('');
const [output, setOutput] = useState<string[]>([
'WebOS Terminal v1.0.0',
'Type "help" for available commands.',
''
]);
const [history, setHistory] = useState<string[]>([]);
const [historyIndex, setHistoryIndex] = useState(-1);
const [currentPath, setCurrentPath] = useState('/');
const inputRef = useRef<HTMLInputElement>(null);
const { getItemsByParent, getItem, createFile, createFolder } = useFileSystem();

const scrollRef = useScrollPersistence('terminal');


const commands = {
help: () => [
'Available commands:',
'  help     - Show this help message',
'  ls       - List directory contents',
'  pwd      - Print working directory',
'  cd       - Change directory',
'  mkdir    - Create directory',
'  touch    - Create file',
'  cat      - Display file contents',
'  echo     - Display text',
'  clear    - Clear terminal',
'  date     - Show current date/time',
'  whoami   - Display current user',
''
],
ls: () => {
const items = getItemsByParent(currentPath === '/' ? null : currentPath);
if (items.length === 0) {
return ['Directory is empty'];
}
return items.map(item => 
`${item.type === 'folder' ? 'd' : '-'}rw-r--r-- 1 user user ${item.size || 0} ${item.modifiedAt.toLocaleDateString()} ${item.name}`
);
},
pwd: () => [currentPath],
cd: (args: string[]) => {
if (args.length === 0) {
setCurrentPath('/');
return [''];
}
const path = args[0];
if (path === '/') {
setCurrentPath('/');
} else if (path === '..') {
if (currentPath !== '/') {
const parent = getItem(currentPath);
setCurrentPath(parent?.parentId || '/');
}
} else {
const items = getItemsByParent(currentPath === '/' ? null : currentPath);
const folder = items.find(item => item.name === path && item.type === 'folder');
if (folder) {
setCurrentPath(folder.id);
} else {
return [`cd: ${path}: No such file or directory`];
}
}
return [''];
},
mkdir: (args: string[]) => {
if (args.length === 0) {
return ['mkdir: missing operand'];
}
createFolder(args[0], currentPath === '/' ? null : currentPath);
return [''];
},
touch: (args: string[]) => {
if (args.length === 0) {
return ['touch: missing file operand'];
}
createFile(args[0], '', currentPath === '/' ? null : currentPath);
return [''];
},
cat: (args: string[]) => {
if (args.length === 0) {
return ['cat: missing file operand'];
}
const items = getItemsByParent(currentPath === '/' ? null : currentPath);
const file = items.find(item => item.name === args[0] && item.type === 'file');
if (file) {
return [file.content || ''];
}
return [`cat: ${args[0]}: No such file or directory`];
},
echo: (args: string[]) => [args.join(' ')],
clear: () => {
setOutput(['']);
return [];
},
date: () => [new Date().toString()],
whoami: () => ['user']
};

const executeCommand = (command: string) => {
const [cmd, ...args] = command.trim().split(/\s+/);
const commandFn = commands[cmd as keyof typeof commands];

if (commandFn) {
const result = commandFn(args);
return result;
} else if (cmd) {
return [`${cmd}: command not found`];
}
return [''];
};

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
if (input.trim()) {
const newOutput = [...output, `user@webos:${currentPath}$ ${input}`];
const result = executeCommand(input);
setOutput([...newOutput, ...result]);
setHistory([...history, input]);
setHistoryIndex(-1);
}
setInput('');
};

const handleKeyDown = (e: React.KeyboardEvent) => {
if (e.key === 'ArrowUp') {
e.preventDefault();
if (historyIndex < history.length - 1) {
const newIndex = historyIndex + 1;
setHistoryIndex(newIndex);
setInput(history[history.length - 1 - newIndex]);
}
} else if (e.key === 'ArrowDown') {
e.preventDefault();
if (historyIndex > 0) {
const newIndex = historyIndex - 1;
setHistoryIndex(newIndex);
setInput(history[history.length - 1 - newIndex]);
} else if (historyIndex === 0) {
setHistoryIndex(-1);
setInput('');
}
} else if (e.key === 'Tab') {
e.preventDefault();
const commands = ['help', 'ls', 'pwd', 'cd', 'mkdir', 'touch', 'cat', 'echo', 'clear', 'date', 'whoami'];
const matches = commands.filter(cmd => cmd.startsWith(input));
if (matches.length === 1) {
setInput(matches[0]);
}
}
};

return (
<div className="h-full bg-black text-green-400 font-mono text-sm flex flex-col">
<div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1">
{output.map((line, index) => (
<div key={index} className="whitespace-pre-wrap">{line}</div>
))}
</div>

<form onSubmit={handleSubmit} className="flex items-center p-4 border-t border-gray-800">
<span className="text-green-400 mr-2">user@webos:{currentPath}$</span>
<input
ref={inputRef}
type="text"
value={input}
onChange={(e) => setInput(e.target.value)}
onKeyDown={handleKeyDown}
className="flex-1 bg-transparent border-none outline-none text-green-400 caret-green-400"
autoFocus
/>
</form>
</div>
);
};

export default Terminal;