module.exports = {
  apps: [
    {
      name: 'dashboard',
      script: './node_modules/.bin/nuxt',
      args: 'start',
      wait_ready: true,
      listen_timeout: 5000,
      env: {
        HOST: '0.0.0.0',
        PORT: 22000,
        NODE_ENV: 'production',
      },
    },
  ],
};
