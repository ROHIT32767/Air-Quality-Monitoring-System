import { useState } from "react"
import swal from "sweetalert"
import Server from "../components/backend"

function AlertsTab(props) {
    var [input, setInput] = useState("")

    var onSubmit = () => {
        swal("Wait For A few Seconds....");
        Server.postEmail({ "email": input })
    }

    if (props.page !== 2) {
        return (<></>)
    } else {
        return (
            <div class="flex flex-row flex-wrap order-last lg:order-first">
                <div class="px-5 py-10 w-full lg:w-1/2 xl:w-1/3">
                    <div class="w-full bg-gray-800 shadow-md rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                        <h2 class="text-white text-lg mb-1 font-medium title-font text-2xl">Subscribe for email alerts</h2>
                        <p class="leading-relaxed mb-5 text-white">Subscribed emails will receive alerts whenever air quality degrades</p>
                        <div class="relative mb-4">
                            <label for="email" class="leading-7 text-sm text-gray-400">Email</label>
                            <input type="email" id="email" name="email" class="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                onChange={(event) => { setInput(event.target.value) }} />
                        </div>
                        <button class="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg" onClick={() => { onSubmit() }}>Submit</button>
                    </div>
                </div>
                <div class="px-5 py-10 w-full lg:w-1/2 xl:w-1/3 order-first lg:order-last">
                    <div class="w-full bg-gray-800 shadow-md rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                        <p class="text-white text-lg mb-1 font-medium title-font text-2xl">How To Subscribe for Alerts</p>
                        <p class="text-white">Three steps to go:</p>
                        <br></br>
                        <ul class="text-white list-disc pl-6">
                            <li>Enter your email</li>
                            <li>Validate your email</li>
                            <li>Start receiving alerts</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default AlertsTab