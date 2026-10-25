import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { PurchaseRequest, RequestHistoryItem, User } from '../types';
import { X, CheckCircle, Clock, XCircle, CheckCircle2, User as UserIcon, Loader2 } from 'lucide-react';

interface Props {
  requestId: string | null;
  currentUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChanged: () => void;
}

export const RequestTimelineModal: React.FC<Props> = ({
  requestId,
  currentUser,
  isOpen,
  onClose,
  onStatusChanged,
}) => {
  const [request, setRequest] = useState<PurchaseRequest | null>(null);
  const [history, setHistory] = useState<RequestHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sellerNote, setSellerNote] = useState('');

  useEffect(() => {
    if (isOpen && requestId) {
      loadData();
    }
  }, [isOpen, requestId]);

  const loadData = async () => {
    if (!requestId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.getRequestDetails(requestId);
      setRequest(res.request);
      setHistory(res.history);
    } catch (err: any) {
      setError(err.message || 'Failed to load request timeline.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isSeller = currentUser?.id === request?.seller_id;
  const isBuyer = currentUser?.id === request?.buyer_id;

  const handleRespond = async (decision: 'Accepted' | 'Rejected') => {
    if (!requestId) return;
    try {
      setActionLoading(true);
      setError(null);
      await api.respondToRequest(requestId, decision, sellerNote);
      setSellerNote('');
      await loadData();
      onStatusChanged();
    } catch (err: any) {
      setError(err.message || 'Failed to update request.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!requestId) return;
    try {
      setActionLoading(true);
      setError(null);
      await api.completeRequest(requestId, 'In-person exchange completed and item marked as Sold.');
      await loadData();
      onStatusChanged();
    } catch (err: any) {
      setError(err.message || 'Failed to complete exchange.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Pending Seller Response
          </span>
        );
      case 'Accepted':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Accepted — Coordinate Handover
          </span>
        );
      case 'Rejected':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            Request Declined
          </span>
        );
      case 'Completed':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
            Exchange Completed (Sold)
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Purchase Request Timeline</h2>
            <p className="text-xs text-slate-500">Ref: {requestId}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
              <p className="text-xs">Loading request history...</p>
            </div>
          ) : request ? (
            <>
              {error && (
                <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                  {error}
                </div>
              )}

              {/* Status Header */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{request.resource_title}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Price: <span className="font-semibold text-slate-900 font-mono">₹{request.resource_price}</span>
                  </div>
                </div>
                <div>{getStatusBadge(request.status)}</div>
              </div>

              {/* Participants */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Buyer
                  </span>
                  <div className="flex items-center gap-1.5 font-medium text-slate-900">
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{request.buyer_name}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5 truncate">{request.buyer_email}</p>
                  {request.buyer_phone && (
                    <p className="text-slate-500 text-[11px]">{request.buyer_phone}</p>
                  )}
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Seller
                  </span>
                  <div className="flex items-center gap-1.5 font-medium text-slate-900">
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{request.seller_name}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5 truncate">{request.seller_email}</p>
                  {request.seller_phone && (
                    <p className="text-slate-500 text-[11px]">{request.seller_phone}</p>
                  )}
                </div>
              </div>

              {/* Buyer's initial message */}
              {request.message && (
                <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-lg text-xs text-slate-700">
                  <span className="font-semibold text-slate-900 block mb-1">
                    Message from Buyer:
                  </span>
                  <p className="italic">"{request.message}"</p>
                  {request.contact_info && (
                    <p className="text-[11px] text-slate-500 mt-1 font-mono">
                      Contact: {request.contact_info}
                    </p>
                  )}
                </div>
              )}

              {/* Timeline Trail */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Progress History
                </h4>
                <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {history.map((h) => (
                    <div key={h.id} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center" />
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-slate-900">{h.new_status}</span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(h.created_at).toLocaleString([], {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>
                        {h.note && (
                          <p className="text-xs text-slate-600 mt-0.5 bg-slate-50 p-2 rounded border border-slate-100">
                            {h.note}
                          </p>
                        )}
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          Recorded by: {h.actor_name || 'System'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller Response Action Panel (Only if Pending and User is Seller) */}
              {isSeller && request.status === 'Pending' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900">
                    Respond to Buyer's Request
                  </h4>
                  <input
                    type="text"
                    value={sellerNote}
                    onChange={(e) => setSellerNote(e.target.value)}
                    placeholder="Optional message to buyer (e.g. Let's meet at Student Center at 4 PM)"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRespond('Accepted')}
                      disabled={actionLoading}
                      className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      {actionLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                      <span>Accept Request</span>
                    </button>
                    <button
                      onClick={() => handleRespond('Rejected')}
                      disabled={actionLoading}
                      className="px-4 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              )}

              {/* Complete Exchange Action (If Accepted and User is Seller or Buyer) */}
              {request.status === 'Accepted' && (isSeller || isBuyer) && (
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-emerald-900">
                    <span className="font-semibold block">Did you complete the handover on campus?</span>
                    <span className="text-[11px] text-emerald-700">
                      Marking as completed will update the item to Sold.
                    </span>
                  </div>
                  <button
                    onClick={handleComplete}
                    disabled={actionLoading}
                    className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap shadow-xs flex items-center justify-center gap-1.5"
                  >
                    {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Mark Exchange Completed</span>
                  </button>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
