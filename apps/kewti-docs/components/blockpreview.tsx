import React from 'react';

export function BlockPreview({ children }: { children: React.ReactNode }) {
  const [preview, code] = React.Children.toArray(children);

  return (

      <div className="p-8 flex items-center justify-center">
        {preview}
      </div>
  );
}
