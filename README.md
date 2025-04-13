# greenwood-demo-adapter-aws

A demonstration repo for deploying a full-stack [**Greenwood**](https://www.greenwoodjs.dev/) app with AWS and [**SST**](https://sst.dev/) for static hosting and deploying serverless functions.

## Setup

To run locally
1. Clone the repo
1. Run `npm ci`

You can now run these npm scripts locally:
- `npm run dev` - Start the demo with Greenwood local dev server
- `npm run serve` - Start the demo with a production Greenwood build

## Demo

This repo aims to demonstrate a couple of Greenwood's features ([API Routes](https://www.greenwoodjs.dev/docs/pages/api-routes/) and [SSR pages](https://www.greenwoodjs.dev/docs/pages/server-rendering/)) leveraging Netlify's serverless and edge function capabilities, focused on using Web Components (WCC) and Web Standards to deliver the content for the demo.

## Status

|Feature    |Greenwood |Lambda |
|---------- |----------|-------|
|API Routes |   ✅     |   ✅  |
|SSR Pages  |   ✅     |   ✅  |

You can see the live demo at [https://d3fe41uuvgfj7o.cloudfront.net/](https://d3fe41uuvgfj7o.cloudfront.net/).

## Serverless

The serverless demos include the following examples:

### API Routes

- ✅  [`/api/greeting?name{xxx}`](https://d3fe41uuvgfj7o.cloudfront.net/api/greeting) - An API that returns a JSON response and optionally uses the `name` query param for customization.  Otherwise returns a default message.
- ✅ [`/api/fragment`](https://d3fe41uuvgfj7o.cloudfront.net/api/fragment) - An API for returning fragments of server rendered Web Components as HTML, that are then appended to the DOM.  The same card component used in SSR also runs on the client to provide interactivity, like event handling.
- ✅ [`/api/search`](https://d3fe41uuvgfj7o.cloudfront.net/api/event) - An API for handling a search using  `request.formData()`
- ✅ [`/api/event`](https://d3fe41uuvgfj7o.cloudfront.net/api/event) - An API for mimicking a webhook `POST` request that uses `request.json()`

### SSR Pages

- ✅ [`/products/`](https://d3fe41uuvgfj7o.cloudfront.net/products/) - SSR page for rendering Greenwood pages.