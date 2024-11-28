const Home = () => {
    return (
        <div style={{height: "calc(100vh - 62px)"}}>
            <div 
                style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/university.jpg)`}}
                className="bg-fixed bg-cover bg-center w-screen h-full"
            ></div>
        </div>
    );
}

export default Home;