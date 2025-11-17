module.exports = {
  apps: [
    {
      name: "mentora-frontend",
      script: ".output/server/index.mjs",
      exec_mode: "fork",
      env: {
        PORT: 3009,
        NODE_ENV: "production",
      },
    },
  ],
};
