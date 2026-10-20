const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "thumb.wikimedia.org", pathname: "/wikipedia/commons/thumb/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/wikipedia/commons/**" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.td-fahrzeugcodierung.de",
          },
        ],
        destination: "https://td-fahrzeugcodierung.de/:path*",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
