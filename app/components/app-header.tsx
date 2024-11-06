import React from "react";

const AppHeader = ({ title }: { title: string }) => {
  return (
    <div className="bg-accent-base text-white shadow-sm w-full px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-10">
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
};

export default AppHeader;
