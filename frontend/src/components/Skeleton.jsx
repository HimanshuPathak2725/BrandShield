import React from 'react';

const Skeleton = ({ className, ...props }) => {
  return (
    <div 
      className={`animate-pulse bg-slate-800/50 rounded ${className}`} 
      {...props}
    />
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="grid grid-cols-12 gap-6 h-full p-6">
      <div className="col-span-12 lg:col-span-8 row-span-2 bg-slate-900/30 rounded-xl p-6 border border-white/5">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-[250px] w-full" />
      </div>

      <div className="col-span-12 lg:col-span-4 bg-slate-900/30 rounded-xl p-6 border border-white/5 flex flex-col items-center justify-center">
         <Skeleton className="h-4 w-32 absolute top-6 left-6" />
         <Skeleton className="h-40 w-40 rounded-full mb-4" />
         <Skeleton className="h-8 w-24" />
      </div>

      {[1, 2, 3].map((i) => (
        <div key={i} className="col-span-12 md:col-span-4 bg-slate-900/30 rounded-xl p-5 border border-white/5">
          <div className="flex justify-between mb-4">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-6 w-16 rounded" />
          </div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16 mb-4" />
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      ))}
      
      <div className="col-span-12 h-40 bg-slate-900/30 rounded-xl p-4 border border-white/5">
        <div className="flex justify-between mb-4">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
