"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import { Icon } from "@iconify/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//initials

const getInitials = (name: string) => {
  const parts = name.split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`
    : parts[0][0];
};

const avatarColors = [
  "bg-indigo-600",
  "bg-pink-500",
  "bg-purple-600",
  "bg-blue-500",
];

// Testimonial data

const testimonialData = [
  {
    id: 1,
    name: "Ananya Gupta",
    profession: "Final Year CSE Student",
    comment:
      "Learn2Place made placements feel less overwhelming. Reading real interview experiences from alumni helped me prepare with confidence and clarity.",
    rating: 5,
    imgSrc: "/images/testimonial/girl1.png",
  },
  {
    id: 2,
    name: "Riya Mehta",
    profession: "3rd Year IT Student",
    comment:
      "The platform bridges the gap between students and alumni so well. I finally understood what companies actually expect during interviews.",
    rating: 4.5,
    imgSrc: "/images/testimonial/girl2.png",
  },
  {
    id: 3,
    name: "Sneha Kulkarni",
    profession: "Computer Engineering Student",
    comment:
      "The interview tips shared by seniors were extremely practical. It saved me so much time during my placement preparation.",
    rating: 4,
    imgSrc: "/images/testimonial/girl3.png",
  },
  {
    id: 4,
    name: "Pooja Verma",
    profession: "Electronics & Communication Student",
    comment:
      "As someone who was unsure about placements, Learn2Place gave me real insights and stories that motivated me to push myself.",
    rating: 5,
    imgSrc: "/images/testimonial/girl4.png",
  },
  {
    id: 5,
    name: "Kavya Nair",
    profession: "B.Tech Student",
    comment:
      "I loved how honest and detailed the alumni experiences were. It feels like seniors are guiding us step by step.",
    rating: 4.5,
    imgSrc: "/images/testimonial/girl5.png",
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
          {testimonialData.map((item, index) => {
            const colorClass = avatarColors[index % avatarColors.length];
            return (
            <div key={item.id} className="px-3 h-full">
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col justify-between">
                <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-16 h-16 mb-3 rounded-full ${colorClass} flex items-center justify-center text-white text-lg font-semibold shadow-md`}
                    >
                      {getInitials(item.name)}
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
            );
          })}
        </Slider>
      </div>
    </section>
  );
}
