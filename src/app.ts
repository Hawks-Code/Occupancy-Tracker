import { Airodump } from "./airodump"
import { Analyzer } from "./analyzer"

const airodump = new Airodump()
const analyzer = new Analyzer()

airodump.onData((data) => {
    analyzer.processFrame(data)
    console.log(`Population = ${analyzer.getCurrentPopulationEstimate()}`)
})

airodump.run()
