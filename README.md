# Occupancy Tracker
Project to estimate the number of people in a room by detecting wifi communication from devices people carry on them (cellphone/laptop). Using a WiFi adapter in monitor mode the MAC address and signal strgenth of active WiFi devices in range are obtained. Then analysis is done to remove long term non-people devices like printers and lab-computers, then number of people in range is estimated using heuristics to account for multiple devices on one person. 

## Device Requirements
Using a RasberryPi (or similar) 
[install Kali linux](https://medium.com/@jithinnambiarj19/aircrack-ng-tools-for-wi-fi-sniffing-on-raspberry-pi-4s-internal-network-adapter-436d82473161).

You will also need NodeJS/NPM installed on the Pi. Kali linux should include 'airodump-ng' the program used to read the wifi in monitor mode. 

The RaspberryPi can monitor 2.4Ghz WiFi but it does not support 5Ghz, also to be connected to wifi for internet the adapter cannot be in monitor mode. An external adapter solves these issues.

[Adapter that works with airodump](https://www.amazon.com/gp/product/B00VEEBOPG) and [drivers](https://forums.kali.org/showthread.php?50408-Kali-2020-2-ALFA-AWUS036ACH).

## Building / Running Code
* Requirements:
    * [Git installed](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
    * [Node JS & NPM Instaled](https://nodejs.org/en/download/)

Checkout this repository with Git:

`git clone https://github.com/Hawks-Code/Occupancy-Tracker.git`

Open the repository you just cloned: `cd Occupancy-Tracker`

Install dependencies: `npm install`

Build code: `npm run build`

Run code: `sudo node ./build/src/app.js`

## Notes 
### VS Code SFTP to RaspberryPi 
For easy code deployment / development use VS Code + https://marketplace.visualstudio.com/items?itemName=Natizyskunk.sftp

> NOTE: Sync only the current dir or file, syncing all files will sync node_modules and take forever and probablly break things!!!

### Airodump-ng
This is the program used to control and read from the WiFi adapter in monitor mode. 

Docs: https://www.aircrack-ng.org/doku.php?id=airodump-ng explain what data is captured and output.

