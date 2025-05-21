import ExclusiveOffers from "../components/ExclusiveOffers";
import FeatureDestination from "../components/FeatureDestination";
import Hero from "../components/Hero";
import NewsLetter from "../components/NewsLetter";
import Testimonial from "../components/Testimonial";

const Home = () => {
  return (
    <>
      <Hero />
      <FeatureDestination />
      <ExclusiveOffers />
      <Testimonial />
      <NewsLetter/>
    </>
  );
};

export default Home;
