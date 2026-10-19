const nextConfig = {
  reactStrictMode: true,
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
