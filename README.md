# PS4-playground
A collection of PS4 tools and experiments using the WebKit exploit. This is for firmware 1.76 only at the moment.

## Setup
A live demo can be tried [here](http://cturt.github.io/PS4-playground/), without module dumping.

You should clone the repo and upload it your own server to have module dumping capabilities:

    git clone git://github.com/CTurt/PS4-playground.git

You can also download a zip of the latest source [here](https://github.com/CTurt/PS4-playground/archive/gh-pages.zip).

## Usage
Although this is this primarily a framework to help write and execute ROP chains, PS4-playground comes with several experiments for you to try.

After executing a test, you should either refresh the page, or close and reopen the browser entirely; running multiple experiments sequentially is not reliable.

### Syscalls
`Get PID` - Get process ID

`Get Thread ID` - Get thread ID

`Get Login` - Get login name and leak a kernel pointer

### Modules
`Get Loaded Modules` - Get a list of currently loaded modules

`Dump Loaded Module` - Dump a currently loaded module (use `Get Loaded Modules` to see all available)

`Load and Dump Module` - Load an additional module and dump it (see all available [here](http://www.ps3devwiki.com/ps4/Libraries#Libraries_on_firmware_1.76))

Once you have dumped a module, you will need to run `dir2bin.py` to combine all chunks, and convert to binary.

### Filesystem
`Open /dev/` - Get a list of devices

`Get Sandbox Directory` - Get the name of the current sandbox directory (10 random characters which change each reboot)