# Occupancy Tracker
Project to estimate the number of people in a room by reading mac addresses transmitted with a wifi adapter in monitor mode.

## Device Requirements
Using a RasberryPi (or similar) 
[install Kali linux](https://medium.com/@jithinnambiarj19/aircrack-ng-tools-for-wi-fi-sniffing-on-raspberry-pi-4s-internal-network-adapter-436d82473161).

You will also need NodeJS/NPM installed on the Pi. Kali linux should include 'airodump-ng' the program used to read the wifi in monitor mode. 

The RaspberryPi can monitor 2.4Ghz WiFi but it does not support 5Ghz, also to be connected to wifi for internet the adapter cannot be in monitor mode. An external adapter solves these issues.

[Adapter that works with airodump](https://www.amazon.com/gp/product/B00VEEBOPG) and [drivers](https://forums.kali.org/showthread.php?50408-Kali-2020-2-ALFA-AWUS036ACH).

## Building / Running
Checkout this repository with Git

Install dependencies: `npm install`

Build code: `npm build`

Run code: `sudo node ./build/src/app.js`