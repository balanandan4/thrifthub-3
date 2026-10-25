import React from 'react';
import { BookOpen, Calculator, FileText, Compass, Sparkles } from 'lucide-react';

interface Props {
  category: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CategoryVisual: React.FC<Props> = ({ category, className = '', size = 'md' }) => {
  const getTheme = () => {
    switch (category) {
      case 'Textbooks':
        return {
          bg: 'from-blue-600/10 via-indigo-600/5 to-slate-100',
          border: 'border-blue-200/60',
          textColor: 'text-blue-700',
          icon: <BookOpen className={size === 'lg' ? 'w-12 h-12 text-blue-600' : size === 'sm' ? 'w-5 h-5 text-blue-600' : 'w-8 h-8 text-blue-600'} />,
          label: 'Academic Textbook'
        };
      case 'Calculators':
        return {
          bg: 'from-amber-600/10 via-orange-600/5 to-slate-100',
          border: 'border-amber-200/60',
          textColor: 'text-amber-700',
          icon: <Calculator className={size === 'lg' ? 'w-12 h-12 text-amber-600' : size === 'sm' ? 'w-5 h-5 text-amber-600' : 'w-8 h-8 text-amber-600'} />,
          label: 'Scientific Calculator'
        };
      case 'Notes & Study Materials':
        return {
          bg: 'from-emerald-600/10 via-teal-600/5 to-slate-100',
          border: 'border-emerald-200/60',
          textColor: 'text-emerald-700',
          icon: <FileText className={size === 'lg' ? 'w-12 h-12 text-emerald-600' : size === 'sm' ? 'w-5 h-5 text-emerald-600' : 'w-8 h-8 text-emerald-600'} />,
          label: 'Curated Notes & PYQs'
        };
      case 'Drawing & Lab Materials':
        return {
          bg: 'from-purple-600/10 via-violet-600/5 to-slate-100',
          border: 'border-purple-200/60',
          textColor: 'text-purple-700',
          icon: <Compass className={size === 'lg' ? 'w-12 h-12 text-purple-600' : size === 'sm' ? 'w-5 h-5 text-purple-600' : 'w-8 h-8 text-purple-600'} />,
          label: 'Drawing & Lab Kit'
        };
      default:
        return {
          bg: 'from-slate-600/10 via-gray-600/5 to-slate-100',
          border: 'border-slate-200/60',
          textColor: 'text-slate-700',
          icon: <Sparkles className={size === 'lg' ? 'w-12 h-12 text-slate-600' : size === 'sm' ? 'w-5 h-5 text-slate-600' : 'w-8 h-8 text-slate-600'} />,
          label: 'College Essential'
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      className={`relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br ${theme.bg} border ${theme.border} ${className}`}
    >
      {/* Subtle grid pattern background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-2 p-4 text-center">
        <div className="p-3 bg-white/90 rounded-xl shadow-xs border border-white">
          {theme.icon}
        </div>
        <span className="text-xs font-medium text-slate-600 tracking-tight">
          {theme.label}
        </span>
      </div>
    </div>
  );
};
