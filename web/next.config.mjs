const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: [],
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
