import { execSync, spawn } from "child_process"
import { AirodumpFrame, Parser, Station } from "./parser"
import { Analyzer } from "./analyzer"
import * as pty from "node-pty" // using node-pty b/c OS spawn was truncating cols to 80 chars

const ADAPTER = 'wlan1' // change to wlan0 if only using RPi built in adapter
const REMEBER_MAC_FOR_SEC = '30' // TODO: tune this, its how long airodump will keep outputting a device after it was last seen.

const analyzer = new Analyzer()
const parser = new Parser()

enableMonitorMode()
const airodumpPty = pty.spawn('sh', [], { cols: 150, rows: 300, })

airodumpPty.onData(parser.processData)
parser.onFrame((frame) => {
    analyzer.processFrame(frame)
    const clientDevices = analyzer.getClientDevices();

    [...clientDevices.values()]
        .sort((a: Station, b: Station) => {
            return Number.parseInt(a.PWR) > Number.parseInt(b.PWR) ? 1 : -1;
        })
        .forEach((station: Station) => {
            console.log(`${station.STATION} = ${station.PWR}`)
        })

    const myMac = '7A:3A:D1:BE:44:A8'
    if (clientDevices.has(myMac)) {
        console.log(`Phone Strength: ${clientDevices.get(myMac)?.PWR}`)
    } else {
        console.log('NOT FOUND')
    }
})

airodumpPty.write(`airodump-ng ${ADAPTER} --band abg --berlin ${REMEBER_MAC_FOR_SEC}\r`);

function enableMonitorMode() {
    execSync(`ifconfig ${ADAPTER} down`)
    execSync(`iwconfig ${ADAPTER} mode monitor`)
    execSync(`ifconfig ${ADAPTER} up`)
}
