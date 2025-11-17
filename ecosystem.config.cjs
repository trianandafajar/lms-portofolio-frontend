module.exports = {
  apps: [
    {
      name: "Mentora LMS Frontend",
      port: "3009",
      exec_mode: "cluster",
      instances: "max",
      script: "./.output/server/index.mjs",
    },
  ],
};
