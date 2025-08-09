import React, { useState, useCallback } from 'react';
import { Save, Download, Upload, FileSpreadsheet, FilePlus } from 'lucide-react';
import { useDialog } from '../../settings/DialogContext';
import { useFileSystem } from '../../settings/FileSystemContext';

interface SaveAsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fileName: string, folderId: string | null) => void;
}

const SaveAsModal: React.FC<SaveAsModalProps> = ({ isOpen, onClose, onSave }) => {
  const { getItemsByParent, getItem } = useFileSystem();
  const [selectedFolder, setSelectedFolder] = useState<string | null>('documents');
  const [fileName, setFileName] = useState('My Spreadsheet.csv');
  const [currentPath, setCurrentPath] = useState<string | null>('documents');

  const folders = getItemsByParent(currentPath).filter(item => item.type === 'folder');
  const currentFolderName = currentPath ? getItem(currentPath)?.name || 'Root' : 'Root';

  const handleSave = () => {
    if (fileName.trim()) {
      onSave(fileName.trim(), selectedFolder);
      onClose();
    }
  };

  const navigateToFolder = (folderId: string | null) => {
    setCurrentPath(folderId);
    setSelectedFolder(folderId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Save Spreadsheet As</h2>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location: {currentFolderName}
            </label>
            <div className="max-h-32 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
              {currentPath && (
                <button
                  onClick={() => {
                    const parent = getItem(currentPath);
                    navigateToFolder(parent?.parentId || null);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
                >
                  📁 .. (Parent folder)
                </button>
              )}
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => navigateToFolder(folder.id)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 ${
                    selectedFolder === folder.id ? 'bg-blue-100 dark:bg-blue-900' : ''
                  }`}
                >
                  {folder.icon} {folder.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              File name
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              autoFocus
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 pt-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!fileName.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

interface Cell {
value: string;
formula?: string;
type: 'text' | 'number' | 'formula';
}

const Spreadsheet: React.FC = () => {
const { showInput, showAlert } = useDialog();
const { createFile } = useFileSystem();
const [showSaveAsModal, setShowSaveAsModal] = useState(false);
const [grid, setGrid] = useState<Cell[][]>(() => {
const initialGrid = Array(20).fill(null).map(() =>
Array(10).fill(null).map(() => ({ value: '', type: 'text' as const }))
);
initialGrid[0][0] = { value: 'Name', type: 'text' };
initialGrid[0][1] = { value: 'Age', type: 'text' };
initialGrid[0][2] = { value: 'City', type: 'text' };
initialGrid[1][0] = { value: 'John Doe', type: 'text' };
initialGrid[1][1] = { value: '25', type: 'number' };
initialGrid[1][2] = { value: 'New York', type: 'text' };
return initialGrid;
});

const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);

const getColumnLabel = (col: number) => {
let label = '';
while (col >= 0) {
label = String.fromCharCode(65 + (col % 26)) + label;
col = Math.floor(col / 26) - 1;
}
return label;
};

const updateCell = useCallback((row: number, col: number, value: string) => {
setGrid(prev => {
const newGrid = [...prev];
newGrid[row] = [...newGrid[row]];

let cellType: 'text' | 'number' | 'formula' = 'text';
if (value.startsWith('=')) {
cellType = 'formula';
} else if (!isNaN(Number(value)) && value !== '') {
cellType = 'number';
}

newGrid[row][col] = { value, type: cellType };
return newGrid;
});
}, []);

const handleCellClick = (row: number, col: number) => {
setSelectedCell({ row, col });
setEditingCell(null);
};

const handleCellDoubleClick = (row: number, col: number) => {
setEditingCell({ row, col });
setSelectedCell({ row, col });
};

const handleCellKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
if (e.key === 'Enter') {
setEditingCell(null);
if (row < grid.length - 1) {
setSelectedCell({ row: row + 1, col });
}
} else if (e.key === 'Escape') {
setEditingCell(null);
} else if (e.key === 'Tab') {
e.preventDefault();
setEditingCell(null);
if (col < grid[0].length - 1) {
setSelectedCell({ row, col: col + 1 });
}
}
};

const saveSpreadsheet = () => {
localStorage.setItem('spreadsheet-data', JSON.stringify(grid));
alert('Spreadsheet saved!');
};

const saveSpreadsheetAs = async () => {
setShowSaveAsModal(true);
};

const handleSaveAsConfirm = (fileName: string, folderId: string | null) => {
const csv = grid.map(row => 
row.map(cell => `"${cell.value}"`).join(',')
).join('\n');

const finalFileName = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`;
createFile(finalFileName, csv, folderId);
showAlert('Spreadsheet Saved', `Spreadsheet saved as ${finalFileName} successfully!`, 'success');
};

const handleSaveAsCancel = () => {
setShowSaveAsModal(false);
};

const loadSpreadsheet = () => {
const saved = localStorage.getItem('spreadsheet-data');
if (saved) {
setGrid(JSON.parse(saved));
alert('Spreadsheet loaded!');
}
};

const exportToCSV = () => {
const csv = grid.map(row => 
row.map(cell => `"${cell.value}"`).join(',')
).join('\n');

const blob = new Blob([csv], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'spreadsheet.csv';
a.click();
URL.revokeObjectURL(url);
};

const addRow = () => {
setGrid(prev => [
...prev,
Array(prev[0].length).fill(null).map(() => ({ value: '', type: 'text' as const }))
]);
};

const addColumn = () => {
setGrid(prev => prev.map(row => [
...row,
{ value: '', type: 'text' as const }
]));
};

return (
<div className="h-full bg-white dark:bg-gray-900 flex flex-col">
<div className="border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
<div className="flex items-center space-x-2">
<FileSpreadsheet className="w-5 h-5 text-green-600" />
<span className="font-medium text-gray-900 dark:text-white">Spreadsheet</span>
</div>

<div className="flex items-center space-x-2">
<button
onClick={saveSpreadsheet}
className="flex items-center space-x-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
>
<Save className="w-4 h-4" />
<span>Save</span>
</button>

<button
onClick={saveSpreadsheetAs}
className="flex items-center space-x-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors"
>
<FilePlus className="w-4 h-4" />
<span>Save As</span>
</button>

<button
onClick={loadSpreadsheet}
className="flex items-center space-x-1 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm transition-colors"
>
<Upload className="w-4 h-4" />
<span>Load</span>
</button>

<button
onClick={exportToCSV}
className="flex items-center space-x-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors"
>
<Download className="w-4 h-4" />
<span>Export CSV</span>
</button>

<div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

<button
onClick={addRow}
className="flex items-center space-x-1 px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm transition-colors"
>
<span>+</span>
<span>Row</span>
</button>

<button
onClick={addColumn}
className="flex items-center space-x-1 px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm transition-colors"
>
<span>+</span>
<span>Column</span>
</button>
</div>
</div>

{selectedCell && (
<div className="border-b border-gray-200 dark:border-gray-700 p-2 flex items-center space-x-2">
<span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-16">
{getColumnLabel(selectedCell.col)}{selectedCell.row + 1}
</span>
<input
type="text"
value={grid[selectedCell.row][selectedCell.col].value}
onChange={(e) => updateCell(selectedCell.row, selectedCell.col, e.target.value)}
className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
placeholder="Enter value or formula (=A1+B1)"
/>
</div>
)}

<div className="flex-1 overflow-auto">
<table className="border-collapse">
<thead>
<tr>
<th className="w-12 h-8 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-600 dark:text-gray-400"></th>
{grid[0].map((_, colIndex) => (
<th
key={colIndex}
className="min-w-24 h-8 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-600 dark:text-gray-400"
>
{getColumnLabel(colIndex)}
</th>
))}
</tr>
</thead>
<tbody>
{grid.map((row, rowIndex) => (
<tr key={rowIndex}>
<td className="w-12 h-8 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-xs font-medium text-gray-600 dark:text-gray-400 text-center">
{rowIndex + 1}
</td>
{row.map((cell, colIndex) => (
<td
key={colIndex}
className={`min-w-24 h-8 border border-gray-300 dark:border-gray-600 p-0 ${
selectedCell?.row === rowIndex && selectedCell?.col === colIndex
? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
: 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
}`}
onClick={() => handleCellClick(rowIndex, colIndex)}
onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
>
{editingCell?.row === rowIndex && editingCell?.col === colIndex ? (
<input
type="text"
value={cell.value}
onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
onKeyDown={(e) => handleCellKeyDown(e, rowIndex, colIndex)}
onBlur={() => setEditingCell(null)}
className="w-full h-full px-1 text-xs bg-transparent border-none outline-none text-gray-900 dark:text-white"
autoFocus
/>
) : (
<div className={`w-full h-full px-1 text-xs flex items-center ${
cell.type === 'number' ? 'justify-end' : 'justify-start'
} ${
cell.type === 'formula' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
}`}>
{cell.value}
</div>
)}
</td>
))}
</tr>
))}
</tbody>
</table>
</div>

<div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-600 dark:text-gray-400 flex items-center justify-between">
<div className="flex items-center space-x-4">
<span>Rows: {grid.length}</span>
<span>Columns: {grid[0].length}</span>
{selectedCell && (
<span>Selected: {getColumnLabel(selectedCell.col)}{selectedCell.row + 1}</span>
)}
</div>
<div>Ready</div>
</div>

<SaveAsModal
isOpen={showSaveAsModal}
onClose={handleSaveAsCancel}
onSave={handleSaveAsConfirm}
/>
</div>
);
};

export default Spreadsheet;