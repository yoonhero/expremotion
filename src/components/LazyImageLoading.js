import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-lazy-load-image-component/src/effects/black-and-white.css";

const LazyImageLoading = ({ image, className }) => (
  <LazyLoadImage
    alt={"sorry... "}
    effect='blur'
    src={image}
    className={className}
  />
);

export default LazyImageLoading;
