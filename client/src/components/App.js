import React from "react";
import "../css/App.css";
import Comments from "./Comments";
import { Footer } from "./Footer";

function App() {
  return (
    <div className="app">
      <Comments />
      <Footer />
    </div>
  );
}

export default App;
