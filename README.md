# 3axis cli-chat

Work-in-progress. For connecting a single-user or team via websocket to remote APIs or server-side functions (e.g. dynamic/LLM-generated templates)

## Install
```
npm install
node index
```
Open localhost:8000 in browser

## Usage

### Basic chat echo. Open two tabs of localhost:8000 + console in each

In console type `msg('your message here')`. Other users will see the message in their console

-----
### Basic command

sytanx is always 3 words at the moment `lib method stringArgument`

wire in libs/`{lib}`.js and put `{method}` function in module.exports with single argument for `{stringArgument}`

Then in console, e.g. `cmd('twitter getUserTL barackobama')`

If you need to pass more than a string use `JSON.stringify` to send the third argument and `JSON.parse` to receive in lib

### Communicating from server to client with results of commands or other server messages

In progress: `tellUser` or `tellAll` in index.js can be used to relay updates to DOM

-----
## Info

Currently requires browser dev console to send messages to group chat or commands to Twitter API.

### Spawning objects

See [vanilla repository](https://github.com/3axis-io/vanilla) for outputing images, videos, 3d models in HTML <body>

