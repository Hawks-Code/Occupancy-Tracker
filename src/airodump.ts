import { execSync, spawn } from "child_process"
import * as pty from "node-pty" // using node-pty b/c OS spawn was truncating cols to 80 chars
import { AirodumpFrame, AirodumpParser } from "./parser"


const ADAPTER = 'wlan1' // change to wlan0 if only using RPi built in adapter
const REMEBER_MAC_FOR_SEC = '30' // TODO: tune this, its how long airodump will keep outputting a device after it was last seen.

export class Airodump {
    private parser = new AirodumpParser()

    run() {
        enableMonitorMode()
        const airodumpPty = pty.spawn('sh', [], { cols: 150, rows: 300, })

        airodumpPty.onData((data) => this.parser.processData(data))

        airodumpPty.write(`airodump-ng ${ADAPTER} --band abg --berlin ${REMEBER_MAC_FOR_SEC}\r`)

        console.log('Airodump-ng Started!')
    }

    onData(listener: (arg0: AirodumpFrame) => void) {
        this.parser.onFrame(listener)
    }
}

function enableMonitorMode() {
    execSync(`ifconfig ${ADAPTER} down`)
    execSync(`iwconfig ${ADAPTER} mode monitor`)
    execSync(`ifconfig ${ADAPTER} up`)
}
