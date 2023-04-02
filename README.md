# Currency Converter

This repository contains code for a currency converter APP. It's built using React, React Query and Styled Components.

## Data Source

I'm using API from [Czech National Bank](https://www.cnb.cz/en/faq/Format-of-the-foreign-exchange-market-rates/).

## Installation

To install all requirements for the app, run:

```bash
yarn install
```

## Development

Since CNB API is not CORS enabled, I'm using custom mockup server to serve data. It's located in `server`
directory.

To start the server, run:

```bash
cd mock_server
node src/server.js
```

Make sure, that file `/mock_server/public/daily.txt` exists and is up-to-date. It's a source for all responses from
the mockup server.

## Deployment

To deploy the app, run:

```bash
yarn run deploy
```
