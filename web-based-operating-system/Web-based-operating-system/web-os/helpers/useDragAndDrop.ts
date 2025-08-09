import { useState, useCallback } from 'react';

interface DragState {
isDragging: boolean;
draggedItem: any;
dragOffset: { x: number; y: number };
}

export const useDragAndDrop = () => {
const [dragState, setDragState] = useState<DragState>({
isDragging: false,
draggedItem: null,
dragOffset: { x: 0, y: 0 }
});

const startDrag = useCallback((item: any, offset: { x: number; y: number }) => {
setDragState({
isDragging: true,
draggedItem: item,
dragOffset: offset
});
}, []);

const endDrag = useCallback(() => {
setDragState({
isDragging: false,
draggedItem: null,
dragOffset: { x: 0, y: 0 }
});
}, []);

const updateDragOffset = useCallback((offset: { x: number; y: number }) => {
setDragState(prev => ({
...prev,
dragOffset: offset
}));
}, []);

return {
dragState,
startDrag,
endDrag,
updateDragOffset
};
};