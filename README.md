# NACSOS Web Interface

This repository hosts the client-side interface code for the NACSOS platform.
Steps to set up your local development environment are described below.

## Project setup
```
npm install
```

### Update API clients  
When changes were made to the API(s), the respective client(s) need to be adapted via
```
# update code in src/plugins/client-core for NACSOS Core FastAPI endpoint
npm run api-core
# update code in src/plugins/client-core for NACSOS Pipes FastAPI endpoint
npm run api-pipe
```

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