const path = require("path");

module.exports = {
  apps: [
    {
      name: "automystics-api",
      cwd: path.resolve(__dirname, "..", "artifacts", "api-server"),
      script: "dist/index.mjs",
      interpreter: "node",
      // --env-file loads artifacts/api-server/.env at boot (Node >= 20.6)
      node_args: "--enable-source-maps --env-file=.env",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
      },
      out_file: "/var/log/automystics/api.out.log",
      error_file: "/var/log/automystics/api.err.log",
      merge_logs: true,
      time: true,
    },
  ],
};
