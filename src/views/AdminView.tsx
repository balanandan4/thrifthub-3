import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { AdminStats, User, AuditLog, Resource } from '../types';
import {
  Shield,
  Users,
  Package,
  CheckCircle,
  FileText,
  Trash2,
  Search,
  Filter,
  Loader2,
  TrendingUp,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

interface Props {
  currentUser: User;
  onNavigateHome: () => void;
  onSelectResource: (id: string) => void;
}

const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#8b5cf6', '#64748b'];

export const AdminView: React.FC<Props> = ({ currentUser, onNavigateHome, onSelectResource }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<(User & { listing_count: number; request_count: number })[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'listings' | 'logs'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, usersRes, logsRes, resRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getAdminAuditLogs(),
        api.getResources(),
      ]);

      setStats(statsRes);
      setUsers(usersRes.users);
      setAuditLogs(logsRes.logs);
      setResources(resRes.resources);
    } catch (err: any) {
      setError(err.message || 'Failed to load administrator console.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (resourceId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove listing "${title}" for compliance?`)) return;
    try {
      await api.deleteResource(resourceId);
      setActionMsg(`Listing "${title}" removed by administrator.`);
      setTimeout(() => setActionMsg(null), 3000);
      await loadAdminData();
    } catch (err: any) {
      setError(err.message || 'Failed to remove listing.');
    }
  };

  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Access Denied</h2>
        <p className="text-xs text-slate-600">
          This panel is restricted to verified campus administrators. Use the demo account switcher to log in as Administrator.
        </p>
        <button
          onClick={onNavigateHome}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          Return to ThriftHub Home
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading campus management console...</p>
      </div>
    );
  }

  const filteredUsers = users.filter((u) =>
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.branch && u.branch.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredResources = resources.filter((r) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.seller_name && r.seller_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded">
              Campus Administration
            </span>
            <span className="text-xs text-slate-400">Moderator: {currentUser.full_name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            ThriftHub Platform Management
          </h1>
          <p className="text-xs text-slate-500">
            Monitor registered student exchanges, verify catalog quality, and audit administrative actions.
          </p>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
          {error}
        </div>
      )}

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Students
          </span>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {stats?.summary.total_students || 0}
          </div>
          <span className="text-[11px] text-slate-500">Registered on campus</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Listings
          </span>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {stats?.summary.total_resources || 0}
          </div>
          <span className="text-[11px] text-slate-500">Academic items</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Available Now
          </span>
          <div className="text-2xl font-bold text-blue-600 font-mono tabular-nums mt-1">
            {stats?.summary.available_resources || 0}
          </div>
          <span className="text-[11px] text-slate-500">Ready for request</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Requests
          </span>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {stats?.summary.total_requests || 0}
          </div>
          <span className="text-[11px] text-slate-500">Peer interactions</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Exchanges Done
          </span>
          <div className="text-2xl font-bold text-emerald-600 font-mono tabular-nums mt-1">
            {stats?.summary.completed_exchanges || 0}
          </div>
          <span className="text-[11px] text-emerald-700">Reused on campus</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Student Value
          </span>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            ₹{stats?.summary.total_value_exchanged || 0}
          </div>
          <span className="text-[11px] text-slate-500">Saved on materials</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Analytics & Charts
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'listings'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Resource Moderation</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 font-mono">
            {resources.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Registered Students</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 font-mono">
            {users.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'logs'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Audit Logs</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 font-mono">
            {auditLogs.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Charts & Analytics */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Breakdown (Donut Chart) */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Resource Distribution by Category
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.category_breakdown}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={4}
                    >
                      {stats.category_breakdown.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600">
                {stats.category_breakdown.map((entry, index) => (
                  <div key={entry.category} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{entry.category} ({entry.count})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Status Breakdown (Bar Chart) */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Purchase Requests Lifecycle Status
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.status_breakdown}>
                    <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-slate-500 text-center">
                Reflects real requests recorded in SQLite database
              </p>
            </div>
          </div>

          {/* Monthly Campus Reuse Activity */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Campus Sharing Activity Over Time
                </h3>
                <p className="text-xs text-slate-500">
                  Monthly progression of resource listings vs successful handover exchanges
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Active Adoption
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.monthly_activity}>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="listings"
                    name="Listings"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.15}
                  />
                  <Area
                    type="monotone"
                    dataKey="exchanges"
                    name="Exchanges"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.15}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Resource Moderation */}
      {activeTab === 'listings' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Resource Moderation</h2>
              <p className="text-xs text-slate-500">
                Review and moderate educational items listed on campus.
              </p>
            </div>
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search listing or seller..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold">
                  <th className="py-3 px-3">Title & Subject</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Seller</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResources.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <span
                        onClick={() => onSelectResource(res.id)}
                        className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer block line-clamp-1"
                      >
                        {res.title}
                      </span>
                      <span className="text-[11px] text-slate-400 block">{res.subject}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{res.category}</td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-900 block">{res.seller_name}</span>
                      <span className="text-[10px] text-slate-500">{res.seller_email}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 font-mono tabular-nums">
                      ₹{res.price}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {res.availability}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDeleteResource(res.id, res.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        title="Remove listing (Inappropriate / Policy Violation)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Registered Students */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Registered Students Directory</h2>
              <p className="text-xs text-slate-500">
                Campus accounts participating in buying and selling educational materials.
              </p>
            </div>
            <div className="w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold">
                  <th className="py-3 px-3">Student Name</th>
                  <th className="py-3 px-3">Email & Roll ID</th>
                  <th className="py-3 px-3">Department & Year</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Listings</th>
                  <th className="py-3 px-3">Requests Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900 block">{u.full_name}</span>
                      {u.phone && <span className="text-[10px] text-slate-400">{u.phone}</span>}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-800 block">{u.email}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {u.college_id || 'Not Specified'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <span>{u.branch || 'General'}</span>
                      <span className="block text-[11px] text-slate-400">{u.year || 'Student'}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-800">
                      {u.listing_count}
                    </td>
                    <td className="py-3 px-3 font-mono font-medium text-slate-800">
                      {u.request_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Administrative Audit Trail</h2>
            <p className="text-xs text-slate-500">
              Immutable historical record of moderator actions and system security events.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-semibold">
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Administrator</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-3">Target</th>
                  <th className="py-3 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString([], {
                        dateStyle: 'short',
                        timeStyle: 'medium',
                      })}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900">
                      {log.admin_name || log.admin_email}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                      {log.target_type}:{log.target_id}
                    </td>
                    <td className="py-3 px-3 text-slate-700 max-w-md truncate">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
