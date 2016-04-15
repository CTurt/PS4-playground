# PS4-playground
A collection of PS4 tools and experiments using the WebKit exploit. This is for firmware 1.76 only at the moment.

Although initially just a framework to help write and execute ROP chains, the playground now allows for running unsigned binaries compiled with the [PS4-SDK](https://github.com/CTurt/PS4-SDK), and booting Linux from USB.

## Setup
A live demo can be tried [here](http://cturt.github.io/PS4-playground/).

You should clone the repo and upload it your own server if you wish to make changes:

    git clone git://github.com/CTurt/PS4-playground.git

You can also download a zip of the latest source [here](https://github.com/CTurt/PS4-playground/archive/gh-pages.zip).

## Usage
After executing a test, you should either refresh the page, or close and reopen the browser entirely; running multiple experiments sequentially is not reliable. If you are using a web browser view in an app which isn't the Internet Browser, you can use the `Refresh` button under `Misc` to refresh the page.

### Code Execution
Click "Go", and wait for the text "Stage: Waiting for payload..." to appear.

Send the desired binary over TCP to your PS4 on port 9023; you can use any standard networking tool to do this, or my custom Windows tool, [WiFi-Loader](https://github.com/CTurt/WiFi-Loader)

If you're on Linux, the easiest way is probably to use `netcat`:

    nc -w 3 192.168.0.7 9023 < *.bin

After you have sent the binary, it will be executed automatically.

### Linux loader
You need a FAT32 formatted USB drive plugged in on any PS4's USB port with the following files on the root directory:

`bzImage` : Kernel image that will be loaded. Recommended to use [this sources](https://github.com/fail0verflow/ps4-linux/tree/ps4-xhci-wip) to compile it.

`initramfs.cpio.gz` : The initial file system that gets loaded into memory during the Linux startup process. [This one](https://github.com/slashbeast/better-initramfs) is recommended.

The file names must match with the above and you can have more files on the same USB drive. From there you can setup the environment to run from an NFS share or from an external drive via USB (recommended) and boot a complete distro!

### Syscalls
`Get PID` - Get process ID

`Get Login` - Get login name and leak a kernel pointer

### Modules
`Get Loaded Modules` - Get a list of currently loaded modules, index and ID

`Dump Loaded Module` - Dump a currently loaded module (use `Get Loaded Modules` to see all available)

`Load Module` - Load an additional module from [this list](http://www.psdevwiki.com/ps4/Libraries#Libraries_on_firmware_1.76)

Once you have loaded a module, refresh the page, and you will be able to dump it.

### Filesystem
`Browse` - File Browser

`Get PSN username` - Read your PSN username from `account.dat`

`Get Sandbox Directory` - Get the name of the current sandbox directory (10 random characters which change each reboot)

### Memory
`Get Stack Protection` - Get stack base, size, and protection

`Get Stack Name` - Get stack base, size, and name

### Socket
`Send Message` - Send a TCP message to the specified IP and port

## Receiving data
File and memory dumps will be sent over TCP to the IP and port you specified.

You can use a simple tool like [TCP-Dump](https://github.com/CTurt/TCP-Dump) to write the data to a file.
