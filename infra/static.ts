export const frontend = new sst.aws.StaticSite("Greenwood_Static", {
  path: "./",
  build: {
    output: "public",
    // we already run the build as part of CI
    // command: "npm run build",
  },
})