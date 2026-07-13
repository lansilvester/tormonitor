import { ReactNode } from 'react';

export function PlaceholderPage({ title, description, children }: { title: string, description: string, children?: ReactNode }) {
  return (
    <div className="glass rounded-3xl p-8 h-full flex flex-col items-center justify-center min-h-[60vh] text-center border-dashed border-2 border-forest/20">
      <div className="w-16 h-16 rounded-full bg-terracotta/20 flex items-center justify-center mb-6">
        <span className="text-terracotta font-display font-bold text-2xl">!</span>
      </div>
      <h2 className="text-3xl font-display font-bold text-forest mb-3">{title}</h2>
      <p className="text-forest/60 max-w-md">{description}</p>
      {children && <div className="mt-8 w-full">{children}</div>}
    </div>
  );
}
