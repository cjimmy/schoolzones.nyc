'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css'; // Make sure Leaflet CSS is imported here

// Dynamically import the entire Map component
const Map = dynamic(
  () => import('./Map'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="h-screen w-screen">
      <Map />
    </div>
  );
}
