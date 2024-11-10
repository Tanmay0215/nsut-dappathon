import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SimpleSlider() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay : true,
    autoplaySpeed: 3000,
  };
  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div className="my-auto">
            <img src = "https://m.media-amazon.com/images/I/71qjlDoUv7L._AC_UF1000,1000_QL80_.jpg" className="h-screen object-contain aspect-5/3 bg-blend-multiply"></img>
        </div>
        <div className="my-auto">
            <img src = "https://i.pinimg.com/originals/ea/95/a1/ea95a1c2e60a89171884b48acbab0df8.jpg" className="h-screen object-contain aspect-5/3 bg-blend-multiply"></img>
        </div>
        <div className="my-auto">
            <img src = "https://m.media-amazon.com/images/I/81VBngCAkiL._AC_UF1000,1000_QL80_.jpg" className="h-screen object-contain aspect-5/3 bg-blend-multiply"></img>
        </div>
      </Slider>
    </div>
  );
}

export default SimpleSlider;