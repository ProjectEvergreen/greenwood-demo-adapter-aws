import { greenwoodPluginAdapterAws } from "@greenwood/plugin-adapter-aws";
import type { Config } from "@greenwood/cli";

export default {
  plugins: [
    greenwoodPluginAdapterAws()
  ]
} satisfies Config;