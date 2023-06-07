function Status(params) {
    if (params.isOnline === true) {
        return (
            <section class="fixed w-1/2 left-2 bottom-2 bg-white md:px-5 rounded flex text-white bg-indigo-500 border-0 py-2 focus:outline-none rounded-lg text-lg sm: w-full lg:w-1/4 justify-center">
                <p>
                    Node is Online
                </p>
            </section>
        )
    } else {
        return (
            <section class="fixed w-1/2 left-2 bottom-2 bg-white md:px-5 rounded flex text-white bg-indigo-500 border-0 py-2 focus:outline-none rounded-lg text-lg sm: w-full md:w-1/2 lg:w-1/5 justify-center">
                <p>
                    Node is Offline
                </p>
            </section>
        )
    }
}

export default Status