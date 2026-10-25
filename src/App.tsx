import React, { useEffect, useState } from 'react';
import { api } from './api';
import { User, Resource, NotificationItem } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { ResourceDetailView } from './views/ResourceDetailView';
import { DashboardView } from './views/DashboardView';
import { AdminView } from './views/AdminView';
import { AuthModals } from './components/AuthModals';
import { AddResourceModal } from './components/AddResourceModal';
import { RequestModal } from './components/RequestModal';
import { RequestTimelineModal } from './components/RequestTimelineModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Navigation State
  const [activeView, setActiveView] = useState<'home' | 'explore' | 'detail' | 'dashboard' | 'admin'>('home');
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [dashboardTab, setDashboardTab] = useState<string>('overview');
  const [exploreCategory, setExploreCategory] = useState<string>('All');

  // Resource Data
  const [resources, setResources] = useState<Resource[]>([]);

  // Modals
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [addResourceModalOpen, setAddResourceModalOpen] = useState(false);
  const [requestModalResource, setRequestModalResource] = useState<Resource | null>(null);
  const [timelineRequestId, setTimelineRequestId] = useState<string | null>(null);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize Auth & Data
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      setAuthLoading(true);
      const authRes = await api.getMe().catch(() => null);
      if (authRes && authRes.user) {
        setCurrentUser(authRes.user);
      }
    } finally {
      setAuthLoading(false);
    }
    loadResources();
  };

  // Poll / refresh notifications when logged in
  useEffect(() => {
    if (currentUser) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 15000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [currentUser]);

  const loadNotifications = async () => {
    if (!currentUser) return;
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications);
      setUnreadCount(res.unread_count);
    } catch {
      // Ignore background notification fetch errors
    }
  };

  const loadResources = async () => {
    try {
      const res = await api.getResources();
      setResources(res.resources);
    } catch (err) {
      console.error('Failed to load resources:', err);
    }
  };

  // Single Demo Login: Shriya Only
  const handleQuickLoginShriya = async () => {
    try {
      setAuthLoading(true);
      const res = await api.login('shriya@thrifthub.in', 'Shriya@123');
      setCurrentUser(res.user);
      await loadNotifications();
      await loadResources();
    } catch (err: any) {
      console.error('Demo login error:', err);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.logout().catch(() => {});
    setCurrentUser(null);
    if (activeView === 'dashboard' || activeView === 'admin') {
      setActiveView('home');
    }
  };

  const handleNavigate = (view: string, param?: string) => {
    if (view === 'explore') {
      if (param) setExploreCategory(param);
      else setExploreCategory('All');
      setActiveView('explore');
    } else if (view === 'detail' && param) {
      setSelectedResourceId(param);
      setActiveView('detail');
    } else if (view === 'dashboard') {
      if (!currentUser) {
        setLoginModalOpen(true);
        return;
      }
      if (param) setDashboardTab(param);
      else setDashboardTab('overview');
      setActiveView('dashboard');
    } else if (view === 'admin') {
      if (!currentUser || currentUser.role !== 'admin') {
        alert('Campus admin account required. Shriya demo account has administrative access.');
        return;
      }
      setActiveView('admin');
    } else {
      setActiveView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestResource = (resource: Resource) => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    setRequestModalResource(resource);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        user={currentUser}
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenRegister={() => setRegisterModalOpen(true)}
        onOpenAddResource={() => {
          if (!currentUser) {
            setLoginModalOpen(true);
          } else {
            setAddResourceModalOpen(true);
          }
        }}
        unreadCount={unreadCount}
        onToggleNotifications={() => setNotificationDrawerOpen(!notificationDrawerOpen)}
        onLogout={handleLogout}
        onQuickLoginShriya={handleQuickLoginShriya}
      />

      {/* Main View */}
      <main className="flex-1">
        {authLoading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
            <p className="text-xs text-slate-500">Loading ThriftHub...</p>
          </div>
        ) : (
          <>
            {activeView === 'home' && (
              <HomeView
                resources={resources}
                onNavigate={handleNavigate}
                onSelectResource={(id) => handleNavigate('detail', id)}
                onRequestResource={handleRequestResource}
                onOpenAddResource={() => {
                  if (!currentUser) setLoginModalOpen(true);
                  else setAddResourceModalOpen(true);
                }}
                currentUserId={currentUser?.id}
              />
            )}

            {activeView === 'explore' && (
              <ExploreView
                resources={resources}
                initialCategory={exploreCategory}
                onSelectResource={(id) => handleNavigate('detail', id)}
                onRequestResource={handleRequestResource}
                onOpenAddResource={() => {
                  if (!currentUser) setLoginModalOpen(true);
                  else setAddResourceModalOpen(true);
                }}
                currentUserId={currentUser?.id}
              />
            )}

            {activeView === 'detail' && selectedResourceId && (
              <ResourceDetailView
                resourceId={selectedResourceId}
                currentUser={currentUser}
                onBack={() => handleNavigate('explore')}
                onRequestClick={handleRequestResource}
                onNavigateToDashboard={(tab) => handleNavigate('dashboard', tab)}
              />
            )}

            {activeView === 'dashboard' && currentUser && (
              <DashboardView
                user={currentUser}
                initialTab={dashboardTab}
                onOpenAddResource={() => setAddResourceModalOpen(true)}
                onOpenRequestTimeline={(reqId) => setTimelineRequestId(reqId)}
                onSelectResource={(id) => handleNavigate('detail', id)}
                onUserUpdated={(updated) => setCurrentUser(updated)}
              />
            )}

            {activeView === 'admin' && currentUser && (
              <AdminView
                currentUser={currentUser}
                onNavigateHome={() => handleNavigate('home')}
                onSelectResource={(id) => handleNavigate('detail', id)}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onQuickLoginShriya={handleQuickLoginShriya} />

      {/* Modals & Drawers */}
      <AuthModals
        isLoginOpen={loginModalOpen}
        isRegisterOpen={registerModalOpen}
        onCloseLogin={() => setLoginModalOpen(false)}
        onCloseRegister={() => setRegisterModalOpen(false)}
        onSwitchToRegister={() => {
          setLoginModalOpen(false);
          setRegisterModalOpen(true);
        }}
        onSwitchToLogin={() => {
          setRegisterModalOpen(false);
          setLoginModalOpen(true);
        }}
        onAuthSuccess={(u) => {
          setCurrentUser(u);
          loadNotifications();
          loadResources();
        }}
      />

      <AddResourceModal
        isOpen={addResourceModalOpen}
        onClose={() => setAddResourceModalOpen(false)}
        onSuccess={() => {
          loadResources();
          handleNavigate('dashboard', 'listings');
        }}
      />

      <RequestModal
        resource={requestModalResource}
        isOpen={!!requestModalResource}
        onClose={() => setRequestModalResource(null)}
        onSuccess={() => {
          loadResources();
          handleNavigate('dashboard', 'requests');
        }}
      />

      <RequestTimelineModal
        requestId={timelineRequestId}
        currentUser={currentUser}
        isOpen={!!timelineRequestId}
        onClose={() => setTimelineRequestId(null)}
        onStatusChanged={() => {
          loadResources();
          loadNotifications();
        }}
      />

      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkRead={async (id) => {
          await api.markNotificationRead(id);
          loadNotifications();
        }}
        onMarkAllRead={async () => {
          await api.markAllNotificationsRead();
          loadNotifications();
        }}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
