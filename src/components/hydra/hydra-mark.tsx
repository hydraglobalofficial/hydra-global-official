import Image from "next/image";
import { cn } from "@/lib/utils";

export const HYDRA_GIF_SRC = "/hydra-a.gif";

/** Public HYDRA mark — looping gif on a black plate, never cropped. */
export function HydraMark({ className }: { className?: string }) {
  return (
    <div className={cn("relative mx-auto min-w-0 w-full max-w-[40rem] bg-black", className)}>
      <Image
        src={HYDRA_GIF_SRC}
        alt="HYDRA — protection, precision, progression"
        width={818}
        height={684}
        unoptimized
        priority
        sizes="(min-width: 768px) 40rem, 92vw"
        className="h-auto w-full max-w-full bg-black object-contain object-center"
      />
    </div>
  );
}
