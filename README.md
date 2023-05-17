# NACSOS Web Interface

This repository hosts the client-side interface code for the NACSOS platform.
Steps to set up your local development environment are described below.

## Project setup

If you are on an old machine with Ubuntu 18, you will need a lower version of node
```
nvm install v16.18.1
```

```
npm install
```

### Update API clients  
When changes were made to the API(s), the respective client(s) need to be adapted  via
```
# update code in src/plugins/api/api-core for NACSOS Core FastAPI endpoint
npm run api-core
# update code in src/plugins/api/api-pipe for NACSOS Pipelines FastAPI endpoint
npm run api-pipe
```

This operation assumes that you have [*openapi-typescript-codegen*](https://www.npmjs.com/package/openapi-typescript-codegen) installed. 
Note, that the "official" version is does not expose a way to set `AxiosRequestConfig` by the caller.
Hence, we need an adapted version of the project, which is hosted [in our GitLab](https://gitlab.pik-potsdam.de/mcc-apsis/nacsos/openapi-typescript-codegen).
The most recent build should be committed to this repository in `tools/openapi-gen/`.

We should probably clean up this change and submit a PR to the original maintainer.

### Compiles and hot-reloads for development
```
npm run serve
```

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

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## Attributions

* `public/img/Portata_Naxos_26.jpg` taken from https://commons.wikimedia.org/wiki/File:Portara_Naxos_26.jpg