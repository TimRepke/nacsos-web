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