# heimdalerp-client

> A small open source ERP written in Vue.js.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests (not implemented)
npm run unit

# run e2e tests (not implemented)
npm run e2e

# run all tests
npm test
```

## Configure the environment
This guide assumes you have loaded the corresponding accounting and invoice fixtures.

Log into the REST API with your superuser account.
Head to `/api/geo/localities/` and create the locality of your company.
Head to `/api/invoice_ar/companies/1/` and fill in your company data.

Log into the client.
Head to `/accounting/pointsofsale` and set up your points of sale.
