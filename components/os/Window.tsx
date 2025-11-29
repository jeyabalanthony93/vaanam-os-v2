
import React, { useState, useEffect, useRef } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { WindowState } from '../../types';

interface WindowProps {
  window: WindowState;
  isActive: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onMove: (x: number, y: number) => void;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({ 
  window, 
  isActive, 
  onFocus, 
  onClose, 
  onMinimize, 
  onMaximize, 
  onMove, 
  children 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && !window.isMaximized) {
        onMove(e.clientX - dragOffset.x, e.clientY - dragOffset.y);
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragOffset, onMove, window.isMaximized]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (window.isMaximized) return;
    onFocus();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - window.position.x,
      y: e.clientY - window.position.y
    });
  };

  if (window.isMinimized) return null;

  return (
    <div
      ref={windowRef}
      style={{
        transform: window.isMaximized ? 'none' : `translate(${window.position.x}px, ${window.position.y}px)`,
        width: window.isMaximized ? '100%' : `${window.size.width}px`,
        height: window.isMaximized ? 'calc(100% - 48px)' : `${window.size.height}px`, // Subtract taskbar height
        zIndex: window.zIndex,
        top: window.isMaximized ? 0 : 0,
        left: window.isMaximized ? 0 : 0,
      }}
      className={`absolute flex flex-col rounded-lg shadow-2xl overflow-hidden border border-slate-700/50 backdrop-blur-sm transition-shadow duration-200
        ${isActive ? 'shadow-cyan-900/40 border-slate-600 ring-1 ring-white/10' : 'shadow-black/50 opacity-95'}
        ${window.isMaximized ? 'rounded-none border-none' : ''}
      `}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div 
        className={`h-9 flex items-center justify-between px-3 select-none
          ${isActive 
            ? 'bg-slate-800 text-slate-100' 
            : 'bg-slate-900 text-slate-400'}
        `}
        onMouseDown={handleMouseDown}
        onDoubleClick={onMaximize}
      >
        <div className="flex items-center gap-2 text-sm font-medium truncate">
          {window.icon && <window.icon size={14} />}
          <span>{window.title}</span>
        </div>

        <div className="flex items-center gap-1" onMouseDown={e => e.stopPropagation()}>
          <button 
            onClick={onMinimize} 
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition"
          >
            <Minus size={14} />
          </button>
          <button 
            onClick={onMaximize} 
            className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition"
          >
            {window.isMaximized ? <Square size={12} /> : <Maximize2 size={12} />}
          </button>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-red-500 hover:text-white rounded text-slate-400 transition"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden bg-slate-950 relative">
         {/* Overlay to catch clicks when inactive (prevents iframe/input stealing focus) */}
         {!isActive && <div className="absolute inset-0 z-10 bg-transparent" />}
         {children}
      </div>

      {/* Resize Handle (Simplified for now - just visual corner) */}
      {!window.isMaximized && (
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-20" />
      )}
    </div>
  );
};

export default Window;
