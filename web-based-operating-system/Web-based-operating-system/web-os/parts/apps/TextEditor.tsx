import React, { useState, useEffect } from 'react';
import { useFileSystem } from '../../settings/FileSystemContext';
import { useScrollPersistence } from '../../helpers/useScrollPersistence';
import { Save, FileText, AlignLeft, AlignCenter, AlignRight, Download } from 'lucide-react';
import { useDialog } from '../../settings/DialogContext';

interface SaveAsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fileName: string, folderId: string | null) => void;
  currentFileName: string;
}

const SaveAsModal: React.FC<SaveAsModalProps> = ({ isOpen, onClose, onSave, currentFileName }) => {
  const { getItemsByParent, getItem } = useFileSystem();
  const [selectedFolder, setSelectedFolder] = useState<string | null>('documents');
  const [fileName, setFileName] = useState(currentFileName);
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Save As</h2>
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

interface TextEditorProps {
fileId?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ fileId }) => {
const [content, setContent] = useState('');
const [filename, setFilename] = useState('Untitled.txt');
const [isModified, setIsModified] = useState(false);
const [fontSize, setFontSize] = useState(14);
const [fontFamily, setFontFamily] = useState('monospace');
const [textAlign, setTextAlign] = useState('left');
const { getItem, updateFileContent, createFile } = useFileSystem();
const { showInput, showAlert } = useDialog();
const [showSaveAsModal, setShowSaveAsModal] = useState(false);

const scrollRef = useScrollPersistence(`text-editor-${fileId || 'new'}`);

useEffect(() => {
if (fileId) {
const file = getItem(fileId);
if (file) {
setContent(file.content || '');
setFilename(file.name);
setIsModified(false);
}
}
}, [fileId, getItem]);

const handleSave = () => {
if (fileId) {
updateFileContent(fileId, content);
} else {
createFile(filename, content, 'documents');
}
setIsModified(false);
};

const handleSaveAs = async () => {
setShowSaveAsModal(true);
};

const handleSaveAsConfirm = (newFilename: string, folderId: string | null) => {
createFile(newFilename, content, folderId);
setFilename(newFilename);
setIsModified(false);
showAlert('File Saved', `File saved as ${newFilename} successfully!`, 'success');
};

const handleSaveAsCancel = () => {
setShowSaveAsModal(false);
};

const handleSaveAs_old = async () => {
const newFilename = await showInput('Save As', 'Enter file name:', filename);
if (newFilename) {
createFile(newFilename, content, 'documents');
setFilename(newFilename);
setIsModified(false);
}
};

const handleContentChange = (newContent: string) => {
setContent(newContent);
setIsModified(true);
};

const handleKeyDown = (e: React.KeyboardEvent) => {
if (e.ctrlKey && e.key === 's') {
e.preventDefault();
handleSave();
}
};

return (
<div className="h-full flex flex-col bg-white dark:bg-gray-900">
<div className="border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
<div className="flex items-center space-x-4">
<div className="flex items-center space-x-2">
<FileText className="w-5 h-5 text-gray-600 dark:text-gray-300" />
<span className="text-sm font-medium text-gray-900 dark:text-white">
{filename}
{isModified && <span className="text-orange-500"> •</span>}
</span>
</div>

<div className="flex items-center space-x-2">
<select
value={fontFamily}
onChange={(e) => setFontFamily(e.target.value)}
className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
>
<option value="monospace">Monospace</option>
<option value="serif">Serif</option>
<option value="sans-serif">Sans Serif</option>
</select>

<select
value={fontSize}
onChange={(e) => setFontSize(Number(e.target.value))}
className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
>
<option value={12}>12px</option>
<option value={14}>14px</option>
<option value={16}>16px</option>
<option value={18}>18px</option>
<option value={20}>20px</option>
</select>
</div>
</div>

<div className="flex items-center space-x-2">
<button
onClick={() => setTextAlign('left')}
className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
textAlign === 'left' ? 'bg-blue-100 dark:bg-blue-900' : ''
}`}
>
<AlignLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
</button>
<button
onClick={() => setTextAlign('center')}
className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
textAlign === 'center' ? 'bg-blue-100 dark:bg-blue-900' : ''
}`}
>
<AlignCenter className="w-4 h-4 text-gray-600 dark:text-gray-300" />
</button>
<button
onClick={() => setTextAlign('right')}
className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
textAlign === 'right' ? 'bg-blue-100 dark:bg-blue-900' : ''
}`}
>
<AlignRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
</button>

<div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

<button
onClick={handleSave}
className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
>
<Save className="w-4 h-4" />
<span>Save</span>
</button>

<button
onClick={handleSaveAs}
className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
>
<Download className="w-4 h-4" />
<span>Save As</span>
</button>
</div>
</div>

<div ref={scrollRef} className="flex-1 p-4 overflow-auto">
<textarea
value={content}
onChange={(e) => handleContentChange(e.target.value)}
onKeyDown={handleKeyDown}
className="w-full min-h-full resize-none border-none outline-none bg-transparent text-gray-900 dark:text-white"
style={{
fontSize: `${fontSize}px`,
fontFamily: fontFamily,
textAlign: textAlign as any,
lineHeight: '1.6',
}}
placeholder="Start typing..."
/>
</div>

<div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
<div className="flex items-center space-x-4">
<span>Lines: {content.split('\n').length}</span>
<span>Words: {content.split(/\s+/).filter(word => word.length > 0).length}</span>
<span>Characters: {content.length}</span>
</div>
<div className="flex items-center space-x-2">
<span>UTF-8</span>
<span>•</span>
<span>Plain Text</span>
</div>
</div>

<SaveAsModal
isOpen={showSaveAsModal}
onClose={handleSaveAsCancel}
onSave={handleSaveAsConfirm}
currentFileName={filename}
/>
</div>
);
};

export default TextEditor;