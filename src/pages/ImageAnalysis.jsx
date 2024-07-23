import React, { useState } from 'react';
import axios from 'axios';
import DrawingCanvas from '../components/DrawingCanvas';
function ImageAnalysis() {
    const [drawingData, setDrawingData] = useState(null); // State to hold drawing data
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState(null);

    const handlePromptChange = (event) => {
        setPrompt(event.target.value);
    };

    const handleDrawingComplete = (dataURL) => {
        setDrawingData(dataURL); // Save drawing data
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!drawingData) {
            setError('Please create a drawing before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('drawing', dataURLtoFile(drawingData, 'drawing.png')); // Convert dataURL to File object
        formData.append('prompt', prompt);

        try {
            const response = await axios.post('http://localhost:5000/api/analyzeImage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data.text);
            setError(null);
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const dataURLtoFile = (dataURL, filename) => {
        const [header, data] = dataURL.split(',');
        const mime = header.match(/:(.*?);/)[1];
        const binary = atob(data);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new File([new Uint8Array(array)], filename, { type: mime });
    };

    return (
        <div>
            <DrawingCanvas onDrawingComplete={handleDrawingComplete} />
            <input type="text" placeholder="Enter prompt" value={prompt} onChange={handlePromptChange} />
            <button type="submit" onClick={handleSubmit}>Submit</button>
            {result && <p>{result}</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
}

export default ImageAnalysis;