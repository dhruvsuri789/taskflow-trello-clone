import Image from "next/image";
import Link from "next/link";

import { cn, headingFont } from "@/lib/utils";

function Logo() {
  return (
    <Link href="/">
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        {/* <Image src="/logo.svg" alt="TaskFlow Logo" height={30} width={30} /> */}
        <Image src="/logo2.svg" alt="TaskFlow Logo" height={30} width={30} />
        <p
          className={cn("text-lg text-neutral-700 pb-1", headingFont.className)}
        >
          TaskFlow
        </p>
      </div>
    </Link>
  );
}

export default Logo;
