import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

const sizes = {
  sm: {
    clip: "h-16",
    width: 360,
    height: 144,
    image: "h-24 w-auto max-w-[360px] -my-6",
  },
  md: {
    clip: "h-11 sm:h-12",
    width: 300,
    height: 110,
    image: "h-[4.5rem] sm:h-20 w-auto max-w-[300px] -my-3.5",
  },
  lg: {
    clip: "h-[3.75rem] sm:h-16 lg:h-20",
    width: 500,
    height: 176,
    image: "h-32 sm:h-36 lg:h-[9.5rem] w-auto max-w-[440px] sm:max-w-[520px] lg:max-w-[560px] -my-7 sm:-my-8 lg:-my-9",
  },
} as const;

interface BrandLogoProps {
  size?: keyof typeof sizes;
  className?: string;
  href?: string | null;
  priority?: boolean;
}

export function BrandLogo({ size = "md", className, href = "/", priority = false }: BrandLogoProps) {
  const dim = sizes[size];

  const image = (
    <span className={cn("inline-flex items-center overflow-hidden shrink-0", dim.clip)}>
      <Image
        src={brand.logo}
        alt={brand.name}
        width={dim.width}
        height={dim.height}
        priority={priority}
        className={cn(dim.image, "object-contain object-left", className)}
      />
    </span>
  );

  if (!href) return image;

  return (
    <Link href={href} className="inline-flex shrink-0 group">
      {image}
    </Link>
  );
}
