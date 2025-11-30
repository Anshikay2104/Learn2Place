"use client"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Image from "next/image";
import { MentorData } from "@/app/api/data";
import { getImagePrefix } from "@/utils/util";

const Mentor = () => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    cssEase: "linear",
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 1000, settings: { slidesToShow: 2 } },
      { breakpoint: 530, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="bg-deepSlate py-6 md:py-5" id="mentor"> {/* slightly taller background */}
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4 relative">
        <h2 className="text-midnight_text text-3xl md:text-4xl font-semibold mb-5 md:mb-6">
          Meet the Team
        </h2>

        <Slider {...settings}>
          {MentorData.map((items, i) => (
            <div key={i}>
              <div className="m-2 py-4 md:my-3 text-center relative"> {/* slightly bigger card */}
                <div className="relative inline-block">
                  <Image
                    src={`${getImagePrefix()}${items.imgSrc}`}
                    alt="user-image"
                    width={180}  // increased image size
                    height={180} // increased image size
                    className="inline-block m-auto rounded-full object-cover"
                  />
                  {items.linkedin ? (
                    <a
                      href={items.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 bottom-3 bg-white rounded-full p-2 inline-block"
                      aria-label={`Open ${items.name} on LinkedIn`}
                    >
                      <Image
                        src={`${getImagePrefix()}images/mentor/linkedin.svg`}
                        alt="linkedin-image"
                        width={18}
                        height={18}
                      />
                    </a>
                  ) : (
                    <div className="absolute right-3 bottom-3 bg-white rounded-full p-2">
                      <Image
                        src={`${getImagePrefix()}images/mentor/linkedin.svg`}
                        alt="linkedin-image"
                        width={18}
                        height={18}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-2">
                  <h3 className="text-sm md:text-base font-semibold text-lightblack">{items.name}</h3>
                  <h4 className="text-xs md:text-sm font-normal text-lightblack pt-0.5 opacity-50">{items.profession}</h4>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Mentor;
