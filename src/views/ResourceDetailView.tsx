import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Resource, User } from '../types';
import { CategoryVisual } from '../components/CategoryVisual';
import {
  ArrowLeft,
  User as UserIcon,
  ShieldCheck,
  Send,
  Calendar,
  CheckCircle,
  HelpCircle,
  Tag,
  BookOpen,
  Loader2,
  Share2
} from 'lucide-react';

interface Props {
  resourceId: string;
  currentUser: User | null;
  onBack: () => void;
  onRequestClick: (resource: Resource) => void;
  onNavigateToDashboard: (tab: string) => void;
}

export const ResourceDetailView: React.FC<Props> = ({
  resourceId,
  currentUser,
  onBack,
  onRequestClick,
  onNavigateToDashboard,
}) => {
  const [resource, setResource] = useState<Resource | null>(null);
  const [totalRequests, setTotalRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadResource();
  }, [resourceId]);

  const loadResource = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getResourceById(resourceId);
      setResource(res.resource);
      setTotalRequests(res.total_requests);
    } catch (err: any) {
      setError(err.message || 'Failed to load educational resource.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading resource details...</p>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-sm text-rose-600 font-medium">{error || 'Resource not found.'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isOwner = currentUser?.id === resource.seller_id;

  const getAvailabilityBadge = () => {
    switch (resource.availability) {
      case 'Available':
        return (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md">
            Available for Request
          </span>
        );
      case 'Requested':
        return (
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-md">
            Request in Progress
          </span>
        );
      case 'Sold':
        return (
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
            Sold & Completed
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Presentation (Lead with Imagery) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative shadow-xs">
            {resource.image_url ? (
              <img
                src={resource.image_url}
                alt={resource.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <CategoryVisual category={resource.category} size="lg" className="w-full h-full" />
            )}
            <div className="absolute top-3 left-3">
              {getAvailabilityBadge()}
            </div>
          </div>

          {/* Academic Syllabus Metadata Card */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Academic Curriculum Specifications
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Subject / Course</span>
                <span className="font-semibold text-slate-900">{resource.subject}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Recommended Semester</span>
                <span className="font-semibold text-slate-900">{resource.semester}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Author / Brand / Edition</span>
                <span className="font-semibold text-slate-900">{resource.author_or_brand}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Physical Condition</span>
                <span className="font-semibold text-slate-900">{resource.condition}</span>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Seller Description & Notes
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {resource.description || 'No detailed seller notes provided.'}
            </p>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module (PDP) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div>
              {/* Category & Date */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span>{resource.category}</span>
                <span aria-hidden="true">·</span>
                <span>
                  Listed {new Date(resource.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <h1 className="text-xl font-bold text-slate-900 leading-snug">
                {resource.title}
              </h1>
            </div>

            {/* Price block */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                  Student Resale Price
                </span>
                <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                  ₹{resource.price}
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-500">
                <span>Condition: </span>
                <strong className="text-slate-900">{resource.condition}</strong>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              {isOwner ? (
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 font-medium text-center">
                    This is your active listing ({totalRequests} purchase requests received)
                  </div>
                  <button
                    onClick={() => onNavigateToDashboard('listings')}
                    className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
                  >
                    Manage in My Listings
                  </button>
                </div>
              ) : resource.availability === 'Sold' ? (
                <button
                  disabled
                  className="w-full py-3 text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed"
                >
                  This Item Has Been Sold
                </button>
              ) : (
                <button
                  onClick={() => onRequestClick(resource)}
                  className="w-full py-3 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Purchase Request</span>
                </button>
              )}
            </div>

            {/* Share / Copy link */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
              <button
                onClick={handleShare}
                className="hover:text-slate-900 transition-colors flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Link Copied!' : 'Share Resource Link'}</span>
              </button>
              <span>{totalRequests} Requests Logged</span>
            </div>
          </div>

          {/* Seller Profile Information Card */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Student Seller Information
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                {resource.seller_name?.charAt(0) || 'S'}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {resource.seller_name}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {resource.seller_branch || 'College Student'} · {resource.seller_year || 'Undergraduate'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-900 block mb-0.5">Campus Pickup Note:</span>
              Coordinate directly with the seller to meet at the campus library, canteen, or department block. Check the textbook condition in person and pay via student UPI or cash.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
