import React from 'react';

export default function HowPlay() {
    return (
        <>
        <div className='flex flex-col items-start p-4 mb-4 border rounded-lg bg-gray-100'>
          <h2 className='text-2xl font-semibold mb-2'>How to Play</h2>
          <ol className='list-decimal list-inside'>
            <li>Click the "Generate Que" button to get an AI-generated question.</li>
            <li>Draw your answer to the question on the canvas below.</li>
            <li>Click "Submit" to upload your drawing and see the response from the AI.</li>
          </ol>
        </div>
        </>
    )
}