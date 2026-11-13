# NACSOS Web Interface

This repository hosts the client-side interface code for the NACSOS platform.
Steps to set up your local development environment are described below.

## Project setup

If you are on an old machine with Ubuntu 18, you will need a lower version of node
```
nvm install v24.11.1
```

```
npm install
```

### Update API clients  
When changes were made to the API(s), the respective client(s) need to be adapted  via
```
# update code in src/plugins/api/spec for NACSOS backend
npm run api
```

### Update NQL Grammar
The grammar should be kept up-to-date with that used in the backend.
Unfortunately, there are slight differences in the grammar for the grammar, so this has to be done manually.
Once you edit the `grammar.ne` file, you need to compile it to javascript via `npm run nql`.


### Compiles and hot-reloads for development
```
npm run serve
```

### Running against the public API (CORS proxy)
The browser blocks cross-origin calls to the public API, so for local development against it you can
run the dev server behind a proxy. Enable it by setting two variables (e.g. in `.env.development`):

```
# point the app's core URL at the dev server itself, under a path prefix
VITE_NACSOS_CORE_URL=http://127.0.0.1:8080/proxy-core
# the public API the dev server should forward that prefix to
VITE_PROXY_CORE_TARGET=https://<public-api-host>
```

With both set, `vite.config.ts` starts the dev server on the host/port of `VITE_NACSOS_CORE_URL` and
proxies every request under its path prefix (`/proxy-core` above) to `VITE_PROXY_CORE_TARGET`,
stripping the prefix, rewriting the `Origin`/`Host` headers and the response cookie domains.
The browser therefore only ever talks to `http://127.0.0.1:8080`, so no CORS errors occur.

Leave `VITE_PROXY_CORE_TARGET` unset (the default) to disable the proxy and use the variables as before.

### Compiles and minifies for production
```
npm run build
# or for debugging
npm run build-dev
```

### Lints and fixes files
```
npm run lint
```

### Check for dependency updates
See [npm](https://www.npmjs.com/package/npm-check-updates) for more details or just run
```
ncu
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Attributions

* `public/img/Portata_Naxos_26.jpg` taken from https://commons.wikimedia.org/wiki/File:Portara_Naxos_26.jpg