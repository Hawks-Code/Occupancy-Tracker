import { AirodumpFrame, Station } from "./parser.js";

export class Analyzer {

    private storedAddresses = new Map<String, TrackedMac>()

    processFrame(frame: AirodumpFrame) {
        frame.stations.forEach(station => {
            if (!this.storedAddresses.has(station.STATION)) {
                this.storedAddresses.set(station.STATION, new TrackedMac(station))
            }

            const trackedMac = this.storedAddresses.get(station.STATION)!

            /* TODO: TEST THIS ASSUMPTION: I'm making an assumption that Frames will increase each time a device is seen.
            Therefore if it hasent changed the device has not been detected again; its just in the memory of airodump-ng.
            Only update trackedMac's historical data when its a new time being detected, eg: # frames != old frames.
            */
            if (station.Frames != trackedMac.lastStation.Frames) {
                trackedMac.addHistoricalData(station)
            }
        })

        this.forgetOldMacs()
    }

    sanatizeData() {
        let data = [...this.storedAddresses.values()]
        data = filterNonHumanDevices(data)
        data = filterBySignalStrength(data)
        return data
    }

    getCurrentPopulationEstimate(): number {
        const data = this.sanatizeData()
        return estimatePopulationFromData(data)
    }

    // TODO: Implment me! I should go through the map of storedAddesses and delete the ones which are old and should no longer be considered present
    // https://github.com/Hawks-Code/Occupancy-Tracker/issues/1
    forgetOldMacs() {

    }

    printData() {
        this.sanatizeData().filter(
            mac => mac.lastSeen > new Date(Date.now() - 5 * 60 * 1000) // filter older than 5 minutes
        ).sort((a: TrackedMac, b: TrackedMac) => {
            return a.lastStation.PWR > b.lastStation.PWR ? -1 : 1 // sort by signal strength
        })
        .forEach(item => {
            const sta = item.lastStation
            console.log(`${sta.STATION} - PWR: ${sta.PWR} Last Seen: ${item.lastSeen.toUTCString()}`)
        })
    }
}

class TrackedMac {
    public lastStation: Station
    readonly historicalData: TrackedMacHistory[] = []

    get lastSeen(): Date {
        return this.historicalData[0].seen
    }

    constructor(station: Station) {
        this.lastStation = station
        this.addHistoricalData(station)
    }

    addHistoricalData(station: Station) {
        this.lastStation = station
        this.historicalData.unshift({
            seen: new Date(),
            power: station.PWR
        })
    }
}

type TrackedMacHistory = {
    seen: Date
    power: number
}

//TODO: Implement ME!!! https://github.com/Hawks-Code/Occupancy-Tracker/issues/2
function filterNonHumanDevices(data: TrackedMac[]): TrackedMac[] {
    return data;
}

//TODO: Implement ME!!! https://github.com/Hawks-Code/Occupancy-Tracker/issues/3
function filterBySignalStrength(data: TrackedMac[]): TrackedMac[] {
    return data.filter(mac => {
        return mac.historicalData.find(item => { 
            return item.power != -1 && item.power > -51
        }) != undefined
    })
}

//TODO: Implement ME!!! https://github.com/Hawks-Code/Occupancy-Tracker/issues/4
function estimatePopulationFromData(data: TrackedMac[]): number {
    return data.length
}
