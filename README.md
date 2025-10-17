# NC News Back End

## Installation

Using npm:

```terminal
npm i
```

Using pnpm:

```terminal
pnpm i
```

## Setup

By default this project comes with a local .env file that sets your NODE_ENV environment variable to 'development'. In order to set up the development and test databases you will need to add two files to your `/config` folder; `devKeys.js` and `testKeys.js`. These files each export an object in the same form as you will find in the `/config/prodKeys.js` file and you will need to define the value of PGDATABASE in each one respectively to point to your development and test databases. In this case you will need to add the value `nc_news` to `devKeys.js` and `nc_news_test` to `devKeys.js`. Your finished files should look like this:

`devKeys.js`

```js
module.exports = {
  PGDATABASE: 'nc_news'
};
```

`testKeys.js`

```js
module.exports = {
  PGDATABASE: 'nc_news_test'
};
```

## DB Structure

An ERD for this project can be found [here](https://dbdiagram.io/d/nc_news-68f21de92e68d21b41f6ff06).
