"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Women-centric opportunities
const opportunitiesData = [
  {
    id: 1,
    title: "Walmart CodeHers",
    type: "Mentorship & Internship",
    timeline: "June – July",
    imgSrc: "/images/companies/walmart.svg",
  },
  {
    id: 2,
    title: "Google Summer of Code (GSoC)",
    type: "Internship & Open Source Program",
    timeline: "May – August",
    imgSrc: "/images/companies/google.svg",
  },
  {
    id: 3,
    title: "Google STEP Internship",
    type: "Summer Internship",
    timeline: "May – August",
    imgSrc: "/images/companies/google.svg",
  },
  {
    id: 4,
    title: "Microsoft Women in STEM",
    type: "Mentorship Program",
    timeline: "July – August",
    imgSrc: "/images/companies/images.png",
  },
  {
    id: 6,
    title: "IBM Research Program",
    type: "Research Internship",
    timeline: "June – July",
    imgSrc: "/images/companies/ibm.svg",
  },
];

const MovingCarousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
      {/* White separator strip above */}
      <div className="w-full h-8 bg-white"></div>

      {/* Banner Section with vertical gradient background */}
      <section
        className="w-full py-8 mb-10"
        style={{
          background: "linear-gradient(to bottom, #c6d7f5 0%, #d5c8f1 100%)",
        }}
      >
        <div className="relative overflow-hidden py-5 px-6">
          <h2 className="text-3xl md:text-4xl font-semibold mb-5 md:mb-6 text-gray-800 text-center">
            Women-Centric Opportunities for Students
          </h2>

          <div className="max-w-7xl mx-auto">
            <Slider {...settings}>
              {opportunitiesData.map((opportunity) => (
                <div key={opportunity.id} className="px-3">
                  <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center text-center h-full">
                    <div className="w-24 h-24 relative mb-4">
                      <Image
                        src={opportunity.imgSrc}
                        alt={opportunity.title}
                        fill
                        className="object-contain rounded-lg"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {opportunity.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">
                      {opportunity.type}
                    </p>
                    <p className="text-sm text-gray-500">
                      Timeline: {opportunity.timeline}
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* White space below banner to separate from footer */}
      <div className="w-full h-8 bg-white"></div>
    </>
  );
};

export default MovingCarousel;
