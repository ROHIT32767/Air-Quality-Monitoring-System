import axios from 'axios'
import swal from 'sweetalert'

// https://indoor-air-pollution-18.onrender.com/
const data_url = "https://indoor-air-pollution-18.onrender.com/api/data/"
const email_url = "https://indoor-air-pollution-18.onrender.com/api/email/"
const timediff = 150

const getDataMany = (type) => {
    var labels = []
    var CO2 = []
    var VOC = []
    var Temperature = []
    var Humidity = []
    var PM2_5 = []
    var PM10 = []
    var num_inst = "5000"
    if(type === 1){
        num_inst = "60"
    }else if(type === 2){
        num_inst = "1000"
    }
    return axios.get(data_url+num_inst).then((result) => {
        var result_arr = result.data
        var isLatest = (new Date() - new Date(result_arr.at(-1).date))/1000  < timediff ; // difference in seconds is < timediff
        result_arr.forEach(element => {
            var date = new Date(element.date)
            labels.push(date.getHours().toString()+":"+date.getMinutes().toString() + ":" + date.getSeconds().toString() + " (" + date.getDate().toString() + "/" + (date.getMonth()+1).toString() + ")")
            CO2.push(element.CO2)
            VOC.push(element.VOC)
            Temperature.push(element.Temperature)
            Humidity.push(element.Humidity)
            PM2_5.push(element.PM2_5)
            PM10.push(element.PM10)
        });
        return {labels,CO2,VOC,Temperature,Humidity,PM2_5,PM10,isLatest}
    })
}

const getData = () => {
    return axios.get(data_url+"1").then((result) => {
        var result_data = result.data[0]
        var CO2 = result_data.CO2
        var VOC = result_data.VOC
        var Temperature = result_data.Temperature
        var Humidity = result_data.Humidity
        var PM2_5 = result_data.PM2_5
        var PM10 = result_data.PM10
        var isLatest = (new Date() - new Date(result_data.date))/1000  < timediff ; // difference in seconds is < timediff
        var date = new Date(result_data.date);
        var TimeString = date.getHours().toString()+":"+date.getMinutes().toString() + ":" + date.getSeconds().toString() + " (" + date.getDate().toString() + "/" + (date.getMonth()+1).toString() + ")"
        return {CO2,VOC,Temperature,Humidity,PM2_5,PM10,isLatest,TimeString}
    })
}

const postEmail = (Obj) => {
    return axios.post(email_url,Obj).then((result) => {
        if(result.status === 200){
            console.log("post body",result.data.status)
            if(result.data.status === 1){
                swal("Email Already Verified","your email has already started receiving alerts","success")
            }else{
                swal("Email Sent","Kindly check in your mailbox ( possibly spam folder) to verify your email","success");
            }
        }
    }).catch(() => {
        swal("Invalid email","","error");
    })
}
var Server = {getDataMany,getData,postEmail}
export default Server