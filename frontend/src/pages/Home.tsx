const Home = () => {
    return (
        <div className="main-container relative">
            <div 
                style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/university.jpg)`}}
                className="bg-fixed bg-cover bg-center w-screen h-full brightness-95"
            ></div>
            <div className="absolute top-[50px] left-0 right-0 text-center">
                <div className="text-6xl text-[#1A237E] font-bold mb-2">Emmanuel College, Cambridge</div>
                <div className="text-gray-800 font-semibold">University of Cambridge</div>
            </div>
        </div>
    );
}

export default Home;