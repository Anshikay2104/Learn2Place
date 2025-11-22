import { getImagePrefix } from "@/utils/util";
import Image from "next/image";
import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link
      href="/"
      style={{
        display: "flex",
        alignItems: "center",
        marginRight: "48px", // more spacing from Home
      }}
    >
      <Image
        src={`${getImagePrefix()}images/logo/logo.svg`}
        alt="logo"
        width={50}   // significantly smaller now
        height={18}  // proportionally scaled
        style={{
          width: "auto",
          height: "auto",
        }}
        quality={100}
      />
    </Link>
  );
};

export default Logo;
