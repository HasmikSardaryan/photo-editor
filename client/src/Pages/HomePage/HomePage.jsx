import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import "./HomePage.css";

function HomePage() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const unsplashImages = Array.from({ length: 12 }, (_, i) =>
      `https://source.unsplash.com/random/800x600?sig=${i}&editing`
    );
    setImages(unsplashImages);
  }, []);

  return (
    <div className="homepage">
      <Header/>
      <h2 className="gallery-title">Explore Edited Photos</h2>
      <div className="image-gallery">
        {images.map((img, idx) => (
          <img key={idx} src={img} alt={`Edited sample ${idx}`} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;

