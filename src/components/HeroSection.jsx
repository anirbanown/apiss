import video1 from "../assets/robot.gif";
import video2 from "../assets/video2.mp4";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        MentiHQ AI
        
      </h1>
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        
        <span className="bg-gradient-to-r from-blue-500 to-red-300 text-transparent bg-clip-text">
          {" "}
          Predicting Your Mental Health
        </span>
      </h1>
      <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
        Know your Current State in Real Time
      </p>
      <div className="flex justify-center my-10">
        <a
          href="#"
          className="bg-gradient-to-r from-blue-500 to-blue-800 py-3 px-4 mx-3 rounded-md"
        >
          Start for free
        </a>
        <a href="#" className="py-3 px-4 mx-3 rounded-md border">
          Documentation
        </a>
      </div>
      <div className="flex mt-10 justify-center">
        
        {/* <video
          autoPlay
          loop
          muted
          className="rounded-lg w-1/2 border border-blue-700 shadow-sm shadow-blue-400 mx-2 my-4"
        >
          <source src={video2} type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
      </div>
    </div>
  );
};

export default HeroSection;
