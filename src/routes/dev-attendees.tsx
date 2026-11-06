import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  Users,
  Sparkles,
  Ticket,
  Lock,
  Unlock,
  KeyRound,
  Download,
  Upload,
  UserCheck,
  UserX,
  FileSpreadsheet,
  Trash2,
  RotateCcw,
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { INITIAL_GUEST_LIST, type GuestRecord } from "@/data/guest-list";

export const Route = createFileRoute("/dev-attendees")({
  head: () => ({
    meta: [
      { title: "Attendee & VIP Verification Checker — TEDxLafia" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DevAttendeesRoute,
});

const DEFAULT_PIN = "TEDX-VIP-2026";
const STORAGE_KEY_AUTH = "tedxlafia_dev_auth_v1";
const STORAGE_KEY_PIN = "tedxlafia_dev_pin_v1";
const STORAGE_KEY_GUESTS = "tedxlafia_guest_list_v2";

function DevAttendeesRoute() {
  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [showPin, setShowPin] = useState<boolean>(false);

  // Guest List Data
  const [guests, setGuests] = useState<GuestRecord[]>([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<"all" | "vip" | "regular" | "checked-in" | "pending">("all");

  // Modal / Import States
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importType, setImportType] = useState<"Regular" | "VIP">("Regular");
  const [importTier, setImportTier] = useState<string>("General Delegate");
  const [importText, setImportText] = useState<string>("");

  // Single Add Guest State
  const [showAddSingleModal, setShowAddSingleModal] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newType, setNewType] = useState<"Regular" | "VIP">("Regular");
  const [newTier, setNewTier] = useState<string>("General Delegate");
  const [newNotes, setNewNotes] = useState<string>("");

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const auth = sessionStorage.getItem(STORAGE_KEY_AUTH);
      if (auth === "true") {
        setIsAuthenticated(true);
      }
      const savedGuests = localStorage.getItem(STORAGE_KEY_GUESTS);
      if (savedGuests) {
        // Merge: keep saved data but add any new entries from INITIAL_GUEST_LIST
        const parsed: GuestRecord[] = JSON.parse(savedGuests);
        const savedIds = new Set(parsed.map((g) => g.id));
        const newEntries = INITIAL_GUEST_LIST.filter((g) => !savedIds.has(g.id));
        const merged = [...parsed, ...newEntries];
        // Persist the merged result so future loads are consistent
        localStorage.setItem(STORAGE_KEY_GUESTS, JSON.stringify(merged));
        setGuests(merged);
      } else {
        setGuests(INITIAL_GUEST_LIST);
      }
    } catch (e) {
      console.error("Storage load error", e);
      setGuests(INITIAL_GUEST_LIST);
    }
  }, []);

  // Save guests to localStorage
  const saveGuests = (updated: GuestRecord[]) => {
    setGuests(updated);
    try {
      localStorage.setItem(STORAGE_KEY_GUESTS, JSON.stringify(updated));
    } catch (e) {
      console.error("Storage save error", e);
    }
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem(STORAGE_KEY_PIN) || DEFAULT_PIN;
    if (pinInput.trim() === storedPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY_AUTH, "true");
      toast.success("Developer access granted to Attendee Verification.");
    } else {
      toast.error("Invalid developer PIN.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
    toast.info("Portal locked.");
  };

  // Toggle Guest Check-in status
  const toggleCheckIn = (id: string) => {
    const updated = guests.map((g) => {
      if (g.id === id) {
        const nextState = !g.checkedIn;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return {
          ...g,
          checkedIn: nextState,
          checkedInAt: nextState ? timeStr : undefined,
        };
      }
      return g;
    });
    saveGuests(updated);

    const guest = guests.find((g) => g.id === id);
    if (guest) {
      if (!guest.checkedIn) {
        toast.success(`Checked in ${guest.name}!`);
      } else {
        toast.info(`Undid check-in for ${guest.name}.`);
      }
    }
  };

  // Delete Guest
  const deleteGuest = (id: string, name: string) => {
    const remaining = guests.filter((g) => g.id !== id);
    saveGuests(remaining);
    toast.info(`Removed ${name} from guest list.`);
  };

  // Handle Bulk Import
  const handleBulkImport = () => {
    if (!importText.trim()) {
      toast.error("Please paste attendee names and emails.");
      return;
    }

    const lines = importText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const parsed: GuestRecord[] = [];
    for (const line of lines) {
      // Formats supported: "Name, email", "email, Name", or just "email"
      const parts = line.split(/[,;\t]+/).map((p) => p.trim());
      let parsedEmail = "";
      let parsedName = "";

      for (const part of parts) {
        if (part.includes("@")) {
          parsedEmail = part.toLowerCase();
        } else if (part.length > 0 && !parsedName) {
          parsedName = part;
        }
      }

      if (parsedEmail) {
        if (!parsedName) {
          const userPart = parsedEmail.split("@")[0] ?? "Guest";
          parsedName = userPart
            .replace(/[._+-]+/g, " ")
            .split(" ")
            .filter(Boolean)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");
        }

        // Avoid exact duplicates
        const exists = guests.some((g) => g.email.toLowerCase() === parsedEmail.toLowerCase());
        if (!exists) {
          parsed.push({
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name: parsedName,
            email: parsedEmail,
            type: importType,
            tier: importType === "VIP" ? importTier : "General Delegate",
            checkedIn: false,
          });
        }
      }
    }

    if (parsed.length === 0) {
      toast.error("No valid emails found to import.");
      return;
    }

    saveGuests([...guests, ...parsed]);
    toast.success(`Successfully added ${parsed.length} new ${importType} attendees!`);
    setImportText("");
    setShowImportModal(false);
  };

  // Handle Single Guest Add
  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!newName.trim()) {
      toast.error("Please enter the attendee's name.");
      return;
    }

    const emailClean = newEmail.trim().toLowerCase();
    const exists = guests.some((g) => g.email.toLowerCase() === emailClean);
    if (exists) {
      toast.error("An attendee with this email is already on the list.");
      return;
    }

    const newGuest: GuestRecord = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: newName.trim(),
      email: emailClean,
      type: newType,
      tier: newType === "VIP" ? newTier : "General Delegate",
      notes: newNotes.trim() || undefined,
      checkedIn: false,
    };

    saveGuests([newGuest, ...guests]);
    toast.success(`Added ${newGuest.name} to the ${newGuest.type} list!`);
    setNewName("");
    setNewEmail("");
    setNewNotes("");
    setShowAddSingleModal(false);
  };

  // Export to CSV
  const handleExportCsv = () => {
    if (guests.length === 0) {
      toast.error("No guests to export.");
      return;
    }
    const headers = ["Name", "Email", "Type", "Tier", "Check-in Status", "Checked In Time", "Notes"];
    const rows = guests.map((g) => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.email.replace(/"/g, '""')}"`,
      `"${g.type}"`,
      `"${(g.tier ?? "").replace(/"/g, '""')}"`,
      `"${g.checkedIn ? "CHECKED IN" : "PENDING"}"`,
      `"${g.checkedInAt ?? ""}"`,
      `"${(g.notes ?? "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TEDxLafia-Attendance-Report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Guest attendance report exported to CSV!");
  };

  // Reset all check-ins
  const handleResetCheckIns = () => {
    if (window.confirm("Are you sure you want to reset all check-in statuses back to Pending?")) {
      const resetList = guests.map((g) => ({ ...g, checkedIn: false, checkedInAt: undefined }));
      saveGuests(resetList);
      toast.info("All guest check-ins have been reset.");
    }
  };

  // Statistics
  const totalCount = guests.length;
  const vipCount = guests.filter((g) => g.type === "VIP").length;
  const regularCount = guests.filter((g) => g.type === "Regular").length;
  const checkedInCount = guests.filter((g) => g.checkedIn).length;
  const checkInPercent = totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0;

  // Active Instant Search Verification Matches
  const queryClean = searchQuery.trim().toLowerCase();
  const searchMatches = useMemo(() => {
    if (!queryClean) return [];
    return guests.filter(
      (g) =>
        g.name.toLowerCase().includes(queryClean) ||
        g.email.toLowerCase().includes(queryClean)
    );
  }, [guests, queryClean]);

  // Filtered list for the main table
  const tableGuests = useMemo(() => {
    return guests.filter((g) => {
      // Apply tab filter
      if (activeFilter === "vip" && g.type !== "VIP") return false;
      if (activeFilter === "regular" && g.type !== "Regular") return false;
      if (activeFilter === "checked-in" && !g.checkedIn) return false;
      if (activeFilter === "pending" && g.checkedIn) return false;

      // Apply search query if present
      if (queryClean) {
        return (
          g.name.toLowerCase().includes(queryClean) ||
          g.email.toLowerCase().includes(queryClean)
        );
      }
      return true;
    });
  }, [guests, activeFilter, queryClean]);

  // If locked, render developer passcode screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07080c] text-white flex items-center justify-center p-4 relative overflow-hidden select-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#E62E2D]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0e1017]/90 backdrop-blur-xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#E62E2D]/20 via-amber-500/20 to-[#E62E2D]/10 border border-amber-500/30 text-amber-300 shadow-lg">
              <KeyRound className="w-8 h-8 text-amber-400" />
            </div>

            <div>
              <div className="flex items-center justify-center gap-1.5 font-display text-2xl font-black">
                <span className="text-[#E62E2D]">TEDx</span>
                <span className="text-white">Lafia</span>
              </div>
              <h1 className="text-lg font-bold text-white mt-1">Attendee & VIP Verification</h1>
              <p className="text-xs text-white/60 mt-1 max-w-xs mx-auto">
                Restricted portal for check-in staff and organizers to verify attendees.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/80 flex items-center justify-between">
                <span>Enter Developer Master PIN</span>
                <span className="text-[10px] text-amber-400 font-normal">Restricted Access</span>
              </label>

              <div className="relative">
                <input
                  type={showPin ? "text" : "password"}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Master PIN"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white font-mono placeholder:text-white/30 focus:outline-none focus:border-amber-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 bg-[#E62E2D] hover:bg-[#d02827] text-white font-semibold rounded-xl cursor-pointer shadow-lg"
            >
              <Unlock className="w-4 h-4 mr-2" /> Unlock Guest Portal
            </Button>
          </form>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-center space-y-1">
            <span className="text-[11px] text-white/40 block">Default Master Key</span>
            <code className="text-xs font-mono font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
              {DEFAULT_PIN}
            </code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080c] text-white pt-24 pb-20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Developer Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-white/10 bg-[#0f1118]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E62E2D] to-amber-500 flex items-center justify-center text-white font-bold shadow-md">
              <Users className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold text-white">Attendee & VIP Directory</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/40 text-[10px] font-bold text-emerald-300">
                  DEVELOPER / ORGANIZER
                </span>
              </div>
              <p className="text-xs text-white/60">
                Search, confirm, and verify registrations for TEDxLafia 2026.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs"
            >
              <Link to="/dev-vip-tickets">
                <Ticket className="w-3.5 h-3.5 mr-1" /> VIP Ticket Generator <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-white/15 text-white/70 hover:text-white hover:bg-white/10 text-xs"
            >
              <Lock className="w-3.5 h-3.5 mr-1" /> Lock
            </Button>
          </div>
        </div>

        {/* PROMINENT LIVE VERIFICATION SEARCH BOX */}
        <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-b from-[#12141e] to-[#0c0d14] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <Search className="w-4 h-4" /> Real-time Guest Verification Search
            </div>
            <h2 className="font-display text-2xl font-bold text-white">
              Search Email or Full Name
            </h2>
            <p className="text-xs text-white/60">
              Instantly check if someone is an authorized Regular Attendee or VIP Delegate.
            </p>
          </div>

          <div className="relative">
            <Search className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/80" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type attendee email address or name (e.g. musa.ibrahim@gmail.com)..."
              autoFocus
              className="w-full pl-14 pr-10 py-4 rounded-2xl bg-black/60 border-2 border-white/15 text-white placeholder:text-white/30 text-base font-medium focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs px-2 py-1 bg-white/10 rounded-md"
              >
                Clear
              </button>
            )}
          </div>

          {/* VERIFICATION CARD RESULT */}
          {queryClean.length >= 2 && (
            <div className="animate-in fade-in duration-200">
              {searchMatches.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Confirmed Match Found ({searchMatches.length} {searchMatches.length === 1 ? "Person" : "People"})
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {searchMatches.map((guest) => {
                      const isVip = guest.type === "VIP";
                      return (
                        <div
                          key={guest.id}
                          className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all ${
                            isVip
                              ? "border-amber-400/60 bg-gradient-to-br from-amber-500/10 via-black/40 to-[#0e0f15]"
                              : "border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-black/40 to-[#0e0f15]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                                    isVip
                                      ? "bg-amber-400/20 border-amber-400 text-amber-300"
                                      : "bg-[#E62E2D]/20 border-[#E62E2D] text-red-200"
                                  }`}
                                >
                                  ★ {guest.type === "VIP" ? (guest.tier || "VIP DELEGATE") : "REGULAR ATTENDEE"}
                                </span>

                                {guest.checkedIn ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Checked In {guest.checkedInAt ? `(${guest.checkedInAt})` : ""}
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 text-[10px] font-medium">
                                    Pending Check-in
                                  </span>
                                )}
                              </div>

                              <h3 className="font-display text-xl font-extrabold text-white pt-1">
                                {guest.name}
                              </h3>
                              <p className="font-mono text-xs text-white/70">{guest.email}</p>
                              {guest.notes && (
                                <p className="text-[11px] text-amber-200/80 italic pt-1">
                                  Note: {guest.notes}
                                </p>
                              )}
                            </div>

                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                guest.checkedIn
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400"
                                  : "bg-white/10 text-white/40 border border-white/20"
                              }`}
                            >
                              {guest.checkedIn ? (
                                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                              ) : (
                                <UserCheck className="w-5 h-5 text-white/60" />
                              )}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                            <Button
                              size="sm"
                              onClick={() => toggleCheckIn(guest.id)}
                              className={`text-xs font-bold cursor-pointer ${
                                guest.checkedIn
                                  ? "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                                  : isVip
                                  ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold"
                                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
                              }`}
                            >
                              {guest.checkedIn ? "Undo Check-In" : "✓ Confirm & Check-In"}
                            </Button>

                            {isVip && (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs"
                              >
                                <Link to="/dev-vip-tickets">
                                  <Ticket className="w-3.5 h-3.5 mr-1" /> Generate Ticket
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-rose-500/50 bg-rose-500/10 p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
                    <XCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-rose-300">
                      NOT ON THE GUEST LIST
                    </h3>
                    <p className="text-xs text-white/70 max-w-md mx-auto mt-1">
                      No attendee or VIP matched <code className="text-white bg-black/40 px-2 py-0.5 rounded font-mono">"{searchQuery}"</code>.
                      This user is not registered for TEDxLafia 2026.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setNewEmail(searchQuery.includes("@") ? searchQuery : "");
                        setNewName(!searchQuery.includes("@") ? searchQuery : "");
                        setShowAddSingleModal(true);
                      }}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs"
                    >
                      <UserPlus className="w-3.5 h-3.5 mr-1.5" /> Add as Walk-in Guest
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* METRICS & QUICK STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-[#0f1118]/80 p-4 backdrop-blur-sm">
            <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold block">
              Total Guest List
            </span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
              {totalCount}
            </div>
            <div className="text-[11px] text-white/50 mt-0.5">All registered attendees</div>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 backdrop-blur-sm">
            <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold block">
              VIP Members
            </span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-amber-300 mt-1">
              {vipCount}
            </div>
            <div className="text-[11px] text-amber-200/60 mt-0.5">Special & VVIP Delegates</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0f1118]/80 p-4 backdrop-blur-sm">
            <span className="text-[10px] text-red-400 uppercase tracking-widest font-bold block">
              Regular Attendees
            </span>
            <div className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
              {regularCount}
            </div>
            <div className="text-[11px] text-white/50 mt-0.5">General seat passes</div>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold block">
                Checked In
              </span>
              <span className="text-xs font-mono font-bold text-emerald-300">{checkInPercent}%</span>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-300 mt-1">
              {checkedInCount} / {totalCount}
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${checkInPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* FULL GUEST LIST DIRECTORY */}
        <div className="rounded-3xl border border-white/10 bg-[#0f1118]/90 p-6 sm:p-8 space-y-6 backdrop-blur-md">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeFilter === "all" ? "bg-[#E62E2D] text-white" : "text-white/60 hover:text-white"
                }`}
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("vip")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeFilter === "vip" ? "bg-amber-500 text-black font-bold" : "text-amber-300/70 hover:text-amber-300"
                }`}
              >
                VIPs ({vipCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("regular")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeFilter === "regular" ? "bg-[#E62E2D] text-white" : "text-white/60 hover:text-white"
                }`}
              >
                Regular ({regularCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("checked-in")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeFilter === "checked-in" ? "bg-emerald-600 text-white" : "text-emerald-300/70 hover:text-emerald-300"
                }`}
              >
                Checked In ({checkedInCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter("pending")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeFilter === "pending" ? "bg-white/20 text-white" : "text-white/60 hover:text-white"
                }`}
              >
                Pending ({totalCount - checkedInCount})
              </button>
            </div>

            {/* Actions: Add / Import / Export */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddSingleModal(true)}
                className="border-white/15 text-white hover:bg-white/10 text-xs"
              >
                <UserPlus className="w-3.5 h-3.5 mr-1 text-amber-400" /> Add Attendee
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowImportModal(true)}
                className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs"
              >
                <Upload className="w-3.5 h-3.5 mr-1" /> Import / Paste List
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleExportCsv}
                disabled={guests.length === 0}
                className="border-white/15 text-white hover:bg-white/10 text-xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Export CSV
              </Button>
            </div>
          </div>

          {/* Directory Table */}
          {tableGuests.length === 0 ? (
            <div className="text-center py-16 space-y-3 border border-dashed border-white/10 rounded-2xl">
              <Users className="w-10 h-10 text-white/20 mx-auto" />
              <p className="text-sm text-white/60">No attendees match your search or filter.</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                }}
                className="text-xs"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-white/[0.04] text-white/50 border-b border-white/10 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Attendee Name</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Check-in Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-sans">
                  {tableGuests.map((g) => {
                    const isVip = g.type === "VIP";
                    return (
                      <tr key={g.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-sm">{g.name}</div>
                          {g.notes && (
                            <div className="text-amber-300/70 text-[10px] italic">{g.notes}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-white/70">
                          {g.email}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
                              isVip
                                ? "bg-amber-400/15 border-amber-400/40 text-amber-300"
                                : "bg-white/5 border-white/15 text-white/70"
                            }`}
                          >
                            {isVip ? `★ ${g.tier || "VIP"}` : "Regular Attendee"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {g.checkedIn ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-[10px]">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Checked In {g.checkedInAt ? `(${g.checkedInAt})` : ""}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px]">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleCheckIn(g.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                                g.checkedIn
                                  ? "bg-white/10 hover:bg-white/20 text-white/70 hover:text-white"
                                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
                              }`}
                            >
                              {g.checkedIn ? "Undo" : "Check In"}
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteGuest(g.id, g.name)}
                              className="p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                              title="Delete from list"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Reset check-ins button */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 text-xs text-white/50">
            <span>Showing {tableGuests.length} of {totalCount} registered guests</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetCheckIns}
                className="text-amber-400/80 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset Check-ins
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear the entire guest list?")) {
                    saveGuests([]);
                    toast.info("Guest list cleared.");
                  }
                }}
                className="text-red-400/80 hover:text-red-400 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Clear List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: BULK IMPORT GUESTS */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-2xl border border-amber-500/40 bg-[#0e1017] text-white shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-400" />
                Batch Import Guest List
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-white/80">Attendee Type</label>
                  <select
                    value={importType}
                    onChange={(e) => setImportType(e.target.value as "Regular" | "VIP")}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white"
                  >
                    <option value="Regular">Regular Attendees</option>
                    <option value="VIP">VIP Members</option>
                  </select>
                </div>

                {importType === "VIP" && (
                  <div className="space-y-1.5">
                    <label className="font-semibold text-white/80">VIP Tier</label>
                    <select
                      value={importTier}
                      onChange={(e) => setImportTier(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white"
                    >
                      <option value="VVIP Guest of Honour">VVIP Guest of Honour</option>
                      <option value="VIP Executive Patron">VIP Executive Patron</option>
                      <option value="Distinguished Speaker VIP">Distinguished Speaker VIP</option>
                      <option value="Special Invitee VIP">Special Invitee VIP</option>
                      <option value="Media & Diplomatic VIP">Media & Diplomatic VIP</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white/80">
                  Paste Attendees (One per line or "Full Name, email@domain.com")
                </label>
                <textarea
                  rows={8}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={`Musa Ibrahim, musa.ibrahim@gmail.com
fatima.shehu@ministry.gov.ng
Dr. Aminu Bello, aminu.bello@investcorp.ng`}
                  className="w-full p-3.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono placeholder:text-white/30 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <p className="text-[11px] text-white/50">
                Tip: You can paste emails directly or format as <em>"Name, email"</em>. Duplicates will be skipped automatically.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImportModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleBulkImport}
                className="bg-[#E62E2D] hover:bg-[#d02827] text-white text-xs"
              >
                Import Attendees
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD SINGLE ATTENDEE */}
      {showAddSingleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#0e1017] text-white shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                Add Attendee to Guest List
              </h3>
              <button
                onClick={() => setShowAddSingleModal(false)}
                className="text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSingle} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-white/80">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Aminu Bello Ibrahim"
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white/80">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. aminu@domain.com"
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-white/80">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as "Regular" | "VIP")}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white"
                  >
                    <option value="Regular">Regular Attendee</option>
                    <option value="VIP">VIP Member</option>
                  </select>
                </div>

                {newType === "VIP" && (
                  <div className="space-y-1.5">
                    <label className="font-semibold text-white/80">Tier</label>
                    <select
                      value={newTier}
                      onChange={(e) => setNewTier(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white"
                    >
                      <option value="VVIP Guest of Honour">VVIP Guest of Honour</option>
                      <option value="VIP Executive Patron">VIP Executive Patron</option>
                      <option value="Distinguished Speaker VIP">Distinguished Speaker VIP</option>
                      <option value="Special Invitee VIP">Special Invitee VIP</option>
                      <option value="Media & Diplomatic VIP">Media & Diplomatic VIP</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-white/80">Notes / Designation (Optional)</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Invited by Organizing Committee"
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddSingleModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#E62E2D] hover:bg-[#d02827] text-white text-xs"
                >
                  Save Attendee
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

