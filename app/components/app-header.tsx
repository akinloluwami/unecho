import React from "react";
import { SidebarTrigger } from "./ui/sidebar";

const AppHeader = ({ title }: { title: string }) => {
  return (
    <div className="bg-accent-base text-white shadow-sm w-full px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-10">
      <div className="flex items-center gap-x-2">
        <SidebarTrigger className="lg:hidden flex" />
        <h2 className="lg:text-xl text-lg font-semibold">{title}</h2>
      </div>
    </div>
  );
};

export default AppHeader;
