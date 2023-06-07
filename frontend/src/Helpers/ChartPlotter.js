import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, LineElement, Legend, CategoryScale, LinearScale, PointElement, Filler } from 'chart.js';
ChartJS.register(
  Title, Tooltip, LineElement, Legend,
  CategoryScale, LinearScale, PointElement, Filler
)

function ChartPlot(params) {
  console.log("length",params.data.length)
  if(params.data === undefined || params.data.length === 0){
    return (
      <div class="overflow-auto px-4 py-5 lg:py-0 lg:w-1/2 sm:w-full lg:mb-10 sm:mb-1 border-box drop-shadow-[0_10px_10px_rgba(0,0,0,0.75)]">
      <div class="overflow-auto h-full bg-gray-100 px-8 pt-5 pb-4 rounded-lg text-center relative shadow-lg border-box ">
        <div class="graph h-80 my-auto">
          Waiting For Server Response
        </div>
      </div>
    </div>
    )
  }
  
  // console.log("entry", params)
  var LowLine = {
    data: Array(params.data.length).fill(params.range.L0),
    tension: 0,
    fill: true,
    radius: 0,
    backgroundColor: "rgb(132,204,22)"
  }
  
  var HighLine = {
    data: Array(params.data.length).fill(params.range.L1),
    tension: 0,
    fill: true,
    radius: 0,
    backgroundColor: "rgb(249,115,22)"
  }

  var BackgroundLine = {
    data: Array(params.data.length).fill(Math.max(...params.data)+15),
    tension: 0,
    fill: true,
    showLine: true,
    radius: 0,
    backgroundColor: "rgb(255,0,0)"
  }

  const data = {
    title: {
      text: "Hello"
    },
    labels: params.labels,
    datasets: [
      {
        data: params.data,
        tension: 0,
        fill: true,
        pointBorderColor: '#00000090',
        pointBackgroundColor: '#00000090',
        showLine: true,
        radius: 0.5,
        borderColor: "#000000",
        linecolor: "black",
      },
    ]
  }
  if(params.zoomed===false && params.range.L0 !== undefined){
    data.datasets.push(LowLine)
    data.datasets.push(HighLine)
    data.datasets.push(BackgroundLine)
  }
  const options = {
    plugins: {
      title: {
        display: true,
        text: params.title,
        padding: 15,
        font: {
          size: 20
        }
      },
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false
  }
  if(params.zoomed === false){
    options.scales = {
      y: {
        min: Math.max(params.range.min, Math.min(...params.data)-10),
        max: Math.max(...params.data)+10
      }
    }
  }else{
    options.scales = null;
  }
  
  return (
    <div class="overflow-auto px-4 py-5 lg:py-0 lg:w-1/2 sm:w-full lg:mb-10 sm:mb-1 border-box drop-shadow-[0_10px_10px_rgba(0,0,0,0.75)]">
      <div class="overflow-auto h-full bg-gray-100 px-8 pt-5 pb-4 rounded-lg text-center relative shadow-lg border-box ">
        <div class="graph h-80">
          <Line data={data} options={options} class="h-full"></Line>
        </div>
      </div>
    </div>
  );
}

export default ChartPlot;