export type RegistryItem = {
  name: string;
  type: "components:ui";
  dependencies?: string[];
  registryDependencies?: string[];
  files: string[];
};

export const uiRegistry: RegistryItem[] = [
  {
    name: "time",
    type: "components:ui",
    dependencies: [],
    registryDependencies: [],
    files: ["kewti-time/component.tsx"],
  },
  {
    name: "fonts",
    type: "components:ui",
    dependencies: [],
    registryDependencies: [],
    files: ["kewti-fonts/component.tsx"],
  },
  {
    name: "calender",
    type: "components:ui",
    dependencies: ["kenat", "framer-motion"],
    registryDependencies: [],
    files: ["kewti-calender/component.tsx", "kewti-calender/MonthAnimation.tsx", "kewti-calender/MonthAnimations/meskerem.tsx", "kewti-calender/MonthAnimations/tkimt.tsx", "kewti-calender/MonthAnimations/hidar.tsx", "kewti-calender/MonthAnimations/tahsas.tsx", "kewti-calender/MonthAnimations/tir.tsx", "kewti-calender/MonthAnimations/yekatit.tsx", "kewti-calender/MonthAnimations/megabit.tsx" , "kewti-calender/MonthAnimations/miazia.tsx", "kewti-calender/MonthAnimations/genbot.tsx", "kewti-calender/MonthAnimations/sene.tsx", "kewti-calender/MonthAnimations/hamle.tsx", "kewti-calender/MonthAnimations/nehase.tsx", "kewti-calender/MonthAnimations/puagme.tsx"],
  },
  {
    name: "location-selector",
    type: "components:ui",
    dependencies: [],
    registryDependencies: [],
    files: ["kewti-location-selector/component.tsx"],
  },
  {
    name: "input",
    type: "components:ui",
    dependencies: ["lucide-react"],
    registryDependencies: [],
    files: ["kewti-inputs/component.tsx", "kewti-inputs/transliterate.ts"],
  }
];