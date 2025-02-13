import fs from 'fs/promises';
import path from 'path';
import { checkResourceExists } from '@greenwood/cli/src/lib/resource-utils.js';

const DEFAULT_RUNTIME = 'nodejs20.x';

// https://vercel.com/docs/functions/serverless-functions/runtimes/node-js#node.js-helpers
function generateOutputFormat(id, type) {
  const handlerAlias = '$handler';
  const path = type === 'page'
    ? `${id}.route`
    : id;

  // TODO is this the right shape of the handler params???
  return `
    import { handler as ${handlerAlias} } from './${path}.js';

    export async function handler (event, context) {
      console.log({ event });
      console.log({ context });
      const { body, rawPath, rawQueryString, headers = {} } = event;
      const method = event.routeKey.split(' ')[0];
      const queryParams = rawQueryString === '' ? '' : \`?\${rawQueryString}\`;
      const contentType = headers['content-type'] || '';
      console.log({ method, queryParams });
      let format = body;

      if (['GET', 'HEAD'].includes(method.toUpperCase())) {
        format = null
      } else if (contentType.includes('application/x-www-form-urlencoded') && event.isBase64Encoded) {
        const formData = new FormData();
        const formParams = new URLSearchParams(atob(body));

        console.log({ formParams });
        formParams.forEach((value, key) => {
          console.log({ key, value });
          formData.append(key, value);
        });
        // for (const key of Object.keys(formParams)) {
        //   formData.append(key, formParams[key]);
        // }

        // when using FormData, let Request set the correct headers
        // or else it will come out as multipart/form-data
        // https://stackoverflow.com/a/43521052/417806
        format = formData;
        delete headers['content-type'];
        console.log({ formData });
      } else if(contentType.includes('application/json')) {
        format = JSON.stringify(body);
      }

      const req = new Request(new URL(\`\${rawPath}\${queryParams}\`, \`http://\${headers.host}\`), {
        body: format,
        headers: new Headers(headers),
        method
      });

      // https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html#apigateway-example-event
      const res = await $handler(req);

      return {
        "body": await res.text(),
        "statusCode": res.status,
        "headers": Object.fromEntries(res.headers)
        // "isBase64Encoded": false,
        // "multiValueHeaders": { 
        //   "X-Custom-Header": ["My value", "My other value"],
        // },
      }
    }
  `;
}

async function setupFunctionBuildFolder(id, outputType, outputRoot, runtime) {
  const outputFormat = generateOutputFormat(id, outputType);

  await fs.mkdir(outputRoot, { recursive: true });
  await fs.writeFile(new URL('./index.js', outputRoot), outputFormat);
  await fs.writeFile(new URL('./package.json', outputRoot), JSON.stringify({
    type: 'module'
  }));
  // TODO not needed?
  // await fs.writeFile(new URL('./.vc-config.json', outputRoot), JSON.stringify({
  //   runtime,
  //   handler: 'index.js',
  //   launcherType: 'Nodejs',
  //   shouldAddHelpers: true
  // }));
}

async function awsAdapter(compilation, options) {
  const { runtime = DEFAULT_RUNTIME } = options;
  const { outputDir, projectDirectory } = compilation.context;
  const { basePath } = compilation.config;
  // TODO should we use something other than .aws for the output folder?
  const adapterOutputUrl = new URL('./.aws-output/', projectDirectory);
  const ssrPages = compilation.graph.filter(page => page.isSSR);
  const apiRoutes = compilation.manifest.apis;

  if (!await checkResourceExists(adapterOutputUrl)) {
    await fs.mkdir(adapterOutputUrl, { recursive: true });
  }

  // TODO ?
  // await fs.writeFile(new URL('./.vercel/output/config.json', projectDirectory), JSON.stringify({
  //   'version': 3
  // }));

  // TODO
  // for (const page of ssrPages) {
  //   const outputType = 'page';
  //   const { id, outputHref } = page;
  //   const outputRoot = new URL(`./routes/${basePath}/${id}/`, adapterOutputUrl);
  //   const chunks = (await fs.readdir(outputDir))
  //     .filter(file => file.startsWith(`${id}.route.chunk`) && file.endsWith('.js'));

  //   await setupFunctionBuildFolder(id, outputType, outputRoot, runtime);

  //   // handle user's actual route entry file
  //   await fs.cp(
  //     new URL(outputHref),
  //     new URL(`./${outputHref.replace(outputDir.href, '')}`, outputRoot),
  //     { recursive: true }
  //   );

  //   // and any (URL) chunks for the page
  //   for (const chunk of chunks) {
  //     await fs.cp(
  //       new URL(`./${chunk}`, outputDir),
  //       new URL(`./${chunk}`, outputRoot),
  //       { recursive: true }
  //     );
  //   }
  // }

  for (const [key, value] of apiRoutes.entries()) {
    const outputType = 'api';
    const { id, outputHref } = apiRoutes.get(key);
    const outputRoot = new URL(`.${basePath}/api/${id}/`, adapterOutputUrl);
    const { assets = [] } = value;

    await setupFunctionBuildFolder(id, outputType, outputRoot, runtime);

    await fs.cp(
      new URL(outputHref),
      new URL(`./${id}.js`, outputRoot),
      { recursive: true }
    );

    for (const asset of assets) {
      const name = path.basename(asset);

      await fs.cp(
        new URL(asset),
        new URL(`./${name}`, outputRoot),
        { recursive: true }
      );
    }
  }

  // TODO not needed, right?
  // static assets / build
  // await fs.cp(
  //   outputDir,
  //   new URL('./.vercel/output/static/', projectDirectory),
  //   {
  //     recursive: true
  //   }
  // );
}

const greenwoodPluginAdapterAws = (options = {}) => [{
  type: 'adapter',
  name: 'plugin-adapter-aws',
  provider: (compilation) => {
    return async () => {
      await awsAdapter(compilation, options);
    };
  }
}];

export { greenwoodPluginAdapterAws };