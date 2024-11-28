const Home = () => {
    return (
        <div className="main-container">
            <div 
                style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/university.jpg)`}}
                className="bg-fixed bg-cover bg-center w-screen h-full"
            ></div>
        </div>
    );
}

export default Home;