import { lazy } from 'react';

const apps = {
  'calculator': () => import('../parts/apps/Calculator'),
  'text-editor': () => import('../parts/apps/TextEditor'),
  'terminal': () => import('../parts/apps/Terminal'),
  'browser': () => import('../parts/apps/Browser'),
  'paint': () => import('../parts/apps/Paint'),
  'file-explorer': () => import('../parts/apps/FileExplorer'),
  'settings': () => import('../parts/apps/SystemSettings'),
  'task-manager': () => import('../parts/apps/TaskManager'),
  'spreadsheet': () => import('../parts/apps/Spreadsheet'),
  'snake': () => import('../parts/apps/games/Snake'),
  'tetris': () => import('../parts/apps/games/Tetris'),
  'checkers': () => import('../parts/apps/games/Checkers'),
  'camera': () => import('../parts/apps/CameraApp'),
  'voice-recorder': () => import('../parts/apps/VoiceRecorder'),
  'control-panel': () => import('../parts/apps/ControlPanel'),
  'image-viewer': () => import('../parts/apps/ImageViewer'),
  'audio-player': () => import('../parts/apps/AudioPlayer'),
  'recycle-bin': () => import('../parts/apps/RecycleBin')
};

export default apps;

export const isAppAvailable = (appId: string): boolean => {
  return appId in apps;
};

export const getAppLoader = (appId: string) => {
  return apps[appId as keyof typeof apps];
};