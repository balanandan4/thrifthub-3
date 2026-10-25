import React, { useState } from 'react';
import { User } from '../types';
import { Bell, BookMarked, Plus, LogIn, User as UserIcon, Shield } from 'lucide-react';

interface Props {
  user: User | null;
  activeView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenAddResource: () => void;
  unreadCount: number;
  onToggleNotifications: () => void;
  onLogout: () => void;
  onQuickLoginShriya: () => void;
}

export const Navbar: React.FC<Props> = ({
  user,
  activeView,
  onNavigate,
  onOpenLogin,
  onOpenRegister,
  onOpenAddResource,
  unreadCount,
  onToggleNotifications,
  onLogout,
  onQuickLoginShriya,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs group-hover:bg-blue-700 transition-colors">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                ThriftHub
              </span>
              <span className="text-[10px] font-medium text-slate-500 tracking-wider block">
                Anna Univ Campus Exchange
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean, Human Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeView === 'home' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('explore')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
              activeView === 'explore' ? 'text-blue-600 font-semibold' : ''
            }`}
          >
            Browse Syllabus Books
          </button>
          {user && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
                activeView === 'dashboard' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              My Dashboard
            </button>
          )}
          {user?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 hover:text-slate-900 ${
                activeView === 'admin' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Campus Admin</span>
            </button>
          )}
        </nav>

        {/* Zone 3: User Controls & Single Demo Button */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <>
              {/* Notification Button */}
              <button
                onClick={onToggleNotifications}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* List a Book / Resource CTA */}
              <button
                onClick={onOpenAddResource}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Sell a Book</span>
              </button>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs">
                    {user.full_name.charAt(0)}
                  </div>
                  <div className="hidden xl:block text-left">
                    <span className="text-xs font-semibold text-slate-900 block leading-none">
                      {user.full_name}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {user.branch || 'Student'}
                    </span>
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900">{user.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="text-[10px] text-blue-600 font-medium mt-0.5 block">
                        Roll: {user.college_id || 'Anna Univ'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Listings & Requests</span>
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          onNavigate('admin');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-blue-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Shield className="w-3.5 h-3.5 text-blue-600" />
                        <span>Admin Console</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        onLogout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              {/* Single Demo Login: Shriya */}
              <button
                onClick={onQuickLoginShriya}
                className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap"
                title="1-Click login as Shriya (Anna University CSE Student)"
              >
                Demo: Shriya
              </button>

              <button
                onClick={onOpenLogin}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>

              <button
                onClick={onOpenRegister}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs whitespace-nowrap shrink-0"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
