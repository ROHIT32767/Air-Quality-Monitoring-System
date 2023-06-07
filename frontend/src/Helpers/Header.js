function Header(props) {
    return (
        <header class="text-gray-200 bg-gray-800 body-font sticky top-0 z-10"> 
            <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <p class="flex title-font font-medium items-center text-white mb-4 md:mb-0">
                    Indoor Air Pollution
                </p>
                <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    <button class="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0"
                        onClick={() => {props.setPage(0)}}>
                        Live
                    </button>
                    <button class="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0"
                        onClick={() => {props.setPage(1)}}>
                        Graphs
                    </button>
                    <button class="inline-flex items-center bg-gray-800 border-0 py-1 px-3 focus:outline-none hover:bg-gray-700 rounded text-base mt-4 md:mt-0"
                        onClick={() => {props.setPage(2)}}>
                        Alerts
                    </button>
                </nav>
            </div>
        </header>
    )
}

export default Header