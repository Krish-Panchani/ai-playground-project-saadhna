import React, { useState, useEffect } from 'react';

const Header = ({ handleGenerateQuestion, loadingQuestion }) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const handleButtonClick = async () => {
    setIsButtonDisabled(true);
    setRemainingTime(120); // 2 minutes in seconds
    await handleGenerateQuestion();
  };

  useEffect(() => {
    let timer;
    if (remainingTime > 0 && isButtonDisabled) {
      timer = setInterval(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setIsButtonDisabled(false);
    }

    // Cleanup interval on component unmount or when timer is done
    return () => clearInterval(timer);
  }, [remainingTime, isButtonDisabled]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <div className='flex justify-between items-center px-4 py-2 bg-gray-200'>
      <h1 className='text-xl sm:text-3xl font-bold border-l-4 border-gray-800 pl-2'>AI PLAYGROUND</h1>
      <div className='flex items-center'>
        <button 
          onClick={handleButtonClick} 
          className={isButtonDisabled ? 'bg-gray-400 px-4 py-2 text-white rounded-lg cursor-not-allowed' : 'bg-gray-800 px-4 py-2 text-white rounded-lg'}
          disabled={loadingQuestion || isButtonDisabled}
        >
          {loadingQuestion ? 'Loading...' : (isButtonDisabled ? `Retry in ${formatTime(remainingTime)}` : 'Generate Que')}
        </button>
      </div>
    </div>
  );
};

export default Header;
