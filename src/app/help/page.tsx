'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { SupportMessage } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import {
  Headphones,
  Send,
  Search,
  MessageSquare,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';

export default function HelpCenterPage() {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<'contact' | 'track' | 'faq'>('contact');

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order Status & Tracking',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<SupportMessage | null>(null);
  const [ticketCopied, setTicketCopied] = useState(false);

  // Track Inquiry State
  const [lookupQuery, setLookupQuery] = useState('');
  const [trackedMessages, setTrackedMessages] = useState<SupportMessage[]>([]);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = 'Help Center & Concierge Support | Blackora Luxury Watches';
    }
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
      // Also prefill search query with user email
      if (!lookupQuery) {
        setLookupQuery(user.email);
      }
    }
  }, [user]);

  // Handle Contact Form Submission
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toastError('Please fill in all required fields (Name, Email, Message).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          userId: user?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      success('Your inquiry has been submitted to Blackora Concierge!');
      setSubmittedTicket(data.ticket);
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        subject: 'Order Status & Tracking',
        message: '',
      });
    } catch (err: any) {
      toastError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Lookup Inquiry
  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!lookupQuery.trim()) {
      toastError('Please enter your Ticket ID or Email address.');
      return;
    }

    setTrackingLoading(true);
    setHasSearched(true);
    try {
      const isTicketId = lookupQuery.trim().toLowerCase().startsWith('ticket-');
      const param = isTicketId ? `id=${encodeURIComponent(lookupQuery.trim())}` : `email=${encodeURIComponent(lookupQuery.trim())}`;
      const res = await fetch(`/api/support?${param}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to find inquiry');
      }

      if (data.message) {
        setTrackedMessages([data.message]);
      } else if (data.messages) {
        setTrackedMessages(data.messages);
      } else {
        setTrackedMessages([]);
      }
    } catch (err: any) {
      setTrackedMessages([]);
      toastError(err.message || 'No inquiry found matching this information.');
    } finally {
      setTrackingLoading(false);
    }
  };

  const copyTicketId = (id: string) => {
    navigator.clipboard.writeText(id);
    setTicketCopied(true);
    success('Ticket ID copied to clipboard!');
    setTimeout(() => setTicketCopied(false), 2500);
  };

  const faqs = [
    {
      q: 'How long does nationwide delivery take?',
      a: 'Orders across Pakistan are dispatched via premium express courier (TCS & Leopard) within 24 hours and typically reach Karachi, Lahore, and Islamabad within 2-3 business days. Other cities take 3-4 business days.',
    },
    {
      q: 'What payment options can I choose from?',
      a: 'We offer Cash on Delivery (COD) nationwide, as well as direct digital payments via EasyPaisa and JazzCash for expedited order priority dispatch.',
    },
    {
      q: 'How can I become an affiliate seller and earn commissions?',
      a: 'Any registered customer who purchases 1 watch automatically qualifies for our VIP Seller Network. You receive custom affiliate links and earn direct cash commissions (Rs. 200–500 per sale) withdrawable directly to your EasyPaisa or JazzCash.',
    },
    {
      q: 'Are Blackora luxury timepieces authentic and tested?',
      a: 'Yes. Every timepiece undergoes multi-point precision calibration and strict inspection before packaging in custom luxury presentation boxes.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20 shadow-sm">
            <Headphones className="w-3.5 h-3.5" />
            <span>Blackora Concierge Help Desk</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-100 tracking-tight">
            How May We Assist You?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Have a question about your order, timepiece authenticity, payment verification, or affiliate payouts? Contact our dedicated concierge team below.
          </p>
        </div>

        {/* Quick Concierge Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="https://wa.me/923071468568?text=Hello%20Blackora%20Concierge,%20I%20have%20an%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[#12141c] hover:bg-[#161924] border border-zinc-800 hover:border-amber-500/40 p-5 rounded-2xl transition-all duration-200 flex items-center gap-4 shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-200 group-hover:text-amber-400 transition-colors">
                Instant WhatsApp Chat
              </div>
              <p className="text-[11px] text-zinc-500">+92 307 1468568</p>
            </div>
          </a>

          <a
            href="mailto:support@blackora.com"
            className="group bg-[#12141c] hover:bg-[#161924] border border-zinc-800 hover:border-amber-500/40 p-5 rounded-2xl transition-all duration-200 flex items-center gap-4 shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-200 group-hover:text-amber-400 transition-colors">
                Email Support Desk
              </div>
              <p className="text-[11px] text-zinc-500">support@blackora.com</p>
            </div>
          </a>

          <div className="bg-[#12141c] border border-zinc-800 p-5 rounded-2xl flex items-center gap-4 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-200">Response Guarantee</div>
              <p className="text-[11px] text-zinc-500">Average response within 1-3 hrs</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-center border-b border-zinc-800 gap-2 sm:gap-6">
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-4 px-3 sm:px-6 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all relative ${
              activeTab === 'contact'
                ? 'text-amber-400'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              <span>Contact Admin / Inquiry Form</span>
            </span>
            {activeTab === 'contact' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-amber-300" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('track');
              if (user?.email && !hasSearched) {
                handleLookup();
              }
            }}
            className={`pb-4 px-3 sm:px-6 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all relative ${
              activeTab === 'track'
                ? 'text-amber-400'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Check Ticket / Admin Replies</span>
            </span>
            {activeTab === 'track' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-amber-300" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`pb-4 px-3 sm:px-6 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all relative ${
              activeTab === 'faq'
                ? 'text-amber-400'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span>Frequently Asked</span>
            </span>
            {activeTab === 'faq' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-amber-300" />
            )}
          </button>
        </div>

        {/* TAB 1: Contact Form */}
        {activeTab === 'contact' && (
          <div className="max-w-2xl mx-auto bg-[#10121a] border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
            {submittedTicket ? (
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-2xl font-bold text-zinc-100">
                    Inquiry Submitted Successfully!
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Your message has been assigned to our administrative desk. You will receive an update here and via email shortly.
                  </p>
                </div>

                {/* Ticket ID Box */}
                <div className="bg-[#171924] border border-zinc-700/80 rounded-2xl p-4 max-w-md mx-auto text-left space-y-2">
                  <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Your Inquiry Reference ID
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-base font-bold text-amber-400">
                      {submittedTicket.id}
                    </span>
                    <button
                      onClick={() => copyTicketId(submittedTicket.id)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      {ticketCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy ID</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setLookupQuery(submittedTicket.id);
                      setActiveTab('track');
                      setTrackedMessages([submittedTicket]);
                      setHasSearched(true);
                      setSubmittedTicket(null);
                    }}
                    className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/20"
                  >
                    Track This Ticket Now →
                  </button>

                  <button
                    onClick={() => setSubmittedTicket(null)}
                    className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-6 py-2.5 rounded-xl text-xs font-medium transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-zinc-100">
                    Send a Message to Admin
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Fill out the details below. Our support administrator will review and respond.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-300">
                      Your Full Name <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ali Ahmed"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#171924] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-300">
                      Email Address <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ali@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#171924] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone / WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-300">
                      WhatsApp / Mobile Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 0300 1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#171924] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                    />
                  </div>

                  {/* Subject Category */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-zinc-300">
                      Inquiry Topic <span className="text-amber-400">*</span>
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#171924] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-100 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
                    >
                      <option value="Order Status & Tracking">Order Status & Tracking</option>
                      <option value="Payment Verification (EasyPaisa / JazzCash)">Payment Verification (EasyPaisa / JazzCash)</option>
                      <option value="Product Details & Watch Authenticity">Product Details & Watch Authenticity</option>
                      <option value="Affiliate Seller Commission & Withdrawal">Affiliate Seller Commission & Withdrawal</option>
                      <option value="Exchange or Special Request">Exchange or Special Request</option>
                      <option value="Other General Inquiry">Other General Inquiry</option>
                    </select>
                  </div>
                </div>

                {/* Message Content */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Your Message / Question <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide as much detail as possible (e.g. Order #, transaction ID, or specific question) so our team can resolve it immediately..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#171924] border border-zinc-800 rounded-xl p-4 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry to Admin</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: Track Inquiry & Admin Replies */}
        {activeTab === 'track' && (
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Search Input Card */}
            <div className="bg-[#10121a] border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <form onSubmit={handleLookup} className="space-y-4">
                <div className="space-y-1">
                  <h2 className="font-serif text-lg font-bold text-zinc-100">
                    Look Up Inquiry Status & Admin Responses
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Enter your Email address or specific Ticket ID (e.g. <span className="font-mono text-amber-400">ticket-123...</span>) to view message updates.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Enter your email or ticket ID..."
                      value={lookupQuery}
                      onChange={(e) => setLookupQuery(e.target.value)}
                      className="w-full bg-[#171924] border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={trackingLoading}
                    className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-xl text-xs font-bold transition-colors shrink-0 shadow-md shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    {trackingLoading ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Search className="w-3.5 h-3.5" />
                        <span>Search Tickets</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Results Display */}
            {trackingLoading && (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto" />
                <p className="text-xs text-zinc-400 mt-3">Fetching inquiry history...</p>
              </div>
            )}

            {!trackingLoading && hasSearched && trackedMessages.length === 0 && (
              <div className="bg-[#12141c] border border-zinc-800 rounded-3xl p-10 text-center space-y-3">
                <HelpCircle className="w-10 h-10 text-zinc-600 mx-auto" />
                <h3 className="text-sm font-bold text-zinc-200">No Inquiries Found</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  We could not find any active tickets for <span className="font-mono text-amber-400">"{lookupQuery}"</span>. Please double-check the ticket ID or submit a new inquiry.
                </p>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="mt-2 text-xs text-amber-400 hover:underline font-semibold"
                >
                  Submit a new inquiry →
                </button>
              </div>
            )}

            {!trackingLoading && trackedMessages.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2 text-xs text-zinc-400">
                  <span>Found {trackedMessages.length} inquiry ticket(s)</span>
                  <button
                    onClick={() => handleLookup()}
                    className="flex items-center gap-1.5 text-amber-400 hover:underline"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Refresh</span>
                  </button>
                </div>

                {trackedMessages.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-[#12141c] border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl transition-all"
                  >
                    {/* Header Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                            {ticket.id}
                          </span>
                          <span className="text-xs text-zinc-400">• {formatDate(ticket.createdAt)}</span>
                        </div>
                        <h3 className="font-serif text-base font-bold text-zinc-100 mt-2">
                          {ticket.subject}
                        </h3>
                      </div>

                      <div>
                        <span
                          className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full border inline-block ${
                            ticket.status === 'replied'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                              : ticket.status === 'in_progress'
                              ? 'bg-sky-950/80 text-sky-300 border-sky-500/30'
                              : ticket.status === 'closed'
                              ? 'bg-zinc-800 text-zinc-400 border-zinc-700'
                              : 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          {ticket.status === 'replied'
                            ? 'Admin Replied'
                            : ticket.status === 'in_progress'
                            ? 'In Review'
                            : ticket.status === 'closed'
                            ? 'Resolved'
                            : 'Pending Response'}
                        </span>
                      </div>
                    </div>

                    {/* Customer Message */}
                    <div className="space-y-2">
                      <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Your Query:</span>
                      </div>
                      <div className="bg-[#181a26] p-4 rounded-2xl text-xs text-zinc-200 leading-relaxed border border-zinc-800/80 whitespace-pre-wrap">
                        {ticket.message}
                      </div>
                    </div>

                    {/* Admin Response Box */}
                    {ticket.adminReply ? (
                      <div className="space-y-2 pt-2">
                        <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-amber-400" />
                            <span>Official Admin Response</span>
                          </span>
                          {ticket.repliedAt && (
                            <span className="text-[10px] text-zinc-500 font-normal">
                              {formatDate(ticket.repliedAt)}
                            </span>
                          )}
                        </div>
                        <div className="bg-gradient-to-br from-amber-500/10 via-[#161720] to-[#12141c] p-4 sm:p-5 rounded-2xl text-xs text-zinc-100 leading-relaxed border border-amber-500/30 shadow-inner whitespace-pre-wrap">
                          {ticket.adminReply}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#171822]/60 p-4 rounded-2xl border border-zinc-800/60 flex items-center gap-3 text-xs text-zinc-400">
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          Our concierge administration team has received this ticket and will respond soon.
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FAQs */}
        {activeTab === 'faq' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="text-center mb-6">
              <h2 className="font-serif text-xl font-bold text-zinc-100">
                Frequently Answered Queries
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Quick solutions to common inquiries regarding orders, shipping, and payments.
              </p>
            </div>

            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#12141c] border border-zinc-800 rounded-2xl overflow-hidden shadow-lg transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-zinc-200 hover:text-amber-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
