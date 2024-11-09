import NavBar from "../Components/NavBar";
import HomePageComp from "../Components/HomePageComp";
export default function LandingPagePage() {
  return (
    <div className="w-screen bg-gray-900 h-screen bg-none flex flex-col items-center overflow-hidden">
      <div className="w-11/12 text-white text-2xl flex justify-center items-center">
        <NavBar />
      </div>
      <HomePageComp />
    </div>
  );
}
