export const Students = () => {
    return (
        <section id="students" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Students Behind This Project</h2>

            <p className="text-base mb-4">
                This website is the result of a collaborative effort by a group of
                motivated students who came together to learn, build, and share.
                Each contributor brought different strengths — frontend and
                backend development, UI/UX design, documentation, and testing —
                creating an educational environment where everyone learned by
                doing.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Aim</h3>
            <p className="text-base mb-4">
                The primary aim of this project is to provide a practical,
                hands-on platform that connects current students with alumni
                experiences, resources, and company insights. It serves as a
                learning sandbox for the contributors and a useful product for
                the community — combining real-world interview experiences,
                guided learning paths, and mentorship opportunities.
            </p>

            <h3 className="text-lg font-semibold mt-4 mb-2">Benefits of the Website</h3>
            <ul className="list-disc pl-6 text-base mb-4">
                <li className="mb-2">
                    Practical Learning: Contributors practice full-stack
                    development workflows (design, implementation, testing,
                    and deployment).
                </li>
                <li className="mb-2">
                    Community Knowledge Sharing: Students can read alumni
                    interview experiences to learn hiring patterns, common
                    interview questions, and career advice.
                </li>
                <li className="mb-2">
                    Career Preparation: The site gathers company-specific
                    insights and curated resources that help students prepare
                    for interviews and internships.
                </li>
                <li className="mb-2">
                    Collaboration & Mentorship: The platform fosters
                    connections between students and alumni, enabling
                    mentorship, networking, and guidance on career choices.
                </li>
                <li>
                    Real Product Experience: Contributors gain portfolio
                    material and practical experience working on a real
                    product used by peers and alumni.
                </li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 mb-2">How You Can Help</h3>
            <p className="text-base mb-4">
                If you are a student or alumnus, you can contribute by sharing
                experiences, adding resources, reporting issues, or suggesting
                improvements. Contributors are welcome — whether you want to
                code, design, write documentation, or help moderate content.
            </p>
        </section>
    );
};

export default Students;
