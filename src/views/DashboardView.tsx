import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { User, Resource, PurchaseRequest, DashboardMetrics } from '../types';
import {
  Package,
  Inbox,
  Send,
  User as UserIcon,
  CheckCircle,
  Clock,
  XCircle,
  CheckCircle2,
  Trash2,
  Edit3,
  Plus,
  Loader2,
  Key,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

interface Props {
  user: User;
  initialTab?: string;
  onOpenAddResource: () => void;
  onOpenRequestTimeline: (requestId: string) => void;
  onSelectResource: (resourceId: string) => void;
  onUserUpdated: (user: User) => void;
}

export const DashboardView: React.FC<Props> = ({
  user,
  initialTab = 'overview',
  onOpenAddResource,
  onOpenRequestTimeline,
  onSelectResource,
  onUserUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'requests' | 'incoming' | 'profile'>(
    (initialTab as any) || 'overview'
  );

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [myListings, setMyListings] = useState<Resource[]>([]);
  const [myRequests, setMyRequests] = useState<PurchaseRequest[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<PurchaseRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Profile Form state
  const [fullName, setFullName] = useState(user.full_name);
  const [branch, setBranch] = useState(user.branch || '');
  const [year, setYear] = useState(user.year || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [bio, setBio] = useState(user.bio || '');
  const [profileSaving, setProfileSaving] = useState(false);

  // Password change state
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sumRes, listRes, reqRes, incRes] = await Promise.all([
        api.getDashboardSummary(),
        api.getMyListings(),
        api.getMyRequests(),
        api.getIncomingRequests(),
      ]);

      setMetrics(sumRes.metrics);
      setMyListings(listRes.listings);
      setMyRequests(reqRes.requests);
      setIncomingRequests(incRes.requests);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (resourceId: string, current: string) => {
    try {
      const newAvail = current === 'Available' ? 'Sold' : 'Available';
      await api.updateResource(resourceId, { availability: newAvail as any });
      await loadDashboardData();
      setSuccessMsg(`Listing updated to ${newAvail}!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update availability.');
    }
  };

  const handleDeleteListing = async (resourceId: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.deleteResource(resourceId);
      await loadDashboardData();
      setSuccessMsg('Listing removed successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete listing.');
    }
  };

  const handleRespondRequest = async (requestId: string, decision: 'Accepted' | 'Rejected') => {
    try {
      await api.respondToRequest(requestId, decision);
      await loadDashboardData();
      setSuccessMsg(`Request successfully ${decision.toLowerCase()}!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to respond to request.');
    }
  };

  const handleCompleteRequest = async (requestId: string) => {
    try {
      await api.completeRequest(requestId, 'Exchange completed in-person on campus.');
      await loadDashboardData();
      setSuccessMsg('Exchange marked as Completed and item updated to Sold!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to complete exchange.');
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      setError(null);
      const res = await api.updateProfile({
        full_name: fullName,
        branch,
        year,
        phone,
        bio,
      });
      onUserUpdated(res.user);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setPwSaving(true);
      setError(null);
      await api.changePassword(currPassword, newPassword);
      setCurrPassword('');
      setNewPassword('');
      setSuccessMsg('Password changed successfully.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setPwSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Accepted
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
            <XCircle className="w-3 h-3 text-rose-600" />
            Declined
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-slate-600" />
            Completed (Sold)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
            Student Central Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome, {user.full_name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {user.branch || 'Undergraduate Student'} · {user.year || 'College'} · ID: {user.college_id || 'N/A'}
          </p>
        </div>

        <button
          onClick={onOpenAddResource}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>List a Resource</span>
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-3.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            My Total Listings
          </span>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {metrics?.total_listings ?? myListings.length}
          </div>
          <span className="text-[11px] text-slate-500">
            {metrics?.active_listings ?? 0} currently active
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Incoming Requests
          </span>
          <div className="text-2xl font-bold text-amber-600 font-mono tabular-nums mt-1">
            {incomingRequests.filter((r) => r.status === 'Pending').length}
          </div>
          <span className="text-[11px] text-slate-500">Awaiting your response</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            My Sent Requests
          </span>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {myRequests.length}
          </div>
          <span className="text-[11px] text-slate-500">Materials you requested</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Accepted Exchanges
          </span>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums mt-1">
            {myRequests.filter((r) => r.status === 'Accepted').length +
              incomingRequests.filter((r) => r.status === 'Accepted').length}
          </div>
          <span className="text-[11px] text-slate-500">Ready for campus pickup</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Completed Exchanges
          </span>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {metrics?.completed_exchanges ?? 0}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Reused on campus</span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Overview & Recent
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'listings'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>My Listings</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 font-mono">
            {myListings.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'incoming'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Incoming Requests (Seller)</span>
          {incomingRequests.filter((r) => r.status === 'Pending').length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-white font-mono font-bold">
              {incomingRequests.filter((r) => r.status === 'Pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>My Requests (Buyer)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 font-mono">
            {myRequests.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Profile & Security
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Incoming Requests needing action */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Inbox className="w-4 h-4 text-blue-600" />
                <span>Action Needed: Incoming Buyer Requests</span>
              </h3>
              <button
                onClick={() => setActiveTab('incoming')}
                className="text-xs text-blue-600 hover:underline"
              >
                View All
              </button>
            </div>

            {incomingRequests.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No purchase requests received yet.
              </p>
            ) : (
              <div className="space-y-3">
                {incomingRequests.slice(0, 4).map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 block line-clamp-1">
                        {req.resource_title}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        From: {req.buyer_name} ({req.buyer_branch || 'Student'})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {getStatusBadge(req.status)}
                      <button
                        onClick={() => onOpenRequestTimeline(req.id)}
                        className="p-1 text-slate-500 hover:text-slate-900"
                        title="View timeline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outgoing Requests sent to other students */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                <span>My Outgoing Purchase Requests</span>
              </h3>
              <button
                onClick={() => setActiveTab('requests')}
                className="text-xs text-blue-600 hover:underline"
              >
                View All
              </button>
            </div>

            {myRequests.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                You haven't requested any resources yet.
              </p>
            ) : (
              <div className="space-y-3">
                {myRequests.slice(0, 4).map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 block line-clamp-1">
                        {req.resource_title}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Seller: {req.seller_name} · ₹{req.resource_price}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {getStatusBadge(req.status)}
                      <button
                        onClick={() => onOpenRequestTimeline(req.id)}
                        className="p-1 text-slate-500 hover:text-slate-900"
                        title="View timeline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: My Listings (Module 6) */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">My Listed Resources</h2>
              <p className="text-xs text-slate-500">
                Manage your textbooks, calculators, and materials currently visible to students.
              </p>
            </div>
            <button
              onClick={onOpenAddResource}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Resource</span>
            </button>
          </div>

          {myListings.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
              You haven't listed any items yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold">
                    <th className="py-3 px-3">Item Name</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Condition</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Requests</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myListings.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <span
                          onClick={() => onSelectResource(item.id)}
                          className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer block line-clamp-1"
                        >
                          {item.title}
                        </span>
                        <span className="text-[11px] text-slate-400 block">{item.subject}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">{item.category}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900 font-mono tabular-nums">
                        ₹{item.price}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{item.condition}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                            item.availability === 'Available'
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                              : item.availability === 'Requested'
                              ? 'text-amber-700 bg-amber-50 border-amber-200'
                              : 'text-slate-600 bg-slate-100 border-slate-200'
                          }`}
                        >
                          {item.availability}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-slate-700">
                          {item.request_count || 0}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-2">
                        <button
                          onClick={() => handleToggleAvailability(item.id, item.availability)}
                          className="text-[11px] font-medium text-slate-600 hover:text-blue-600 hover:underline"
                        >
                          {item.availability === 'Sold' ? 'Mark Available' : 'Mark Sold'}
                        </button>
                        <button
                          onClick={() => handleDeleteListing(item.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Incoming Requests (Module 5 & 6) */}
      {activeTab === 'incoming' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden space-y-4 p-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Incoming Buyer Requests</h2>
            <p className="text-xs text-slate-500">
              Students interested in buying your listed educational resources. You can accept or decline requests.
            </p>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No incoming requests from buyers at this time.
            </div>
          ) : (
            <div className="space-y-4">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {req.resource_title}
                      </span>
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        ₹{req.resource_price}
                      </span>
                      {getStatusBadge(req.status)}
                    </div>

                    <p className="text-slate-600">
                      <strong>Buyer:</strong> {req.buyer_name} ({req.buyer_email}{' '}
                      {req.buyer_phone ? `· ${req.buyer_phone}` : ''})
                    </p>

                    {req.message && (
                      <p className="text-slate-700 italic bg-white p-2 rounded border border-slate-200">
                        "{req.message}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenRequestTimeline(req.id)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
                    >
                      View Timeline
                    </button>

                    {req.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleRespondRequest(req.id, 'Accepted')}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRespondRequest(req.id, 'Rejected')}
                          className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {req.status === 'Accepted' && (
                      <button
                        onClick={() => handleCompleteRequest(req.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                      >
                        Complete Exchange
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: My Requests (Module 7) */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden space-y-4 p-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">My Purchase Requests (Buyer)</h2>
            <p className="text-xs text-slate-500">
              Track the live status of requests you have sent to other students.
            </p>
          </div>

          {myRequests.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Send className="w-8 h-8 mx-auto mb-2 opacity-30" />
              You haven't requested any resources yet.
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {req.resource_title}
                      </span>
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        ₹{req.resource_price}
                      </span>
                      {getStatusBadge(req.status)}
                    </div>
                    <p className="text-slate-600">
                      <strong>Seller:</strong> {req.seller_name} ({req.seller_email})
                    </p>
                    <span className="text-[11px] text-slate-400 block">
                      Submitted on{' '}
                      {new Date(req.created_at).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenRequestTimeline(req.id)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Track Progress Timeline</span>
                    </button>

                    {req.status === 'Accepted' && (
                      <button
                        onClick={() => handleCompleteRequest(req.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                      >
                        Confirm Handover & Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: My Profile & Password */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Edit Profile */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-blue-600" />
              <span>Personal Student Information</span>
            </h3>

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Registered Email (Cannot be changed)
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Branch</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Year</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g. 3rd Year"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Contact Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bio / Note</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. CS junior looking for engineering reference books."
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs flex items-center gap-2"
              >
                {profileSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Profile Updates</span>
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" />
              <span>Change Password</span>
            </h3>

            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currPassword}
                  onChange={(e) => setCurrPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                type="submit"
                disabled={pwSaving}
                className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-2"
              >
                {pwSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Update Password</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
