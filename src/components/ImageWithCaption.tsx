"use client";

import React from "react";

interface ImageProps {
  src: string;
  alt: string;
  source: string;
  width?: number;
  height?: number;
}

const ImageWithSource: React.FC<ImageProps> = ({ src, alt, source, width, height }) => {
  return (
        <figure>
            <img src={src} alt={alt} width={width} height={height} loading="lazy" />
            <figcaption className="image-source text-right block"><a href={source} rel="nofollow noopener noreferrer">Source de l'image</a></figcaption>
        </figure>
    );
}

export default ImageWithSource;