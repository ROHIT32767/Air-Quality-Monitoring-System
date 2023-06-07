import {useState } from 'react'
import './app.css'
import Header from './Helpers/Header'
import ChartTab from './Helpers/Charts_tab'
import LiveTab from './Helpers/Live_tab'
import AlertsTab from './Helpers/Alerts_tab'

function App() {


  const Ranges = {
    CO2: {
      min: 0,
      max: 3000,
      L0: 600,
      L1: 2000
    },
    VOC: {
      min: 0,
      max: 400,
      L0: 100,
      L1: 200
    },
    Temperature: {
      min: 20,
      max: 50,
    },
    Humidity: {
      min: 0,
      max: 100
    },
    PM2_5: {
      min: 0,
      max: 200,
      L0: 50,
      L1: 150
    },
    PM10: {
      min: 0,
      max: 200,
      L0: 50,
      L1: 150
    }
  }
  // var [isLatest, setisLatest] = useState(false)
  // const hook = () => {
  //   getData().then((response) => {
  //     console.log("Hooking\n");
  //     setlabels(response.labels)
  //     setCo2(response.CO2)
  //     setVOC(response.VOC)
  //     setTemperature(response.Temperature)
  //     setHumidity(response.Humidity)
  //     setPM2_5(response.PM2_5)
  //     setPM10(response.PM10)
  //     setisLatest(response.isLatest)
  //   })
  // }
  // useEffect(hook, [])

  var [Page,setPage] = useState(0)
  return (
    <>
      <Header setPage={setPage}></Header>
      <ChartTab Ranges={Ranges} page={Page}></ChartTab>
      <LiveTab Ranges={Ranges} page={Page}></LiveTab>
      <AlertsTab page={Page}></AlertsTab>
    </>
  );
}

export default App;