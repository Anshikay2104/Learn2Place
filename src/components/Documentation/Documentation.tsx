// import { Configuration } from "./Configuration"
import { DocNavigation } from "./DocNavigation";
import AboutUs from "./Aboutus";
import WhoWeAre from "./WhoWeAre";
import Aim from "./Aim";
import Benefits from "./Benefits";
import HelpUs from "./HelpUs";

export const Documentation = () => {
  return (
    <div>
      <div className="container mx-auto lg:max-w-screen-xl md:max-w-screen-md p-6 lg:pt-24 pt-16">
        <div className="grid grid-cols-12 gap-6">
          <div className="lg:col-span-3 col-span-12 lg:block hidden">
            <DocNavigation />
          </div>

          <div className="lg:col-span-9 col-span-12">
            <AboutUs />
            <WhoWeAre />
            <Aim />
            <Benefits />
            <HelpUs />
          </div>
        </div>
      </div>
    </div>
  );
};
