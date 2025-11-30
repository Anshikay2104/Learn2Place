"use client";

import { useState, useEffect } from "react";
import QuestionCard from "./QuestionCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Question {
  id: string;
  title: string;
  body: string;
  created_at: string;
  answersCount?: number;
}

type Props = {
  initialQuestions: Question[];
  totalCount: number;
};

const QUESTIONS_PER_PAGE = 5;

export default function ForumPagination({ initialQuestions, totalCount }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(totalCount / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;

  useEffect(() => {
    // Fetch questions for the current page (including page 1)
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/questions/paginated?page=${currentPage}&limit=${QUESTIONS_PER_PAGE}`
        );
        if (res.ok) {
          const data = await res.json();
          setQuestions(data.questions || []);
        }
      } catch (err) {
        console.error("Error fetching paginated questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Questions list */}
      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading questions...</div>
        ) : questions.length > 0 ? (
          questions.map((q) => (
            <QuestionCard key={q.id} id={q.id} title={q.title} body={q.body} created_at={q.created_at} answersCount={q.answersCount} />
          ))
        ) : (
          <div className="text-sm text-gray-500">No questions found.</div>
        )}
      </div>

      {/* Pagination controls */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between mt-8 p-4 bg-white rounded-lg border">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <ChevronLeft size={18} />
            Previous
          </button>

          <div className="text-sm text-gray-600 font-medium">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            Next
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </>
  );
}
