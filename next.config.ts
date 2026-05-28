import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/OtpSend',
        destination: '/otp-send',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
