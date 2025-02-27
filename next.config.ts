import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  env:{
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL,
  },


image:{
  domains: ['res.cloudinary.com'],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
    }
  ]
},

webpack: (config) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    "@components": "./components",
    "utils": "./utils",
    };
    return config;
  },
 
};

export default nextConfig;
