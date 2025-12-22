# LFS Flasher

## Features

### Flash command

Typing `/o flash` into the chat input switches from low to high beam every 100 milliseconds for 6 times.

## Development

### Installation

```shell
corepack enable
yarn install
```

### Development build

```shell
yarn dev
```

The app connects to `127.0.0.1:29999` by default.

### Custom configuration

Copy `config.txt` to `config.local.txt`, it will take precedence.

### Production build

```shell
yarn build
yarn package
```
