import { Parser } from "../src/parser"

const SAMPLE_OUTPUT = `
CH  9 ][ Elapsed: 1 min ][ 2007-04-26 17:41 ][ WPA handshake: 00:14:6C:7E:40:80
                                                                                                        
BSSID              PWR  Beacons    #Data, #/s  CH  MB   ENC  CIPHER AUTH ESSID
                                                                                                     
00:09:5B:1C:AA:1D   11       10        0    0  11  54.  OPN              NETGEAR                         
00:14:6C:7A:41:81   34       57       14    1   9  11e  WEP  WEP         bigbear 
00:14:6C:7E:40:80   32      752       73    2   9  54   WPA  TKIP   PSK  teddy                             
                                                                                                           
BSSID              STATION            PWR   Rate   Lost  Frames  Notes  Probes
                               
00:14:6C:7A:41:81  00:0F:B5:32:31:31   51   36-24    2       14
(not associated)   00:14:A4:3F:8D:13   19    0-0     0        4           mossy 
00:14:6C:7A:41:81  00:0C:41:52:D1:D1   -1   36-36    0        5
00:14:6C:7E:40:80  00:0F:B5:FD:FB:C2   35   54-54    0       99           teddy
`

describe('parser.ts', () => {
    test('parses sample output', () => {
        const parser = new Parser()
        const output = parser.parseAirodumpFrame(SAMPLE_OUTPUT)
        expect(output.handshake).toBe('00:14:6C:7E:40:80')
        expect(output.aps.length).toBe(3)
        expect(output.stations.length).toBe(4)
    })
})