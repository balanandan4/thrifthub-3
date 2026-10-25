import React from 'react';
import { Resource } from '../types';
import { CategoryVisual } from './CategoryVisual';
import { User, Tag } from 'lucide-react';

interface Props {
  resource: Resource;
  onClick: () => void;
  onRequestClick?: (e: React.MouseEvent) => void;
  isOwner?: boolean;
}

export const ResourceCard: React.FC<Props> = ({ resource, onClick, onRequestClick, isOwner }) => {
  const getAvailabilityStyle = () => {
    switch (resource.availability) {
      case 'Available':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Requested':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Sold':
        return 'text-slate-600 bg-slate-100 border-slate-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Visual Area */}
      <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
        {resource.image_url ? (
          <img
            src={resource.image_url}
            alt={resource.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <CategoryVisual category={resource.category} className="w-full h-full" />
        )}

        {/* Availability Tag */}
        <div className="absolute top-2.5 right-2.5">
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getAvailabilityStyle()}`}
          >
            {resource.availability}
          </span>
        </div>

        {/* Condition subtle text on bottom left of image */}
        <div className="absolute bottom-2 left-2 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
          {resource.condition}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line (Clean unboxed text with · separators) */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-1.5 flex-wrap">
            <span>{resource.category}</span>
            <span aria-hidden="true">·</span>
            <span>{resource.semester}</span>
            <span aria-hidden="true">·</span>
            <span>{resource.subject}</span>
          </div>

          {/* Item Title */}
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors mb-1">
            {resource.title}
          </h3>

          {/* Author or Brand */}
          <p className="text-xs text-slate-600 line-clamp-1 mb-2">
            By <span className="font-medium">{resource.author_or_brand}</span>
          </p>
        </div>

        {/* Footer Area: Price & Seller */}
        <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
              Resale Price
            </span>
            <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
              ₹{resource.price}
            </div>
          </div>

          <div className="text-right">
            {isOwner ? (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Your Listing
              </span>
            ) : resource.availability === 'Available' && onRequestClick ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestClick(e);
                }}
                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
              >
                Request
              </button>
            ) : (
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <User className="w-3 h-3 text-slate-400" />
                <span>{resource.seller_name?.split(' ')[0] || 'Student'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
