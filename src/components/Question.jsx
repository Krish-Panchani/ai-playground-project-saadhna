import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Question = ({ question }) => (
    <div>
        {question && (
            <div className='flex flex-col md:flex-row px-8 items-center bg-gray-200 py-2 rounded-xl'>
                <h2 className='text-xl'>AI Generated Que: </h2>
                <p className='text-2xl font-semibold px-2 underline underline-offset-2'><ReactMarkdown remarkPlugins={[remarkGfm]}>{question}</ReactMarkdown></p>

            </div>
        )}
    </div>
);

export default Question;