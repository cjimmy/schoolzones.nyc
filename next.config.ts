import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.geojson': {
          loaders: ['json'],
          as: 'json'
        }
      }
    }
  }
};
  

export default nextConfig;
