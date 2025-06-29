import React, { useState } from 'react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageOptimizer: React.FC<ImageOptimizerProps> = ({
  src,
  alt,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
      />
    </div>
  );
};

export default ImageOptimizer;