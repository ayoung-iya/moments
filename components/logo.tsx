type Size = "sm" | "base" | "lg";

const LogoSize = {
  sm: "text-xl sm:text-2xl",
  base: "text-5xl sm:text-6xl",
  lg: "text-4xl sm:text-5xl",
};

export default function Logo({ size = "base" }: { size: Size }) {
  return <span className={`select-none font-bold ${LogoSize[size]}`}>Moments</span>;
}
