import React from "react";
import { ExperienceCards } from "@/components/ExperienceCards";

interface PageProps {
  params: { company: string; year: string };
}

interface Experience {
  person: string;
  photo: string;
  companyLogo: string;
  description: string;
}

// Sample experiences
const sampleExperiences: Record<string, Experience[]> = {
  walmart: [
    {
      person: "John Doe",
      photo: "/images/person1.jpg",
      companyLogo: "/images/companies/walmart.svg",
      description:
        "Managed inventory optimization projects and collaborated with cross-functional teams on logistics improvements. Increased efficiency in supply chain operations by 15% over 6 months.",
    },
    {
      person: "Jane Smith",
      photo: "/images/person2.jpg",
      companyLogo: "/images/companies/walmart.svg",
      description:
        "Worked on customer analytics and data-driven marketing strategies, leading to a 10% increase in engagement across online channels.",
    },
  ],
  google: [
    {
      person: "Alice Johnson",
      photo: "/images/person3.jpg",
      companyLogo: "/images/companies/google.svg",
      description:
        "Developed scalable backend systems and contributed to AI research projects. Optimized internal tools for data visualization.",
    },
  ],
  amazon: [
    {
      person: "Boyce Lee",
      photo: "/images/person4.jpg",
      companyLogo: "/images/companies/amazon.svg",
      description:
        "Worked on e-commerce analytics dashboards and logistics algorithms. Participated in cross-functional project sprints for new delivery models.",
    },
  ],
};

export async function generateStaticParams() {
  const companies = ["walmart", "google", "amazon"];
  const years = ["2020", "2021", "2022", "2023"];
  return companies.flatMap((company) => years.map((year) => ({ company, year })));
}

export default function CompanyYearPage({ params }: PageProps) {
  const { company, year } = params;
  const experiences = sampleExperiences[company] || [];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 px-6 md:px-20">
      {/* Added pt-32 to avoid overlapping with navbar */}
      <h1 className="text-3xl font-bold mb-6 capitalize text-center">
        {company} - {year}
      </h1>

      {experiences.length > 0 ? (
        <ExperienceCards experiences={experiences} />
      ) : (
        <p className="text-gray-600 text-center">No experiences available for this company and year.</p>
      )}
    </div>
  );
}
