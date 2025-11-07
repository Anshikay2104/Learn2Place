"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Company = {
  name: string;
  logo: string;
  years: number[];
};

const toSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "");

const companies: Company[] = [
  { name: "Walmart", logo: "/images/companies/walmart.svg", years: [2021, 2022, 2023] },
  { name: "Google", logo: "/images/companies/google.svg", years: [2020, 2021, 2022, 2023] },
  { name: "Amazon", logo: "/images/companies/amazon.svg", years: [2021, 2022, 2023] },
  { name: "Visa", logo: "/images/companies/visa.svg", years: [2020, 2021, 2023] },
  { name: "Athenahealth", logo: "/images/companies/athena.svg", years: [2022, 2023] },
];

const CompaniesPage: React.FC = () => {
  const router = useRouter();
  const [selectedYears, setSelectedYears] = useState<Record<string, number | "">>({});

  const handleYearChange = (companyName: string, year: number | "") => {
    setSelectedYears((prev) => ({ ...prev, [companyName]: year }));
  };

  const handleExperience = (companyName: string, year: number | "") => {
    if (!year) return;
    router.push(`/companies/${toSlug(companyName)}/${year}`);
  };

  const handleSummarize = (companyName: string, year: number | "") => {
    if (!year) return;
    alert(`Summarizing data for ${companyName} - ${year}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-6 md:px-20">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Explore Companies</h1>

      <div className="flex flex-col gap-6">
        {companies.map((company) => {
          const selectedYear = selectedYears[company.name] || "";

          return (
            <div
              key={company.name}
              className="flex flex-col md:flex-row justify-between items-center bg-white shadow-md hover:shadow-lg rounded-2xl p-6 border border-gray-200 transition-all duration-300"
            >
              {/* Logo & Name */}
              <div className="flex flex-col items-center justify-center w-full md:w-1/3">
                <div className="relative w-24 h-12">
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-600">{company.name}</p>
              </div>

              {/* Year Dropdown */}
              <div className="mt-4 md:mt-0 w-full md:w-1/3 flex justify-center">
                <select
                  value={selectedYear}
                  onChange={(e) =>
                    handleYearChange(company.name, e.target.value ? Number(e.target.value) : "")
                  }
                  className="w-48 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                  <option value="">Select Year</option>
                  {company.years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="mt-4 md:mt-0 w-full md:w-1/3 flex justify-end gap-4">
                <button
                  onClick={() => handleExperience(company.name, selectedYear)}
                  disabled={!selectedYear}
                  className={`px-5 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedYear
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Show Experience
                </button>

                <button
                  onClick={() => handleSummarize(company.name, selectedYear)}
                  disabled={!selectedYear}
                  className={`px-5 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedYear
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  Summarize
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompaniesPage;
