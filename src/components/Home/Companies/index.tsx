"use client"
import Image from "next/image";
import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TruestedCompanies } from "@/app/api/data";
import { getImagePrefix } from "@/utils/util";

// CAROUSEL SETTINGS
const Companies = () => {

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 2000,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 700,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            }
        ]
    };

    return (
        <section className='text-center' >
            <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-4">
                <h2 className="text-midnight_text text-2xl font-semibold">Trusted by companies of all sizes</h2>
                <div className="py-14 border-b ">
                    <Slider {...settings}>
                        {TruestedCompanies.map((item, i) =>
                            <div key={i}>
                                <div className="flex items-center justify-center h-24 w-44 mx-auto">
                                <Image
                                    src={`${getImagePrefix()}${item.imgSrc}`}
                                    alt={item.imgSrc}
                                    width={120}
                                    height={60}
                                    className="object-contain mx-auto grayscale hover:grayscale-0 transition-all duration-300"
                                    />
                                </div>
                            </div>
                        )}
                    </Slider>
                </div>
            </div>
        </section>
    )

}

export default Companies;