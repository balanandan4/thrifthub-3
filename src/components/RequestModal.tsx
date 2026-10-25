import React, { useState } from 'react';
import { Resource } from '../types';
import { api } from '../api';
import { X, Send, Loader2 } from 'lucide-react';

interface Props {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RequestModal: React.FC<Props> = ({ resource, isOpen, onClose, onSuccess }) => {
  const [message, setMessage] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !resource) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setSubmitting(true);
      await api.sendRequest(
        resource.id,
        message || `Hi! I am interested in purchasing your "${resource.title}". Can we coordinate meeting on campus?`,
        contactInfo || undefined
      );

      setMessage('');
      setContactInfo('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900">Request Educational Resource</h2>
            <p className="text-xs text-slate-500">
              Notify the student seller that you want to obtain this item.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Item Preview */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">
                {resource.category} · {resource.condition}
              </span>
              <h4 className="text-sm font-semibold text-slate-900 line-clamp-1">
                {resource.title}
              </h4>
              <span className="text-xs text-slate-600 block mt-0.5">
                Seller: {resource.seller_name || 'Student'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
                ₹{resource.price}
              </span>
            </div>
          </div>

          {/* Message to Seller */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Message to Seller
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Hi! I need this for Semester 3 math. Can we meet near the library after 3 PM tomorrow?"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
            />
          </div>

          {/* Contact Information */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Your Preferred Campus Contact (Phone / WhatsApp)
            </label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="e.g. +1 555-019-2831 or your student email"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="p-3 text-[11px] text-slate-500 bg-blue-50/50 rounded-lg border border-blue-100 leading-relaxed">
            <strong>Campus Exchange Flow:</strong> When the seller accepts your request, you'll receive a notification and can coordinate an in-person exchange on campus. No online advance payment required.
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-xs flex items-center gap-2"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Send Purchase Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
