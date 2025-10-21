import {
  BadgeEuro,
  BookDown,
  BookMinusIcon,
  Building2,
  CircleGauge,
  Database,
  MessageCircleQuestionIcon,
  ScanEyeIcon,
  Settings,
  SquareLibraryIcon,
  UserPlus,
  Users,
} from "lucide-react";

type PropsType = {
  iconName?: string | null;
  size?: number;
};

export default function Icons({ iconName, size = 18 }: PropsType) {
  switch (iconName) {
    case "dashboard":
      return <CircleGauge size={size} />;
    case "settings":
      return <Settings size={size} />;
    case "users":
      return <UserPlus size={size} />;
    case "sale":
      return <BadgeEuro size={size} />;
    case "company":
      return <Building2 size={size} />;
    case "deposit":
      return <BookDown size={size} />;
    case "sellers":
      return <Users size={size} />;
    case "vote":
      return <Database size={size} />;
    case "surveys":
      return <ScanEyeIcon size={size} />;
    case "questions":
      return <MessageCircleQuestionIcon size={size} />;
    case "elections":
      return <SquareLibraryIcon size={size} />;
    default:
      return <BookMinusIcon size={size} />;
  }
}
