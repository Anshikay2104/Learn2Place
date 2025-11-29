"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { courseData } from "@/app/api/data";
import { getImagePrefix } from "@/utils/util";

const Courses = () => {

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 2,
        arrows: false,
        autoplay: true,
        speed: 500,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: false
                }
            }
        ]
    };

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const halfStars = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStars;

        return (
            <>
                {Array(fullStars).fill(<Icon icon="tabler:star-filled" className="text-yellow-500 text-xl inline-block" />)}
                {halfStars > 0 && <Icon icon="tabler:star-half-filled" className="text-yellow-500 text-xl inline-block" />}
                {Array(emptyStars).fill(<Icon icon="tabler:star-filled" className="text-gray-400 text-xl inline-block" />)}
            </>
        );
    };

    return (
        <section id="courses">
            <div className='container mx-auto lg:max-w-screen-xl md:max-w-screen-md px-1'>
                <div className="sm:flex justify-between items-center mb-20">
                    <h2 className="text-midnight_text text-5xl lg:text-5xlfont bold mb-5 md:mb-0">Popular Achievements.</h2>
                    <Link href={'/'} className="text-primary text-lg font-medium hover:tracking-widest duration-500">Explore more&nbsp;&gt;&nbsp;</Link>
                </div>
                <Slider {...settings}>
                    {courseData.map((items, i) => (
                        <div key={i}>
                            <div className="bg-white m-3 mb-12 px-3 pt-3 pb-12 shadow-course-shadow rounded-2xl h-[480px] flex flex-col justify-between">

                                <div className="relative bg-primary/10 rounded-3xl flex items-center justify-center text-center h-[60%] p-6">
                                <p className="text-l lg:text-l text-gray-800 leading-relaxed">
                                    “This is a sample experience post text. The user’s story or summary will appear here and take up most of the card.”
                                </p>
                                </div>
                                <div className="px-3 pt-6">
                                    <Link href="#" className='text-xl font-bold text-black max-w-75% inline-block'>{items.name}</Link>
                                    
                                    <div className="flex justify-between items-center py-6 border-b">
                                        <div className="flex items-center gap-4">
                                        <h3 className="text-blue-500 text-l">
                                            {items.role}
                                            {items.company ? `, ${items.company}` : ""}
                                        </h3>
                                        </div>

                                    </div>
                                    <h3 className='text-base font-normal pt-6 text-black/75'> Batch {items.Batch}</h3>
                                    
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
}

export default Courses;
