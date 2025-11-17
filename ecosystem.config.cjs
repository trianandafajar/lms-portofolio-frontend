module.exports = {
  apps: [
    {
      name: "mentora-frontend",
      port: "3009",
      exec_mode: "cluster",
      instances: "max",
      script: "./.output/server/index.mjs",
    },
  ],
};
