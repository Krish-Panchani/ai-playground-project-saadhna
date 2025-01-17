import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { FaUndo, FaRedo, FaEraser, FaPenAlt, FaTrashAlt } from 'react-icons/fa'; // Import icons

const DrawingCanvas = forwardRef(({ onDrawingComplete, setIsCanvasEmpty }, ref) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [mode, setMode] = useState('draw');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;
    canvas.width = 800;
    canvas.height = 400;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setIsCanvasEmpty(true);
  }, [setIsCanvasEmpty]);

  useImperativeHandle(ref, () => ({
    clearCanvas
  }));

  const handleMouseDown = (e) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = mode === 'erase' ? 'white' : color;
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
    setIsCanvasEmpty(false);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    const canvas = canvasRef.current;
    setIsDrawing(false);
    ctxRef.current.closePath();
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push(canvas.toDataURL());
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
    onDrawingComplete(canvas.toDataURL());
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push(canvas.toDataURL());
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
    onDrawingComplete(canvas.toDataURL());
    setIsCanvasEmpty(true);
  };

  const undo = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      const prevImage = new Image();
      prevImage.src = history[currentStep - 1];
      prevImage.onload = () => {
        const ctx = ctxRef.current;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(prevImage, 0, 0);
      };
    }
  };

  const redo = () => {
    if (currentStep < history.length - 1) {
      setCurrentStep(currentStep + 1);
      const nextImage = new Image();
      nextImage.src = history[currentStep + 1];
      nextImage.onload = () => {
        const ctx = ctxRef.current;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(nextImage, 0, 0);
      };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.style.cursor = `url('data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="${brushSize}" height="${brushSize}" viewBox="0 0 ${brushSize} ${brushSize}"><circle cx="${brushSize/2}" cy="${brushSize/2}" r="${brushSize/2}" fill="${color}" /></svg>`)}') ${brushSize / 2} ${brushSize / 2}, auto`;
  }, [brushSize, color]);

  return (
    <div className='flex flex-col justify-evenly'>
      <div className='flex flex-col md:flex-row justify-between gap-10'>
        <div className='flex flex-col'>
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ border: '1px solid black' }}
            className='my-2 w-full h-auto'
          />
          <div className='flex justify-end'>
            <div className='flex items-center'>
              <button onClick={undo} className="bg-gray-800 px-2 py-2 text-white rounded-xl mx-2">
                <FaUndo />
              </button>
              <span>Undo</span>
            </div>
            <div className='flex items-center'>
              <button onClick={redo} className="bg-gray-800 px-2 py-2 text-white rounded-xl mx-2">
                <FaRedo />
              </button>
              <span>Redo</span>
            </div>
          </div>
        </div>
        <div className='flex flex-col items-center my-2 gap-4'>
          <div className='flex flex-row md:flex-col items-center my-2 gap-4'>
            <div className='flex flex-col items-center gap-2'>
              <label className='font-medium text-sm sm:text-lg md:text-base'>Color Picker</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className='mx-2'
              />
            </div>
            <div className='flex flex-col items-center gap-2'>
              <label className='font-medium text-sm sm:text-lg md:text-base'>Brush Size</label>
              <div className='flex'>
                <div className='flex items-center'>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(e.target.value)}
                    className='mx-2'
                  />
                </div>
                <div
                  style={{
                    width: brushSize + 'px',
                    height: brushSize + 'px',
                    backgroundColor: color,
                    borderRadius: '50%',
                    border: '1px solid black',
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className='flex flex-row md:flex-col gap-4 border border-gray-800 items-center px-2 py-2 rounded-xl'>
            <label className='font-medium text-lg md:text-base'>Modes</label>
            <button onClick={() => setMode('draw')} className={`flex items-center gap-2 px-4 py-4 rounded-xl mx-2 ${mode === 'draw' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>
              <FaPenAlt />
              <span className='hidden sm:block'>Pen</span>
            </button>
            <button onClick={() => setMode('erase')} className={`flex items-center gap-2 px-4 py-4 rounded-xl mx-2 ${mode === 'erase' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}>
              <FaEraser />
              <span className='hidden sm:block'>Eraser</span>
            </button>
            <button onClick={clearCanvas} className="flex items-center bg-red-500 gap-2 px-4 py-4 text-white rounded-xl mx-2">
              <FaTrashAlt />
              <span className='hidden sm:block'>Clear</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DrawingCanvas;
