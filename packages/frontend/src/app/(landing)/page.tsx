import About from "./_components/About";
import CTA from "./_components/CTA";
import Features from "./_components/Features";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import Statistics from "./_components/Statistics";


function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Features />
      <Statistics />
      {/* <Testimonials /> */}
      {/* <Pricing /> */}
      <CTA />
      <Footer />
    </div>
  );
}

export default Home;