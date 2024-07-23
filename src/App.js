import React, { useState } from 'react';
import AskQuestionButton from './components/AskQuestionButton';
import DrawingCanvas from './components/DrawingCanvas';
import SubmitDrawingButton from './components/SubmitDrawingButton';
import RewardDisplay from './components/RewardDisplay';

function App() {
  const [question, setQuestion] = useState('');
  const [drawing, setDrawing] = useState(null);
  const [rewardPoints, setRewardPoints] = useState(0);

  const fetchQuestion = async () => {
    const response = await fetch('https://<your-cloud-run-url>/generateQuestion');
    const data = await response.json();
    setQuestion(data.text);
  };

  const handleDrawingComplete = (drawingData) => {
    setDrawing(drawingData);
  };

  const submitDrawing = async () => {
    const response = await fetch('https://<your-cloud-run-url>/analyzeDrawing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ drawing })
    });
    const data = await response.json();
    if (data.isCorrect) {
      setRewardPoints(prevPoints => prevPoints + 10);
    }
  };

  return (
    <div>
      <h1>AI Playground App</h1>
      <AskQuestionButton onClick={fetchQuestion} />
      <p>{question}</p>
      <DrawingCanvas onDrawingComplete={handleDrawingComplete} />
      <SubmitDrawingButton onClick={submitDrawing} />
      <RewardDisplay points={rewardPoints} />
    </div>
  );
}

export default App;
