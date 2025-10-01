import React from "react";

export default function ProfileWrapperLoading({ gap, col }: { gap?: number; col?: boolean }) {
  return (
    <div
      className={`bg-[#222222] rounded-lg w-1/4 animate-pulse`}
      style={{ gap: gap ? `${gap * 4}px` : undefined, display: col ? 'flex' : 'inline-flex', flexDirection: col ? 'column' : 'row', padding: '1rem' }}
    >
      <div className="bg-gray-600 rounded-full w-12 h-12" />
      <div className="bg-gray-600 rounded w-1/4 h-6 mt-2" />
      <div className="bg-gray-600 rounded w-2/4 h-6 mt-2" />
      <div className="bg-gray-600 rounded w-3/4 h-6 mt-2" />
    </div>
  )
}
