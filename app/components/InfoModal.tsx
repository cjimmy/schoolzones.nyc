/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import ReactMarkdown from 'react-markdown';

const markdownContent = `
# Unofficial map of NYC public school _zones_
Based on official data for 2024-2025

* Still a _work in progress_!
* **Elementary** schools only
* Middle schools coming soon.

## Why?
NYC DOE only provides this [tool](https://schoolsearch.schools.nyc/), where you type an address to find your zone. I would guess that DOE doesn't want people squinting at a map to figure out their school zone. The side of the street you live on matters. 

But say you were planning to move to a new neighborhood. It'd be helpful to know the boundaries of different schools zones.

## Author
This map was created and maintained by [Jimmy Chion](https://www.linkedin.com/in/jimmychion/)

## Data
* NYC Open Data: [School Zones 2024-2025 (Elementary School)](https://data.cityofnewyork.us/Education/School-Zones-2024-2025-Elementary-School-/cmjf-yawu/about_data)

## Freshness
* Data last updated: 11/26/24 
* Map last updated: 03/18/25
`;

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-16 right-4 z-[400] w-80 max-h-[80vh] overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="markdown-content">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-md font-semibold mt-4 mb-2 text-gray-800 dark:text-gray-100" {...props} />,
              p: ({node, ...props}) => <p className="text-sm mb-3 text-gray-700 dark:text-gray-300" {...props} />,
              ul: ({node, ...props}) => <ul className="text-sm list-disc pl-5 mb-4 text-gray-700 dark:text-gray-300" {...props} />,
              li: ({node, ...props}) => <li className="mb-1" {...props} />,
              a: ({node, ...props}) => <a className="text-sm underline" target="_blank" rel="noopener noreferrer" {...props}/>
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
} 