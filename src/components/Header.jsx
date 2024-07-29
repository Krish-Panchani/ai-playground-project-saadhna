import React from 'react';

const Header = ({ handleGenerateQuestion, loadingQuestion }) => (
  <div className='flex justify-between items-center px-4 py-2 bg-gray-200'>
    <h1 className='text-xl sm:text-3xl font-bold border-l-4 border-gray-800 pl-2'>AI PLAYGROUND</h1>
    <div className='flex items-center'>
      <button onClick={handleGenerateQuestion} className='bg-gray-800 px-4 py-2 text-white rounded-lg'>
        {loadingQuestion ? 'Loading...' : 'Generate Que'}
      </button>
    </div>
  </div>
);

export default Header;
