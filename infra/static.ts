export const frontend = new sst.aws.StaticSite("Greenwood_Static", {
  path: "./",
  build: {
    output: "public",
    command: "npm run build",
  },
})