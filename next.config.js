/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'www.aranacorp.com',
      'cdn.sparkfun.com',
      'upload.wikimedia.org',
      'www.arduino.cc',
      'a.pololu-files.com',
    ],
  },
};

module.exports = nextConfig;
