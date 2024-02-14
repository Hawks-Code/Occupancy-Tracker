import { Airodump } from "./airodump"
import { Analyzer } from "./analyzer"

const airodump = new Airodump()
const analyzer = new Analyzer()

airodump.onData((data) => {
    console.log('\x1Bc'); // Clear screen

    analyzer.processFrame(data)
    console.log(`Population = ${analyzer.getCurrentPopulationEstimate()}`)
    analyzer.printData()
})

airodump.run()
