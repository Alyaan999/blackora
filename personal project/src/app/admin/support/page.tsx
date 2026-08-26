'use client';

import React, { useState, useEffect } from 'react';
import { SupportMessage, SupportMessageStatus } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import {
  Headphones,
  Search,
  MessageSquare,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  Send,
  Trash2,
  Check,
  AlertTriangle,
  ExternalLink,
  MessageCircle,
  Sparkles,
  Filter,
  RefreshCw,
  User,
} from 'lucide-react';

export default function AdminSupportPage() {
  const { success, error: toastError } = useToast();

  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SupportMessageStatus>('all');

  // Selected Ticket for details & replying
  const [selectedTicket, setSelectedTicket] = useState<SupportMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyStatus, setReplyStatus] = useState<SupportMessageStatus>('replied');
  const [savingReply, setSavingReply] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/support');
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
        if (selectedTicket) {
          const updated = data.messages.find((m: SupportMessage) => m.id === selectedTicket.id);
          if (updated) setSelectedTicket(updated);
        }
      }
    } catch {
      toastError('Failed to load support inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSelectTicket = (ticket: SupportMessage) => {
    setSelectedTicket(ticket);
    setReplyText(ticket.adminReply || '');
    setReplyStatus(ticket.status === 'pending' ? 'replied' : ticket.status);
  };

  const handleSaveReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    if (!replyText.trim()) {
      toastError('Please type a response message before saving.');
      return;
    }

    setSavingReply(true);
    try {
      const res = await fetch(`/api/support/${selectedTicket.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminReply: replyText.trim(),
          status: replyStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update reply');
      }

      success('Reply successfully saved and published for customer!');
      setSelectedTicket(data.message);
      setMessages((prev) =>
        prev.map((m) => (m.id === data.message.id ? data.message : m))
      );
    } catch (err: any) {
      toastError(err.message || 'Error saving reply');
    } finally {
      setSavingReply(false);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!confirm('Are you sure you want to permanently delete this inquiry?')) return;

    try {
      const res = await fetch(`/api/support/${ticketId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete inquiry');
      }

      success('Inquiry deleted successfully.');
      setMessages((prev) => prev.filter((m) => m.id !== ticketId));
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(null);
      }
    } catch (err: any) {
      toastError(err.message || 'Error deleting ticket');
    }
  };

  // Quick Reply Template Inserts
  const applyTemplate = (text: string) => {
    setReplyText(text);
  };

  // Filtered List
  const filteredMessages = messages.filter((m) => {
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      (m.phone && m.phone.toLowerCase().includes(q)) ||
      m.message.toLowerCase().includes(q);

    return matchesStatus && matchesQuery;
  });

  const pendingCount = messages.filter((m) => m.status === 'pending').length;
  const repliedCount = messages.filter((m) => m.status === 'replied').length;
  const closedCount = messages.filter((m) => m.status === 'closed').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100">
              Help Desk & Customer Inquiries
            </h1>
            {pendingCount > 0 && (
              <span className="bg-rose-500/20 text-rose-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-500/40 animate-pulse">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Review customer queries, communicate solutions, and send official replies.
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="bg-[#171924] hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* Metrics Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter('all')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'all'
              ? 'bg-[#181b28] border-amber-500/50 shadow-lg'
              : 'bg-[#12141c] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Total Messages
          </div>
          <div className="text-2xl font-serif font-bold text-zinc-100 mt-1">
            {messages.length}
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('pending')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'pending'
              ? 'bg-[#181b28] border-amber-500/50 shadow-lg'
              : 'bg-[#12141c] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
            <span>Pending Action</span>
            {pendingCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
          </div>
          <div className="text-2xl font-serif font-bold text-amber-400 mt-1">
            {pendingCount}
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('replied')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'replied'
              ? 'bg-[#181b28] border-amber-500/50 shadow-lg'
              : 'bg-[#12141c] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Replied
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-400 mt-1">
            {repliedCount}
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('closed')}
          className={`p-5 rounded-2xl border cursor-pointer transition-all ${
            statusFilter === 'closed'
              ? 'bg-[#181b28] border-amber-500/50 shadow-lg'
              : 'bg-[#12141c] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Resolved / Closed
          </div>
          <div className="text-2xl font-serif font-bold text-zinc-300 mt-1">
            {closedCount}
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tickets List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, ticket ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#12141c] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 transition-all"
            />
          </div>

          {/* List Content */}
          {loading ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              <div className="animate-spin w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full mx-auto" />
              <p className="mt-2">Loading inquiries...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="bg-[#12141c] border border-zinc-800 rounded-2xl p-8 text-center text-xs text-zinc-500">
              No support inquiries found.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              {filteredMessages.map((ticket) => {
                const isSelected = selectedTicket?.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => handleSelectTicket(ticket)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-[#1a1d2c] border-amber-500 shadow-md'
                        : 'bg-[#12141c] border-zinc-800/80 hover:border-zinc-700 hover:bg-[#151722]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold text-amber-400/90">
                        {ticket.id}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                          ticket.status === 'replied'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-500/30'
                            : ticket.status === 'in_progress'
                            ? 'bg-sky-950 text-sky-300 border-sky-500/30'
                            : ticket.status === 'closed'
                            ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                            : 'bg-amber-950 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-zinc-100 line-clamp-1">
                        {ticket.subject}
                      </h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">
                        {ticket.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-800/60">
                      <span className="truncate max-w-[150px] font-medium text-zinc-400">
                        {ticket.name}
                      </span>
                      <span>{formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Selected Ticket Details & Reply Workspace */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="bg-[#12141c] border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl sticky top-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                      {selectedTicket.id}
                    </span>
                    <span className="text-xs text-zinc-400">• {formatDate(selectedTicket.createdAt)}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-zinc-100 mt-2">
                    {selectedTicket.subject}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteTicket(selectedTicket.id)}
                    className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                    title="Delete Ticket"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Customer Contact Details Bar */}
              <div className="bg-[#181a26] border border-zinc-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>{selectedTicket.name}</span>
                  </div>
                  <div className="text-zinc-400 text-[11px]">{selectedTicket.email}</div>
                  {selectedTicket.phone && (
                    <div className="text-zinc-500 text-[11px]">Phone: {selectedTicket.phone}</div>
                  )}
                </div>

                {/* Instant External Contact Shortcuts */}
                <div className="flex items-center gap-2">
                  {selectedTicket.phone && (
                    <a
                      href={`https://wa.me/${selectedTicket.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${selectedTicket.name}, this is Blackora Concierge regarding your inquiry (Ref: ${selectedTicket.id}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  <a
                    href={`mailto:${selectedTicket.email}?subject=${encodeURIComponent(
                      `[Blackora Support] ${selectedTicket.subject} (Ref: ${selectedTicket.id})`
                    )}&body=${encodeURIComponent(
                      `Dear ${selectedTicket.name},\n\nThank you for reaching out to Blackora Concierge.\n\n`
                    )}`}
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Client</span>
                  </a>
                </div>
              </div>

              {/* Customer Inquiry Text */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Customer Message</span>
                </div>
                <div className="bg-[#161824] p-4 rounded-2xl text-xs text-zinc-200 leading-relaxed border border-zinc-800 whitespace-pre-wrap">
                  {selectedTicket.message}
                </div>
              </div>

              {/* Admin Reply Form */}
              <form onSubmit={handleSaveReply} className="space-y-4 pt-2 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Admin Response & Resolution</span>
                  </div>

                  {/* Status Picker */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Set Status:</span>
                    <select
                      value={replyStatus}
                      onChange={(e) => setReplyStatus(e.target.value as SupportMessageStatus)}
                      className="bg-[#171924] border border-zinc-700 rounded-lg px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="replied">Replied</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Resolved / Closed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                {/* Quick Templates */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Templates:</span>
                  <button
                    type="button"
                    onClick={() =>
                      applyTemplate(
                        `Dear ${selectedTicket.name},\n\nThank you for contacting Blackora Concierge. Your order has been dispatched via express courier and is expected to arrive within 2-3 business days.\n\nWarm regards,\nBlackora Support Team`
                      )
                    }
                    className="text-[10px] bg-zinc-850 hover:bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md border border-zinc-700"
                  >
                    Order Dispatched
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      applyTemplate(
                        `Dear ${selectedTicket.name},\n\nWe have verified your digital payment proof. Your order is now confirmed and in transit for packaging.\n\nWarm regards,\nBlackora Support Team`
                      )
                    }
                    className="text-[10px] bg-zinc-850 hover:bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md border border-zinc-700"
                  >
                    Payment Verified
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      applyTemplate(
                        `Dear ${selectedTicket.name},\n\nYour request has been processed and resolved. Please let us know if you need any additional assistance.\n\nWarm regards,\nBlackora Support Team`
                      )
                    }
                    className="text-[10px] bg-zinc-850 hover:bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md border border-zinc-700"
                  >
                    Issue Resolved
                  </button>
                </div>

                {/* Textarea */}
                <textarea
                  rows={5}
                  required
                  placeholder="Type the official reply that the customer will see when tracking their ticket..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-[#171924] border border-zinc-700 rounded-xl p-4 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/80 transition-all leading-relaxed"
                />

                <div className="flex items-center justify-between gap-4 pt-1">
                  <div className="text-[11px] text-zinc-500">
                    {selectedTicket.repliedAt && (
                      <span>Last replied on {formatDate(selectedTicket.repliedAt)}</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={savingReply}
                    className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50"
                  >
                    {savingReply ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Save & Publish Reply</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-[#12141c] border border-zinc-800 rounded-3xl p-16 text-center space-y-3">
              <Headphones className="w-12 h-12 text-zinc-600 mx-auto" />
              <h3 className="text-sm font-bold text-zinc-200">No Inquiry Selected</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Select an inquiry from the left column to read the complete message and post an official response.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
