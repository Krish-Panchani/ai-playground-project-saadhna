import React from 'react';

const AIResponse = ({ loadingResponse, responseText }) => {
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
    } catch (error) {
      console.error('Error parsing response:', error);
      return <p>Invalid response format</p>;
    }
  };

  return (
    <div className='flex justify-center items-center'>
      {loadingResponse && <p>Loading AI response...</p>}
      {responseText && (
        <div className='mt-4 border border-gray-300 p-4 rounded-lg'>
          <h3 className='text-xl font-semibold'>AI Response:</h3>
          {renderResponse()}
        </div>
      )}
    </div>
  );
};

export default AIResponse;
