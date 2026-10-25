import React, { useState, useMemo } from 'react';
import { Resource } from '../types';
import { ResourceCard } from '../components/ResourceCard';
import { Search, BookOpen, X, Plus } from 'lucide-react';

interface Props {
  resources: Resource[];
  initialCategory?: string;
  onSelectResource: (id: string) => void;
  onRequestResource: (resource: Resource) => void;
  onOpenAddResource: () => void;
  currentUserId?: string;
}

const CATEGORIES = [
  'All',
  'Textbooks',
  'Calculators',
  'Notes & Study Materials',
  'Drawing & Lab Materials',
];

const SEMESTERS = [
  'All',
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
];

export const ExploreView: React.FC<Props> = ({
  resources,
  initialCategory,
  onSelectResource,
  onRequestResource,
  onOpenAddResource,
  currentUserId,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<'All' | 'Available' | 'Sold'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  // Filtered & Sorted items
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Semester filter
      if (selectedSemester !== 'All' && item.semester !== selectedSemester && item.semester !== 'All Semesters') {
        return false;
      }
      // Availability filter
      if (availabilityFilter !== 'All') {
        if (availabilityFilter === 'Available' && item.availability === 'Sold') return false;
        if (availabilityFilter === 'Sold' && item.availability !== 'Sold') return false;
      }
      // Search term
      if (search.trim()) {
        const term = search.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(term);
        const matchesSubject = item.subject.toLowerCase().includes(term);
        const matchesAuthor = item.author_or_brand.toLowerCase().includes(term);
        const matchesDesc = item.description.toLowerCase().includes(term);
        if (!matchesTitle && !matchesSubject && !matchesAuthor && !matchesDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [resources, selectedCategory, selectedSemester, availabilityFilter, search, sortBy]);

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedSemester('All');
    setAvailabilityFilter('All');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
            Anna University Syllabus Materials
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Browse Syllabus Books & Materials
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Prescribed Regulation 2021 textbooks, Casio calculators, and lab drafters from students.
          </p>
        </div>

        <button
          onClick={onOpenAddResource}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Sell a Book / Tool</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Anna Univ subject code (e.g. MA3151, CS3351), author (Singaravelu), or tool..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex flex-wrap items-center gap-3">
            {/* Semester Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Semester:</span>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
              >
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Status:</span>
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value as any)}
                className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
              >
                <option value="All">All Items</option>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
              >
                <option value="newest">Recently Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {(selectedCategory !== 'All' || selectedSemester !== 'All' || availabilityFilter !== 'All' || search) && (
              <button
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="text-slate-900">{filteredResources.length}</strong> Anna University syllabus items
        </span>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900">No books found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No materials match your active search filter. Try searching by subject code like "MA3151" or clear your filters.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onClick={() => onSelectResource(resource.id)}
              onRequestClick={() => onRequestResource(resource)}
              isOwner={currentUserId === resource.seller_id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
