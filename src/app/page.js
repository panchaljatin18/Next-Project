import Header from "../components/Header";
import Herosection from "../sections/HomePage/HeroSection";
import Secondsection from "../sections/HomePage/SecondSection";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <>
      <Header />
      <Herosection/>
      <Secondsection/>
      <Footer/>
    </>
  );
}