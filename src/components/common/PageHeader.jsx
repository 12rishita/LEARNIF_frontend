import React from "react";

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-gray-900">
          {title}
        </h1>

        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>

      {children && <div>{children}</div>}
    </div>
  );
};

export default PageHeader;
