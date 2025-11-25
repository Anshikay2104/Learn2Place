import { getImagePrefix } from "@/utils/util";
import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link
      href="/"
      className="flex items-center mr-4"
    >
      <div className="relative w-[120px] h-[50px] md:w-[150px] md:h-[60px]">
        <Image
          src={`${getImagePrefix()}images/logo/logo.svg`}
          alt="logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
};

export default Logo;
