import React from 'react';

const Score = ({ score }) => (
  <>
    <div className='bg-gray-200 px-4 py-2 rounded-xl'>
      <h2 className='text-lg text-center'>Score: <span className='font-semibold'>{score}</span></h2>
    </div>
  </>
);

export default Score;