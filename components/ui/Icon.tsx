import {
  BookOpen,
  Briefcase,
  BuildingOffice,
  Calculator,
  ChartLineUp,
  CheckCircle,
  FileText,
  GlobeHemisphereEast,
  MapPin,
  Medal,
  Receipt,
  ShieldCheck,
  UsersThree,
} from "@phosphor-icons/react";
import type { IconName } from "@/lib/types";

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  weight?: "regular" | "bold" | "duotone" | "fill" | "light" | "thin";
}

export function Icon({ name, className, size = 22, weight = "regular" }: IconProps) {
  const props = { className, size, weight };
  switch (name) {
    case "award":
      return <Medal {...props} />;
    case "book":
      return <BookOpen {...props} />;
    case "briefcase":
      return <Briefcase {...props} />;
    case "building":
      return <BuildingOffice {...props} />;
    case "calculator":
      return <Calculator {...props} />;
    case "chart":
      return <ChartLineUp {...props} />;
    case "check":
      return <CheckCircle {...props} />;
    case "file":
      return <FileText {...props} />;
    case "globe":
      return <GlobeHemisphereEast {...props} />;
    case "map":
      return <MapPin {...props} />;
    case "receipt":
      return <Receipt {...props} />;
    case "shield":
      return <ShieldCheck {...props} />;
    case "users":
      return <UsersThree {...props} />;
  }
}
