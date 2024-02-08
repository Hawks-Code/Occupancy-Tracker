import { AirodumpFrame, Station } from "./parser.js";

export class Analyzer {

    clientAddresses = new Map<string, Station>()

    processFrame(frame: AirodumpFrame) {
        frame.stations.forEach(station => {
            this.clientAddresses.set(station.STATION, station)
        })
    }

    getClientDevices() {
        return this.clientAddresses
    }
}