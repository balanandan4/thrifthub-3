import React from 'react';
import { Resource } from '../types';
import { ResourceCard } from '../components/ResourceCard';
import {
  BookOpen,
  Calculator,
  FileText,
  Compass,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  MapPin,
  Tag
} from 'lucide-react';

interface Props {
  resources: Resource[];
  onNavigate: (view: string, param?: string) => void;
  onSelectResource: (id: string) => void;
  onRequestResource: (resource: Resource) => void;
  onOpenAddResource: () => void;
  currentUserId?: string;
}

export const HomeView: React.FC<Props> = ({
  resources,
  onNavigate,
  onSelectResource,
  onRequestResource,
  onOpenAddResource,
  currentUserId,
}) => {
  const featured = resources.slice(0, 6);

  const categories = [
    {
      title: 'Anna Univ Textbooks',
      desc: 'Singaravelu Maths (MA3151), Python (GE3151), DPCO (CS3351), DBMS, OS.',
      category: 'Textbooks',
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      count: resources.filter((r) => r.category === 'Textbooks').length,
    },
    {
      title: 'Exam-Permitted Calculators',
      desc: 'Casio fx-991ES Plus 2nd Edition (approved for Anna Univ exam hall tickets).',
      category: 'Calculators',
      icon: <Calculator className="w-5 h-5 text-amber-600" />,
      count: resources.filter((r) => r.category === 'Calculators').length,
    },
    {
      title: 'Lab Records & Solved PYQs',
      desc: 'Semester 3 & 4 verified lab code, question banks, and handwritten notes.',
      category: 'Notes & Study Materials',
      icon: <FileText className="w-5 h-5 text-emerald-600" />,
      count: resources.filter((r) => r.category === 'Notes & Study Materials').length,
    },
    {
      title: 'Drawing & Lab Tools',
      desc: 'GE3251 Engineering Graphics mini drafters, roller scales, and breadboard kits.',
      category: 'Drawing & Lab Materials',
      icon: <Compass className="w-5 h-5 text-purple-600" />,
      count: resources.filter((r) => r.category === 'Drawing & Lab Materials').length,
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'List Completed Semester Books',
      desc: 'Cleared your semester? Post your Singaravelu math books, drafters, or lab kits with minimal student prices.',
    },
    {
      num: '02',
      title: 'Search by Anna Univ Subject Code',
      desc: 'Juniors can search MA3151, CS3351, or PH3151 to pick up required textbooks for ₹90–₹150 instead of full price.',
    },
    {
      num: '03',
      title: 'Send a Friendly Request',
      desc: 'Send a quick message with your phone number and coordinate when to meet on campus.',
    },
    {
      num: '04',
      title: 'Meet & Handover on Campus',
      desc: 'Meet outside the college library, department block, or canteen during break and complete the exchange.',
    },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/20 text-blue-300 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>Anna University Regulation Syllabus Books & Exchange</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Good Things Deserve a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              Second Story.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Pass along your cleared Anna University semester textbooks, Casio calculators, and EG mini-drafters to juniors at minimal thrift prices.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('explore')}
              className="px-6 py-3 text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md flex items-center gap-2 group"
            >
              <span>Browse Syllabus Books</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onOpenAddResource}
              className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>Sell a Book / Tool</span>
            </button>
          </div>

          {/* Realistic Student Value Strip */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-800 text-left">
            <div>
              <span className="text-xl font-bold text-white font-mono tabular-nums block">
                ₹50 – ₹180
              </span>
              <span className="text-xs text-slate-400">Affordable Textbook Range</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white font-mono tabular-nums block">
                Regulation 2021
              </span>
              <span className="text-xs text-slate-400">Anna University Prescribed</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white font-mono tabular-nums block">
                Exam Approved
              </span>
              <span className="text-xs text-slate-400">Casio fx-991ES Plus</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white font-mono tabular-nums block">
                Campus Pickup
              </span>
              <span className="text-xs text-slate-400">CEG, MIT, & Affiliated Colleges</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Categories Section */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                Anna University Curriculum
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Academic Sharing Categories
              </h2>
            </div>
            <button
              onClick={() => onNavigate('explore')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((c) => (
              <div
                key={c.category}
                onClick={() => onNavigate('explore', c.category)}
                className="p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 bg-slate-50 group-hover:bg-blue-50 rounded-lg w-fit mb-4 transition-colors">
                    {c.icon}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{c.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{c.count} Items Available</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Listings Section */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                Recently Added on Campus
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Available Anna University Textbooks & Tools
              </h2>
            </div>
            <button
              onClick={() => onNavigate('explore')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
            >
              <span>View All Listings</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onClick={() => onSelectResource(resource.id)}
                onRequestClick={() => onRequestResource(resource)}
                isOwner={currentUserId === resource.seller_id}
              />
            ))}
          </div>
        </section>

        {/* How Student Exchange Works */}
        <section className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
              Campus Handover
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
              How Students Exchange Books on Campus
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Straightforward and completely peer-to-peer. No complex payments—just coordinate with your college senior or junior.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st) => (
              <div key={st.num} className="space-y-2">
                <span className="text-xl font-bold text-blue-600 font-mono tabular-nums block">
                  {st.num}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{st.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Practical Student FAQ */}
        <section className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Common Questions from College Students
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Are these books strictly for Anna University Regulation 2021?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes! Every listing includes the official Anna University subject code (e.g. MA3151, CS3351, PH3151) and author so juniors know it matches their syllabus.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Where do we meet for the book exchange?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Most students meet outside the campus central library, department blocks, or the college canteen during lunch break or after 4 PM.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Why are the prices so low?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                ThriftHub is created for college students to reuse books rather than let them gather dust. Seniors list books at minimal thrift rates (₹80–₹160) to help juniors.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                Is the Casio fx-991ES Plus allowed in semester exams?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes, Casio fx-991ES Plus / fx-991MS non-programmable scientific calculators are officially permitted by Anna University Controller of Examinations.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
