import React from 'react';

const Score = ({ score, question }) => (
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
);

export default Score;
