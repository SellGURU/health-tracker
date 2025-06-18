import { ReactNode } from "react";
import BottomNavigation from "./bottom-navigation";

interface MobileLayoutProps {
  children: ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      <BottomNavigation />
    </div>
  );
}
