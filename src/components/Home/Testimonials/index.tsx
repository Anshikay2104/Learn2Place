"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import { Icon } from "@iconify/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Testimonial data
const testimonialData = [
  {
    id: 1,
    name: "Priya Sharma",
    profession: "Computer Science Student",
    comment:
      "This platform helped me connect with mentors who guided me through placements. Great experience!",
    rating: 4.5,
    imgSrc: "/images/testimonial/userone.png",
  },
  {
    id: 2,
    name: "Rahul Verma",
    profession: "ECE Student",
    comment:
      "I loved how interactive the courses were! I could easily follow along and ask doubts.",
    rating: 5,
    imgSrc: "/images/testimonial/usertwo.png",
  },
  {
    id: 3,
    name: "Aditi Singh",
    profession: "Final Year B.Tech",
    comment:
      "The alumni sessions were insightful. Helped me prepare for interviews efficiently!",
    rating: 4,
    imgSrc: "/images/testimonial/userthree.png",
  },
];

export default function Testimonial() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    adaptiveHeight: false, // Important: ensures all slides have same height
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;

    return (
      <div className="flex gap-1 justify-center">
        {[...Array(full)].map((_, i) => (
          <Icon
            key={`full-${i}`}
            icon="tabler:star-filled"
            className="text-yellow-500 text-xl"
          />
        ))}
        {half === 1 && (
          <Icon
            icon="tabler:star-half-filled"
            className="text-yellow-500 text-xl"
          />
        )}
        {[...Array(empty)].map((_, i) => (
          <Icon
            key={`empty-${i}`}
            icon="tabler:star-filled"
            className="text-gray-300 text-xl"
          />
        ))}
      </div>
    );
  };

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto max-w-7xl px-6">
        <h2 className="text-3xl font-semibold mb-5 md:mb-6 text-center text-gray-800 mb-10">
          What Students Say
        </h2>

        <Slider {...settings}>
          {testimonialData.map((item) => (
            <div key={item.id} className="px-3 h-full">
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col justify-between">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-4 relative rounded-full overflow-hidden">
                    <Image
                      src={item.imgSrc}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-gray-600 italic mb-4 h-24 overflow-hidden">
                    "{item.comment}"
                  </p>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">{item.profession}</p>
                  <div className="mt-3">{renderStars(item.rating)}</div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
