import os from 'os'
import { EventEmitter } from 'events';

export type AirodumpFrame = {
    handshake: string
    stations: Station[]
    aps: AccessPoint[]
}

// BSSID              STATION            PWR   Rate   Lost  Frames  Notes  Probes
export type Station = {
    BSSID: string
    STATION: string
    PWR: string
    Rate: string
    Lost: string
    Frames: string
    Notes: string
    Probes: string
}

// BSSID              PWR  Beacons    #Data, #/s  CH  MB   ENC  CIPHER AUTH ESSID
export type AccessPoint = {
    BSSID: string
    PWD: string
    Beacons: string
    '#Data': string
    '#/s': string
    CH: string
    MB: string
    ENC: string
    CIPHER: string
    AUTH: string
    ESSID: string
}

const OUTPUT_START = "\x1B[2;1H\x1B[22m\x1B[37m"
const ANSI_REGEX = new RegExp('[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))', 'g');

export class Parser {
    private outputBuffer = ""
    private emitter = new EventEmitter()

    // node-pty spits out data in chunks, sometimes breaking up lines, need to buffer until a complete output is recieved
    processData(data: string) {
        this.outputBuffer = this.outputBuffer.concat(data)

        if (this.shouldParseOutputBuffer()) {
            const { output, buffer } = this.splitOutputBuffer()
            this.outputBuffer = buffer;

            const frame = this.parseAirodumpFrame(output)
            this.emitter.emit('frame', frame)
        }
    }

    onFrame(listener: (arg0: AirodumpFrame) => void) {
        this.emitter.on('frame', listener)
    }

    shouldParseOutputBuffer(): boolean {
        const numOutputHeaders = this.outputBuffer.split(OUTPUT_START).length - 1

        // we have the complete output once the next output starts
        if (numOutputHeaders > 1) {
            return true
        }
        return false
    }

    splitOutputBuffer(): { output: string, buffer: string } {
        const firstStartIndex = this.outputBuffer.indexOf(OUTPUT_START)
        const secondStartIndex = this.outputBuffer.indexOf(OUTPUT_START, (firstStartIndex + OUTPUT_START.length))

        return {
            output: this.outputBuffer.slice(0, secondStartIndex),
            buffer: this.outputBuffer.slice(secondStartIndex)
        }
    }

    /**
     * Adapted from https://github.com/alnn/node-aircrack-ng/blob/master/libs/parser.js
     * That package requires linux (for no real reason) which makes deving on a mac a pain.
     */
    parseAirodumpFrame(data: string): AirodumpFrame {
        const lines = this.cleanData(data)

        const headers = [
            'BSSID PWR Beacons #Data, #/s CH MB ENC CIPHER AUTH ESSID',
            'BSSID STATION PWR Rate Lost Frames Notes Probes'
        ];

        let result: AirodumpFrame = { handshake: '', stations: [], aps: [] }
        let headLine = ''
        let headChunks: string[] = []
        let headPrefix: string = ''

        for (let i = 0; i < lines.length; i++) {

            if (lines[i].match(/Elapsed/)) {
                let chunks = lines[i].split('][');
                const lastIndex = chunks.length - 1;
                const handshakeIndex = chunks[lastIndex].indexOf('handshake');
                if (~handshakeIndex) {
                    result.handshake = chunks[lastIndex].substr(handshakeIndex + 10).trim();
                }
                continue;
            }
            if (!lines[i].trim()) {
                continue;
            }

            // Detect header
            let headerIndex = headers.indexOf(lines[i].replace(/\s+/g, ' ').trim());

            if (~headerIndex) {
                headLine = lines[i];
                headChunks = headLine.split(/\s+/g);
                headPrefix = headerIndex ? 'stations' : 'aps';
                continue;
            }

            if (!headPrefix) {
                continue;
            }

            let item: any = {};
            for (let j = 0; j < headChunks.length; j++) {
                let start = headLine.indexOf(headChunks[j]);

                let nextJ = j + 1;

                let end = headChunks[nextJ] ? headLine.indexOf(headChunks[nextJ]) : lines[i].length;

                let len = end - start;

                item[headChunks[j]] = lines[i].substr(start, len).trim();
            }

            //@ts-ignore - accessing result by string key + adding any obj to typed arrays
            result[headPrefix].push(item);
        }

        return result;
    }

    private cleanData(data: string): string[] {
        const lines = data.trim().split(new RegExp(os.EOL, 'g'));

        // removes hidden chars used to format terminal output
        for (let i = 0; i < lines.length; i++) {
            lines[i] = lines[i].replace(ANSI_REGEX, '').trim()
        }

        return lines
    }
}
