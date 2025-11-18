# LFS Flasher

## Features

### Flash command

Using the `/o flash` command switches between low and high beam every 100 milliseconds for 6 times.

#### Mode selection

In `config.txt`, you can set the headlight flashing mode:

- `mode = "high"` - driving headlights are high beam, flashing lights are low beam
- `mode = "low"` - driving headlights are low beam, flashing lights are high beam

## Development

### Installation

```shell
corepack enable
pnpm install
```

### Development build

```shell
pnpm dev
```

The app connects to `127.0.0.1:29999` by default.

### Custom configuration

Copy `config.txt` to `config.local.txt`, it will take precedence.

### Production build

```shell
pnpm build
pnpm package
```
