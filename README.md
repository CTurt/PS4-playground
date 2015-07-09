# PS4-playground
A collection of PS4 tools and experiments using the WebKit exploit. This is for firmware 1.76 only at the moment.

## Setup
A live demo can be tried [here](http://cturt.github.io/PS4-playground/), without module dumping.

You should clone the repo and upload it your own server to have module dumping capabilities:

    git clone git://github.com/CTurt/PS4-playground.git

You can also download a zip of the latest source [here](https://codeload.github.com/CTurt/PS4-playground/zip/master).

## Usage
Although this is this primarily a framework to help write and execute ROP chains, PS4-playground comes with several experiments for you to try:

### Syscalls
`Get PID` - Get process ID
`Get Login` - Get login name and leak a kernel pointer

### Modules
`Get Loaded Modules` - Get a list of currently loaded modules
`Dump Loaded Module` - Dump a currently loaded module (use `Get Loaded Modules` to see all available)
`Load and Dump Module` - Load an additional module and dump it (see all available [here](http://www.ps3devwiki.com/ps4/Libraries#Libraries_on_firmware_1.76))

### Filesystem
`Open /dev/` - Get a list of devices

After executing a test, you should either refresh the page, or close and reopen the browser entirely; running multiple experiments sequentially is not reliable.