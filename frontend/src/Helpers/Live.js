function LiveBox(props) {
    if(props.Value === undefined){
        return (
            <div class="w-full sm:w-1/2 xl:w-1/3 md:w-1/2 p-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.75)]">
                <div class="border border-gray-700 border-opacity-75 p-6 rounded-lg bg-white">
                    Waiting For Server Response
                </div>
            </div>
        )
    }
    if (props.Value < props.Ranges.L0) {
        return (
            <div class="w-full sm:w-1/2 xl:w-1/3 md:w-1/2 p-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.75)] bg-green">
                <div class="border border-gray-700 border-opacity-75 p-6 rounded-lg bg-lime-500">
                    <div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white text-indigo-400 mb-4">
                        <img class="w-6 h-6" src={props.img} alt={props.Name}></img>
                    </div>
                    <h2 class="text-lg text-black font-medium title-font mb-2">{props.Name}</h2>
                    <h2 class="text-lg text-black font-medium title-font mb-2">{props.Value}</h2>
                </div>
            </div>
        )
    }else if(props.Value < props.Ranges.L1){
        return (
            <div class="w-full sm:w-1/2 xl:w-1/3 md:w-1/2 p-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.75)] bg-green">
                <div class="border border-gray-700 border-opacity-75 p-6 rounded-lg bg-orange-500">
                    <div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white text-indigo-400 mb-4">
                        <img class="w-6 h-6" src={props.img} alt={props.Name}></img>
                    </div>
                    <h2 class="text-lg text-black font-medium title-font mb-2">{props.Name}</h2>
                    <h2 class="text-lg text-black font-medium title-font mb-2">{props.Value}</h2>
                </div>
            </div>
        )
    }else if(props.Ranges.L0 !== undefined){
        return (
            <div class="w-full sm:w-1/2 xl:w-1/3 md:w-1/2 p-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.75)] bg-green">
                <div class="border border-gray-700 border-opacity-75 p-6 rounded-lg bg-red-600">
                    <div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white text-indigo-400 mb-4">
                        <img class="w-6 h-6" src={props.img} alt={props.Name}></img>
                    </div>
                    <h2 class="text-lg text-black font-medium title-font mb-2">{props.Name}</h2>
                    <h2 class="text-lg text-black font-medium title-font mb-2">{props.Value}</h2>
                </div>
            </div>
        )
    }else{
        return (
            <div class="w-full sm:w-1/2 xl:w-1/3 md:w-1/2 p-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.75)] bg-green">
                <div class="border border-gray-700 border-opacity-75 p-6 rounded-lg bg-white">
                    <div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white text-indigo-400 mb-4">
                        <img class="w-6 h-6" src={props.img} alt={props.Name}></img>
                    </div>
                    <h2 class="text-lg text-black font-medium title-font mb-2">{props.Name}</h2>
                    <h2 class="text-lg text-black font-medium title-font mb-2">{props.Value}</h2>
                </div>
            </div>
        )
    }
    // if (props.Value) {
    //     return (
    //         <div class="w-full sm:w-1/2 xl:w-1/3 md:w-1/2 p-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.75)]">
    //             <div class="border border-gray-700 border-opacity-75 p-6 rounded-lg bg-green-500">
    //                 <div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white text-indigo-400 mb-4">
    //                     <img class="w-6 h-6" src={props.img} alt={props.Name}></img>
    //                 </div>

    //                 <div class="w-10 h-10 inline-flex items-center justify-center rounded-full bg-white text-indigo-400 mb-4">
    //                     <img class="w-6 h-6" src={props.img} alt={props.Name}></img>
    //                 </div>
    //                 <h2 class="text-lg text-black font-medium title-font mb-2">{props.Name}</h2>
    //                 <h2 class="text-lg text-black font-medium title-font mb-2">{props.Value}</h2>
    //             </div>
    //         </div>
    //     )
    // }
}

export default LiveBox