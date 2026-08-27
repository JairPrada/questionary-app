import type { UseCaseCategory } from "@/lib/types";
import type { AnimatedVariant } from "@/components/ui/animated-background";

const CATEGORY_VARIANT: Record<UseCaseCategory, AnimatedVariant> = {
  idiomas: "aurora",
  entrevistas: "ocean",
  negocios: "sunset",
  ocio: "lavender",
};

const VARIANTS: AnimatedVariant[] = ["aurora", "ocean", "sunset", "lavender"];

function hash(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export function variantForCategory(c?: UseCaseCategory): AnimatedVariant {
  return c ? CATEGORY_VARIANT[c] : "aurora";
}

export function variantForTitle(t: string): AnimatedVariant {
  return VARIANTS[hash(t) % VARIANTS.length];
}
