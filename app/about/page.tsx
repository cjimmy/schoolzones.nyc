/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import ReactMarkdown from 'react-markdown';
import Header from '../components/Header';

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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 py-8 pt-16">
        <article className="prose dark:prose-invert prose-lg mx-auto">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-gray-100" {...props} />,
              p: ({node, ...props}) => <p className="mb-4 text-gray-700 dark:text-gray-300" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-6 text-gray-700 dark:text-gray-300" {...props} />,
              li: ({node, ...props}) => <li className="mb-2" {...props} />,
              a: ({node, ...props}) => <a className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer" {...props}/>
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
} 