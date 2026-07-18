/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  allowedDevOrigins: [
    "include-naval-xml-outstanding.trycloudflare.com",
  ],
};


export default nextConfig;
