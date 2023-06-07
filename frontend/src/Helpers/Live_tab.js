import { useState } from "react"
import { useEffect } from "react"
import Server from "../components/backend"
import LiveBox from "./Live"
import Status from './Status'


const Images = [
    "co2.svg",
    "voc.svg",
    "thermometer.svg",
    "humidity.svg",
    "PM_2_5.svg",
    "PM_10.svg"
]
function LiveTab(props) {
    var Ranges = props.Ranges
    var [data, setData] = useState([])
    var [isLatest, setisLatest] = useState(false)
    const hook = () => {
        Server.getData().then((response) => {
            setisLatest(response.isLatest)
            setData(response)
        })
    }
    useEffect(hook, [])

    if (props.page !== 0) {
        return (<></>)
    // }else if(isLatest === false){
    //     return (
    //         <div class="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none rounded-lg text-lg sm: w-full lg:w-1/4 justify-center">Node Is Offline</div>
    //     )
    } else {
        return (
            <>
                <section class="text-gray-400 body-font bg-grey-900">
                    <div class="container px-5 py-24 mx-auto">
                        <div class="flex flex-wrap -m-4">
                            <LiveBox Ranges={Ranges.CO2} Name={"CO2"} Value={data.CO2} img={Images[0]}></LiveBox>
                            <LiveBox Ranges={Ranges.VOC} Name={"VOC"} Value={data.VOC} img={Images[1]}></LiveBox>
                            <LiveBox Ranges={Ranges.Temperature} Name={"Temperature"} Value={data.Temperature} img={Images[2]}></LiveBox>
                            <LiveBox Ranges={Ranges.Humidity} Name={"Humidity"} Value={data.Humidity} img={Images[3]}></LiveBox>
                            <LiveBox Ranges={Ranges.PM2_5} Name={"PM 2.5"} Value={data.PM2_5} img={Images[4]}></LiveBox>
                            <LiveBox Ranges={Ranges.PM10} Name={"PM 10"} Value={data.PM10} img={Images[5]}></LiveBox>
                        </div>
                        <div class="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none rounded-lg text-lg sm: w-full lg:w-1/4 justify-center">Last Updated at {data.TimeString}</div>
                    </div>
                </section>
                <Status isOnline={isLatest}></Status>
            </>
        )
    }
}

export default LiveTab