import React from 'react';
import { BookMarked, MapPin } from 'lucide-react';

interface Props {
  onNavigate: (view: string) => void;
  onQuickLoginShriya: () => void;
}

export const Footer: React.FC<Props> = ({ onNavigate, onQuickLoginShriya }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          {/* Brand */}
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
                <BookMarked className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold tracking-tight">ThriftHub</span>
              <span className="text-[11px] text-slate-400">· Anna University Books</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Student-to-student sharing and reselling for Anna University Regulation syllabus textbooks, exam-approved Casio calculators, and engineering graphics kits at minimal student thrift prices.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Campus pickups at CEG, MIT, ACT & affiliated college premises</span>
            </div>
          </div>

          {/* Quick Links & Single Demo Login */}
          <div className="flex flex-wrap items-center gap-6">
            <button
              onClick={() => onNavigate('explore')}
              className="hover:text-white transition-colors"
            >
              Browse Syllabus Books
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="hover:text-white transition-colors"
            >
              My Dashboard
            </button>
            <button
              onClick={onQuickLoginShriya}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition-colors font-medium"
            >
              Demo: Shriya (1-Click)
            </button>
          </div>
        </div>

        {/* Clean Bottom Line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© 2026 ThriftHub · Built for Anna University college students.</p>
          <p>Pass down your completed semester books to your juniors.</p>
        </div>
      </div>
    </footer>
  );
};
