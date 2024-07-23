import React from 'react';

function EraseButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Erase Drawing
    </button>
  );
}

export default EraseButton;
