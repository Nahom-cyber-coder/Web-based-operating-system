export const isFileSystemAccessSupported = (): boolean => {
return 'showSaveFilePicker' in window;
};

export const saveImageFile = async (blob: Blob, fileName: string): Promise<boolean> => {
if (!isFileSystemAccessSupported()) {
return false;
}

try {
const fileHandle = await (window as any).showSaveFilePicker({
suggestedName: fileName,
types: [{
description: 'Image files',
accept: {
'image/png': ['.png'],
'image/jpeg': ['.jpg', '.jpeg'],
'image/gif': ['.gif'],
'image/webp': ['.webp']
}
}]
});

const writable = await fileHandle.createWritable();
await writable.write(blob);
await writable.close();

return true;
} catch (error) {
return false;
}
};

export const saveAudioFile = async (blob: Blob, fileName: string): Promise<boolean> => {
if (!isFileSystemAccessSupported()) {
return false;
}

try {
const fileHandle = await (window as any).showSaveFilePicker({
suggestedName: fileName,
types: [{
description: 'Audio files',
accept: {
'audio/wav': ['.wav'],
'audio/mp3': ['.mp3'],
'audio/ogg': ['.ogg'],
'audio/webm': ['.webm']
}
}]
});

const writable = await fileHandle.createWritable();
await writable.write(blob);
await writable.close();

return true;
} catch (error) {
return false;
}
};

export const blobFromDataUrl = (dataUrl: string): Blob => {
const arr = dataUrl.split(',');
const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
const bstr = atob(arr[1]);
let n = bstr.length;
const u8arr = new Uint8Array(n);

while (n--) {
u8arr[n] = bstr.charCodeAt(n);
}

return new Blob([u8arr], { type: mime });
};