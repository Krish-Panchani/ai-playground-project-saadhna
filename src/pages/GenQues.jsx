import React, { useState, useRef } from 'react';
import DrawingCanvas from '../components/DrawingCanvas';
import HowPlay from '../components/howPlay';

function GenQues() {
  const [file, setFile] = useState(null);
  const [uniqueFileName, setUniqueFileName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [responseText, setResponseText] = useState('');
  const [question, setQuestion] = useState('');
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [score, setScore] = useState(0);
  const canvasRef = useRef(null);

  const handleDrawingComplete = (dataUrl) => {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const buffer = new ArrayBuffer(byteString.length);
    const data = new Uint8Array(buffer);
    for (let i = 0; i < byteString.length; i++) {
      data[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([buffer], { type: mimeString });
    setFile(new File([blob], 'drawing.png', { type: mimeString }));
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please complete a drawing to upload');
      return;
    }

    setLoadingUpload(true);

    try {
      const uploadResponse = await fetch(`${process.env.REACT_APP_UPLOAD_URL}?action=upload&objectName=${file.name}`);
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Error generating upload signed URL');
      }
      const uploadData = await uploadResponse.json();
      const uploadSignedUrl = uploadData.signedUrl;
      const uniqueFileName = uploadData.uniqueFileName;
      setUniqueFileName(uniqueFileName);

      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadSignedUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.onload = async () => {
        if (xhr.status === 200) {
          alert('File uploaded successfully');
          await handleSendPrompt(uniqueFileName);
        } else {
          alert('File upload failed');
        }
        setLoadingUpload(false);
      };
      xhr.onerror = () => {
        alert('An error occurred during the upload');
        setLoadingUpload(false);
      };
      xhr.send(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file: ' + error.message);
      setLoadingUpload(false);
    }
  };

  const handleSendPrompt = async (fileName) => {
    setLoadingResponse(true);

    try {
      const response = await fetch(process.env.REACT_APP_GET_IMAGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error getting response from cloud function');
      }
      
      const responseText = await response.text();
      const responseData = JSON.parse(responseText);

      setResponseText(responseText);
      setLoadingResponse(false);
      // setScore(prevScore => prevScore + 1);
      setScore(prevScore => prevScore + (responseData.points || 0));

    } catch (error) {
      console.error('Error getting response from cloud function:', error);
      alert('Error getting response from cloud function: ' + error.message);
      setLoadingResponse(false);
    }
  };

  const handleGenerateQuestion = async () => {
    setLoadingQuestion(true);
    
    try {
      const response = await fetch(process.env.REACT_APP_GENERATE_QUESTION_URL);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error generating question');
      }
      const questionText = await response.text();
      setQuestion(questionText);
      setPrompt(questionText);
      setLoadingQuestion(false);

      if (canvasRef.current) {
        canvasRef.current.clearCanvas();
      }
    } catch (error) {
      console.error('Error generating question:', error);
      alert('Error generating question: ' + error.message);
      setLoadingQuestion(false);
    }
  };

  const renderResponse = () => {
    try {
      const response = JSON.parse(responseText);
      const { isCorrect, reason, points } = response;

      if (isCorrect) {
        return (
          <div className='mt-4 border border-green-300 p-4 rounded-lg'>
            <p><span className='text-green-600 font-bold'>Correct!</span> {reason}</p>
            <p>Points: +{points}</p>
          </div>
        );
      }
      else
        return (
          <div className='mt-4 border border-red-300 p-4 rounded-lg'>
            <p><span className='text-red-600 font-bold'>Incorrect!</span> {reason}</p>
            <p>Points: {points}</p>
          </div>
        );
    }
    catch (error) {
      console.error('Error parsing response:', error);
      return <p>Invalid response format</p>;
    }
  };

  return (
    <div className='flex flex-col'>
      <div className='flex justify-between items-center px-4 py-2 bg-gray-200'>
        <h1 className='text-xl sm:text-3xl font-bold border-l-4 border-gray-800 pl-2'>AI PLAYGROUND</h1>
        <div className='flex items-center'>

          <button onClick={handleGenerateQuestion} className='bg-gray-800 px-4 py-2 text-white rounded-lg'>
            {loadingQuestion ? 'Loading...' : 'Generate Que'}
          </button>
        </div>
      </div>
      <div className='flex justify-between items-center mx-auto my-4'>
        <h2 className='text-lg mr-4'>Score: <span className='font-semibold'>{score}</span></h2>
        <div>
          {question && (
            <div className='flex px-8 items-center'>
              <h2 className='text-xl'>AI Generated Que: </h2>
              <p className='text-2xl font-semibold px-2 underline underline-offset-2'>{question}</p>
            </div>
          )}
        </div>
      </div>
      <div className='flex flex-col justify-center items-center'>
        <div className='flex '>

          <div className='flex justify-center items-center'>
            {loadingResponse && <p>Loading AI response...</p>}
            {responseText && (
              <div className='mt-4 border border-gray-300 p-4 rounded-lg'>
                <h3 className='text-xl font-semibold'>AI Response:</h3>
                {/* <p>{responseText}</p>
             */}
                {renderResponse()}
              </div>
            )}
          </div>
        </div>
        {question &&
          <div>
            <DrawingCanvas ref={canvasRef} onDrawingComplete={handleDrawingComplete} />
            <button onClick={handleUpload} className='bg-gray-800 px-4 py-2 text-white rounded-lg my-2'>
              {loadingUpload ? 'Uploading...' : 'Submit'}
            </button>
          </div>
        }
      </div>
      <div className='flex justify-center'>
        <HowPlay />
      </div>
    </div>
  );
}

export default GenQues;
