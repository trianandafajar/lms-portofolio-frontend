module.exports = {
  apps: [
    {
      name: "mentora-frontend",
      port: "3009",
      exec_mode: "fork",
      script: "./.output/server/index.mjs",
    },
  ],
};
