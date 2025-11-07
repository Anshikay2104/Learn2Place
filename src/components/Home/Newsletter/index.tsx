"use client";

import React, { useEffect, useRef } from "react";

const opportunities = [
  "Internship at Google",
  "Full-Time at Amazon",
  "Summer Program at Microsoft",
  "Internship at Walmart",
  "Research Program at IBM",
  "Training at Tesla",
  "Hackathon at Facebook",
  "Workshop at Adobe",
];

// Duplicate items for infinite effect
const duplicatedOpportunities = [...opportunities, ...opportunities];

const MovingCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const speed = 0.5; // pixels per frame
    let animationFrame: number;

    const scroll = () => {
      if (carouselRef.current) {
        carouselRef.current.scrollLeft += speed;

        if (carouselRef.current.scrollLeft >= carouselRef.current.scrollWidth / 2) {
          carouselRef.current.scrollLeft = 0;
        }
      }
      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <section className="relative py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Blue background */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 to-sky-400 py-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-white text-center mb-8">
            Off-Campus Opportunities for Students
          </h2>

          {/* Carousel */}
          <div
            ref={carouselRef}
            className="flex space-x-6 w-full overflow-x-auto hide-scrollbar"
          >
            {duplicatedOpportunities.map((opportunity, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-44 h-44 rounded-full bg-white text-gray-800 flex items-center justify-center text-center p-4 shadow-lg"
              >
                {opportunity}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tailwind-compatible scrollbar hide */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </section>
  );
};

export default MovingCarousel;
