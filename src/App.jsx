import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Container from "./components/Container";
import Home from "./pages/Home";
import SurahDetail from "./pages/SurahDetail";
 
function App() {
  return (
    <div className="bg-gray-50 min-h-screen relative">
      <Router>
        <Navbar />
        <Container fullHeight={true}>
          <div className="pb-40">
            <Routes>
                <Route path="/" element={<Home page="home" />} />  
                <Route path="/surah/:number" element={<SurahDetail />} />
              {/*     <Route path="/surah/favorites" element={<Surah page="favorites" />} />
              <Route path="/surah/:number" element={<SurahDetail />} />
              <Route path="/support" element={<Support />} /> */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Container>
        <Footer />
        {/* <Player /> */}
      </Router>
    </div>
  );
}

export default App;
