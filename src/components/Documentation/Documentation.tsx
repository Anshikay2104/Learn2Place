// import { Configuration } from "./Configuration"
import { DocNavigation } from "./DocNavigation";
import AboutUs from "./Aboutus";
import WhoWeAre from "./WhoWeAre";
import Aim from "./Aim";
import Benefits from "./Benefits";
import HelpUs from "./HelpUs";

export const Documentation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <div className="container mx-auto max-w-screen-xl px-6 pt-28 pb-20">

        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            About <span className="text-indigo-600">Learn2Place</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Built by students, for students — to make placement preparation
            transparent, collaborative, and accessible.
          </p>
        </div>

        <div className="grid grid-cols-12 gap-10">

          {/* LEFT NAV */}
          <aside className="lg:col-span-3 hidden lg:block sticky top-32 h-fit">
            <div className="bg-white border rounded-2xl shadow-sm p-5">
              <DocNavigation />
            </div>
          </aside>

          {/* CONTENT */}
          <main className="lg:col-span-9 col-span-12 space-y-12">
            <AboutUs />
            <WhoWeAre />
            <Aim />
            <Benefits />
            <HelpUs />
          </main>
        </div>
      </div>
    </div>
  );
};