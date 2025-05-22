import Home from "./Home";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyForm from "./MyForm";
import ImagePredict from "./ImagePredict";
import NearbyDoctorsMap from '../pages/NearbyDoctersMap';

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/myform" Component={MyForm} />
          <Route path="/image-predict" Component={ImagePredict} />
          <Route path="/doctors" exact component={NearbyDoctorsMap} />
        </Routes>
      </div>
    </Router>
  );
}
