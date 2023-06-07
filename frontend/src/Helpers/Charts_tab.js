import ChartPlot from './ChartPlotter'
import Server from '../components/backend'
import { useEffect, useState } from 'react'
import Status from './Status'

function Choose(props) {
    return (
        <div class='mt-10 flex flex-row justify-center w-full'>
            <div class='flex text-white w-full sm:w-1/2 lg:w-1/3 mx-4 flex-row justify-center bg-gray-800 p-2 rounded-xl flex-wrap'>
                <button onClick={() => { props.setType(1) }} class={'w-full md:w-1/3 hover:bg-gray-700 rounded-md py-1'+(props.type===1?' bg-gray-700':'')}>Hour</button>
                <button onClick={() => { props.setType(2) }} class={'w-full md:w-1/3 hover:bg-gray-700 rounded-md py-1'+(props.type===2?' bg-gray-700':'')}>Day</button>
                <button onClick={() => { props.setType(3) }} class={'w-full md:w-1/3 hover:bg-gray-700 rounded-md py-1'+(props.type===3?' bg-gray-700':'')}>Week</button>
            </div>
        </div>
    )
}

function ChartTab(props) {
    var Ranges = props.Ranges
    var [labels, setlabels] = useState([])
    var [CO2_data, setCo2] = useState([])
    var [VOC_data, setVOC] = useState([])
    var [Temperature_data, setTemperature] = useState([])
    var [Humidity_data, setHumidity] = useState([])
    var [PM2_5_data, setPM2_5] = useState([])
    var [PM10_data, setPM10] = useState([])

    var [isLatest, setisLatest] = useState(false)

    var [type,setType] = useState(1)

    const hook = () => {
        setCo2([])
        setVOC([])
        setTemperature([])
        setHumidity([])
        setPM2_5([])
        setPM10([])
        Server.getDataMany(type).then((response) => {
            // console.log("Hooking\n");
            setlabels(response.labels)
            setCo2(response.CO2)
            setVOC(response.VOC)
            setTemperature(response.Temperature)
            setHumidity(response.Humidity)
            setPM2_5(response.PM2_5)
            setPM10(response.PM10)
            setisLatest(response.isLatest)
        })
    }
    useEffect(hook, [type])

    if (props.page !== 1) {
        return (<></>)
    } else {
        return (
            <>
                <section>
                    <Choose setType={setType} type={type}></Choose>
                    <div class="overflow-auto container px-5 py-24 mx-auto">
                        <div class="overflow-auto flex flex-wrap -m-4">
                            <ChartPlot zoomed={false} labels={labels} title="CO2" data={CO2_data} range={Ranges.CO2}></ChartPlot>
                            <ChartPlot zoomed={false} labels={labels} title="VOC" data={VOC_data} range={Ranges.VOC}></ChartPlot>
                            <ChartPlot zoomed={false} labels={labels} title="Temperature" data={Temperature_data} range={Ranges.Temperature}></ChartPlot>
                            <ChartPlot zoomed={false} labels={labels} title="Humidity" data={Humidity_data} range={Ranges.Humidity}></ChartPlot>
                            <ChartPlot zoomed={false} labels={labels} title="PM 2.5" data={PM2_5_data} range={Ranges.PM2_5}></ChartPlot>
                            <ChartPlot zoomed={false} labels={labels} title="PM 10" data={PM10_data} range={Ranges.PM10}></ChartPlot>
                        </div>
                    </div>
                </section>
                <Status isOnline={isLatest}></Status>
            </>
        )
    }
}

export default ChartTab