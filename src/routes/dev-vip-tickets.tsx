import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  Download,
  Printer,
  Mail,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Sparkles,
  FileSpreadsheet,
  Check,
  Eye,
  EyeOff,
  Layers,
  ArrowRight,
  ExternalLink,
  Users,
  Ticket,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { VipTicketView } from "@/components/vip/VipTicketView";
import { VipEmailModal } from "@/components/vip/VipEmailModal";
import {
  type VipTicketData,
  type TicketOrientation,
  downloadTicketImage,
} from "@/lib/ticket-canvas";

export const Route = createFileRoute("/dev-vip-tickets")({
  head: () => ({
    meta: [
      { title: "Developer VIP Ticket Studio — TEDxLafia" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DevVipTicketsRoute,
});

const DEFAULT_PIN = "TEDX-VIP-2026";
const STORAGE_KEY_PASSES = "tedxlafia_vip_passes_v1";
const STORAGE_KEY_AUTH = "tedxlafia_dev_auth_v1";
const STORAGE_KEY_PIN = "tedxlafia_dev_pin_v1";

const VIP_TIERS = [
  "VVIP Guest of Honour",
  "VIP Executive Patron",
  "Distinguished Speaker VIP",
  "Special Invitee VIP",
  "Media & Diplomatic VIP",
];

function generateSerial(): string {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TX-VIP-2026-${rand}`;
}

function emailToName(email: string): string {
  if (!email || !email.includes("@")) return "";
  const userPart = email.split("@")[0];
  const cleaned = userPart.replace(/[._+-]+/g, " ").trim();
  return cleaned
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function DevVipTicketsRoute() {
  // Gate authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [showPin, setShowPin] = useState<boolean>(false);

  // Studio tabs: "single" | "bulk" | "directory"
  const [activeTab, setActiveTab] = useState<"single" | "bulk" | "directory">("single");

  // Single Ticket Form State
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [tier, setTier] = useState<string>(VIP_TIERS[0]);
  const [serial, setSerial] = useState<string>(generateSerial());
  const [orientation, setOrientation] = useState<TicketOrientation>("horizontal");

  // Bulk Generator State
  const [bulkInput, setBulkInput] = useState<string>("");
  const [bulkTier, setBulkTier] = useState<string>(VIP_TIERS[0]);

  // Passes Directory State
  const [passes, setPasses] = useState<VipTicketData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPassForEmail, setSelectedPassForEmail] = useState<VipTicketData | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const auth = sessionStorage.getItem(STORAGE_KEY_AUTH);
      if (auth === "true") {
        setIsAuthenticated(true);
      }
      const savedPasses = localStorage.getItem(STORAGE_KEY_PASSES);
      if (savedPasses) {
        setPasses(JSON.parse(savedPasses));
      }
    } catch (e) {
      console.error("Storage load error", e);
    }
  }, []);

  // Save passes to localStorage whenever changed
  const savePasses = (newPasses: VipTicketData[]) => {
    setPasses(newPasses);
    try {
      localStorage.setItem(STORAGE_KEY_PASSES, JSON.stringify(newPasses));
    } catch (e) {
      console.error("Storage save error", e);
    }
  };

  // Authenticate Developer
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPin = localStorage.getItem(STORAGE_KEY_PIN) || DEFAULT_PIN;
    if (pinInput.trim() === storedPin) {
      setIsAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY_AUTH, "true");
      toast.success("Developer access granted. Welcome to VIP Ticket Studio.");
    } else {
      toast.error("Invalid developer PIN. Please check and try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEY_AUTH);
    toast.info("VIP Studio locked.");
  };

  // Auto-fill name when email is typed
  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (!name || name === emailToName(email)) {
      setName(emailToName(val));
    }
  };

  // Current active ticket data object for preview
  const currentTicket: VipTicketData = useMemo(
    () => ({
      id: "preview-ticket",
      email: email.trim() || "vip.guest@example.com",
      name: name.trim() || "Distinguished VIP Guest",
      tier: tier,
      serial: serial,
      eventDate: "Saturday, November 7, 2026",
      eventTime: "08:30 AM WAT (Doors open 08:00 AM)",
      venue: "NASIDA Investment Centre, Lafia, Nasarawa State",
    }),
    [email, name, tier, serial]
  );

  // Download Single Pass Image
  const handleDownloadSingle = async () => {
    if (!email.trim()) {
      toast.error("Please enter the VIP member's email address first.");
      return;
    }
    try {
      setIsExporting(true);
      toast.loading("Generating ultra-crisp VIP pass image...", { id: "export-single" });
      await downloadTicketImage(currentTicket, orientation);
      toast.success(`VIP pass downloaded for ${currentTicket.name}!`, { id: "export-single" });

      // Automatically save to directory if not already saved
      if (!passes.some((p) => p.serial === currentTicket.serial)) {
        const updated = [{ ...currentTicket, id: Date.now().toString() }, ...passes];
        savePasses(updated);
      }
    } catch (err) {
      toast.error("Failed to generate ticket image. Please try again.", { id: "export-single" });
    } finally {
      setIsExporting(false);
    }
  };

  // Save current ticket to directory
  const handleSaveToDirectory = () => {
    if (!email.trim()) {
      toast.error("Please enter the VIP member's email address first.");
      return;
    }
    const newPass: VipTicketData = {
      ...currentTicket,
      id: Date.now().toString(),
    };
    savePasses([newPass, ...passes]);
    toast.success(`Pass for ${currentTicket.name} saved to directory!`);
    // Generate new code for next pass
    setSerial(generateSerial());
    setEmail("");
    setName("");
  };

  // Bulk Generation Handler
  const handleBulkGenerate = () => {
    if (!bulkInput.trim()) {
      toast.error("Please paste at least one VIP email address.");
      return;
    }

    const lines = bulkInput
      .split(/[\n,;]+/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && l.includes("@"));

    if (lines.length === 0) {
      toast.error("No valid email addresses found. Please enter valid emails.");
      return;
    }

    const generated: VipTicketData[] = lines.map((em) => {
      const inferredName = emailToName(em) || "VIP Guest";
      const pass: VipTicketData = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        email: em,
        name: inferredName,
        tier: bulkTier,
        serial: generateSerial(),
        eventDate: "Saturday, November 7, 2026",
        eventTime: "08:30 AM WAT (Doors open 08:00 AM)",
        venue: "NASIDA Investment Centre, Lafia, Nasarawa State",
      };
      return pass;
    });

    savePasses([...generated, ...passes]);
    setBulkInput("");
    toast.success(`Successfully generated ${generated.length} VIP passes!`);
    setActiveTab("directory");
  };

  // Download All Passes (Batch)
  const handleBatchDownloadAll = async () => {
    if (passes.length === 0) {
      toast.error("No passes available to download.");
      return;
    }

    setIsExporting(true);
    toast.loading(`Downloading ${passes.length} VIP passes in sequence...`, { id: "batch-dl" });

    for (let i = 0; i < passes.length; i++) {
      await downloadTicketImage(passes[i], orientation);
      // Small pause to allow browser download queue to process smoothly
      await new Promise((r) => setTimeout(r, 600));
    }

    toast.success(`All ${passes.length} VIP passes downloaded successfully!`, { id: "batch-dl" });
    setIsExporting(false);
  };

  // Export Directory to CSV
  const handleExportCsv = () => {
    if (passes.length === 0) {
      toast.error("No passes to export.");
      return;
    }
    const headers = ["Serial ID", "Full Name", "Email", "VIP Tier", "Venue", "Event Date"];
    const rows = passes.map((p) => [
      p.serial,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.email.replace(/"/g, '""')}"`,
      `"${p.tier.replace(/"/g, '""')}"`,
      `"${(p.venue || "").replace(/"/g, '""')}"`,
      `"${(p.eventDate || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TEDxLafia-VIP-Attendees-List-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("VIP attendee directory exported to CSV!");
  };

  // Filtered Passes for Directory Table
  const filteredPasses = useMemo(() => {
    if (!searchQuery.trim()) return passes;
    const q = searchQuery.toLowerCase();
    return passes.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.serial.toLowerCase().includes(q) ||
        p.tier.toLowerCase().includes(q)
    );
  }, [passes, searchQuery]);

  // If locked, render sleek developer access gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07080c] text-white flex items-center justify-center p-4 relative overflow-hidden select-none">
        {/* Ambient background accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#E62E2D]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

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
              <h1 className="text-lg font-bold text-white mt-1">Developer VIP Studio</h1>
              <p className="text-xs text-white/60 mt-1 max-w-xs mx-auto">
                Restricted portal for organizers to generate and issue high-security VIP tickets.
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
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white font-mono placeholder:text-white/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 bg-[#E62E2D] hover:bg-[#d02827] text-white font-semibold rounded-xl cursor-pointer shadow-lg transition-transform active:scale-95"
            >
              <Unlock className="w-4 h-4 mr-2" /> Unlock VIP Studio
            </Button>
          </form>

          {/* Quick Developer Hint */}
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

  // Authenticated Developer VIP Studio
  return (
    <div className="min-h-screen bg-[#07080c] text-white pt-24 pb-20 select-none">
      {/* Print-specific style: when printing, only show the ticket */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-vip-ticket, #printable-vip-ticket * {
            visibility: visible !important;
          }
          #printable-vip-ticket {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            box-shadow: none !important;
            border: 2px solid #D4AF37 !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-white/10 bg-[#0f1118]/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E62E2D] to-amber-500 flex items-center justify-center text-white font-bold shadow-md">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold text-white">VIP Ticket Generator</h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-[10px] font-bold text-amber-300">
                  DEVELOPER ONLY
                </span>
              </div>
              <p className="text-xs text-white/60">
                Generate, download, and email luxury passes for TEDxLafia 2026 VIPs.
              </p>
            </div>
          </div>

          {/* Tab Navigation & Lock */}
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-xl bg-black/60 border border-white/10 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("single")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "single"
                    ? "bg-[#E62E2D] text-white shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Single Ticket
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bulk")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === "bulk"
                    ? "bg-[#E62E2D] text-white shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Bulk Mode
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("directory")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "directory"
                    ? "bg-[#E62E2D] text-white shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <span>Directory</span>
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                  {passes.length}
                </span>
              </button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-white/15 text-white/70 hover:text-white hover:bg-white/10"
              title="Lock Developer Studio"
            >
              <Lock className="w-3.5 h-3.5 mr-1" /> Lock
            </Button>
          </div>
        </div>

        {/* TAB 1: SINGLE TICKET GENERATOR */}
        {activeTab === "single" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Input Form Controls (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl border border-white/10 bg-[#0f1118]/90 p-6 sm:p-7 space-y-6 backdrop-blur-md">
              <div className="space-y-1">
                <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-amber-400" />
                  VIP Member Information
                </h2>
                <p className="text-xs text-white/60">
                  Enter email address to automatically configure the attendee pass.
                </p>
              </div>

              <div className="space-y-4">
                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80">
                    VIP Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="e.g. dr.aminu.bello@investcorp.ng"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400 text-sm font-mono"
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80">
                    VIP Full Name & Title
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Aminu Bello Ibrahim"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400 text-sm"
                  />
                </div>

                {/* VIP Category / Tier */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80">
                    VIP Category / Badge Tier
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-amber-400 text-sm"
                  >
                    {VIP_TIERS.map((t) => (
                      <option key={t} value={t} className="bg-[#12131a] text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pass Serial Code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/80 flex items-center justify-between">
                    <span>Unique Pass Serial Code</span>
                    <button
                      type="button"
                      onClick={() => setSerial(generateSerial())}
                      className="text-amber-400 hover:text-amber-300 text-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Regenerate Code
                    </button>
                  </label>
                  <input
                    type="text"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-amber-300 font-mono text-sm"
                  />
                </div>

                {/* Orientation Selector */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-white/80">
                    Card Style / Orientation
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrientation("horizontal")}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        orientation === "horizontal"
                          ? "border-amber-400 bg-amber-400/10 text-amber-300"
                          : "border-white/10 bg-black/40 text-white/60 hover:text-white"
                      }`}
                    >
                      <Layers className="w-4 h-4 rotate-90" /> Horizontal Pass
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrientation("vertical")}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        orientation === "vertical"
                          ? "border-amber-400 bg-amber-400/10 text-amber-300"
                          : "border-white/10 bg-black/40 text-white/60 hover:text-white"
                      }`}
                    >
                      <Layers className="w-4 h-4" /> Lanyard Badge
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Button
                  onClick={handleDownloadSingle}
                  disabled={isExporting}
                  className="w-full py-3.5 bg-gradient-to-r from-[#E62E2D] to-amber-600 hover:from-[#d02827] hover:to-amber-500 text-white font-bold rounded-xl shadow-lg cursor-pointer transition-transform active:scale-95"
                >
                  <Download className="w-4 h-4 mr-2" /> Download High-Res PNG Ticket
                </Button>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="border-white/15 text-white/80 hover:text-white hover:bg-white/10 text-xs"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1" /> Print / PDF
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPassForEmail(currentTicket)}
                    className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs"
                  >
                    <Mail className="w-3.5 h-3.5 mr-1" /> Draft Email
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveToDirectory}
                    className="border-white/15 text-white/80 hover:text-white hover:bg-white/10 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Save
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Live Ticket Interactive Preview (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-semibold text-white/70">
                    Live Ticket Preview (Retina Quality)
                  </span>
                </div>
                <span className="text-xs text-amber-400 font-mono">
                  {orientation === "horizontal" ? "2400 × 1080 px" : "1400 × 2100 px"}
                </span>
              </div>

              {/* Rendered Live Component */}
              <div className="overflow-x-auto p-2 sm:p-4 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center min-h-[460px]">
                <VipTicketView data={currentTicket} orientation={orientation} />
              </div>

              {/* Pro-Tip Bar */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs text-white/60">
                <span>
                  💡 <strong>Developer Tip:</strong> Clicking <em>"Download High-Res PNG Ticket"</em> exports a 300 DPI image that can be attached to emails or sent on WhatsApp.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BULK VIP GENERATOR */}
        {activeTab === "bulk" && (
          <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-[#0f1118]/90 p-8 space-y-6 backdrop-blur-md">
            <div>
              <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6 text-amber-400" />
                Batch VIP Pass Generator
              </h2>
              <p className="text-xs text-white/60 mt-1">
                Paste multiple VIP emails (separated by lines or commas). The system will assign
                sequential seating and unique QR pass codes for each member automatically.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5 max-w-sm">
                <label className="text-xs font-semibold text-white/80">Default VIP Tier</label>
                <select
                  value={bulkTier}
                  onChange={(e) => setBulkTier(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs"
                >
                  {VIP_TIERS.map((t) => (
                    <option key={t} value={t} className="bg-[#12131a]">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white/80">
                  Paste VIP Emails (one per line)
                </label>
                <textarea
                  rows={8}
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder={`dr.aminu.bello@investcorp.ng
hon.fatima.shehu@ministry.gov.ng
ceo@techventures.africa
distinguished.patron@domain.com`}
                  className="w-full p-4 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-amber-400 placeholder:text-white/30"
                />
              </div>

              <Button
                onClick={handleBulkGenerate}
                className="w-full py-3.5 bg-gradient-to-r from-[#E62E2D] to-amber-600 hover:from-[#d02827] text-white font-bold rounded-xl shadow-lg cursor-pointer"
              >
                <Sparkles className="w-4 h-4 mr-2" /> Generate All VIP Passes
              </Button>
            </div>
          </div>
        )}

        {/* TAB 3: DIRECTORY OF GENERATED PASSES */}
        {activeTab === "directory" && (
          <div className="rounded-3xl border border-white/10 bg-[#0f1118]/90 p-6 sm:p-8 space-y-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  Generated VIP Pass Directory ({passes.length})
                </h2>
                <p className="text-xs text-white/60">
                  Manage all issued VIP passes, re-download images, copy invitation messages, or export to CSV.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCsv}
                  disabled={passes.length === 0}
                  className="border-white/15 text-white hover:bg-white/10 text-xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Export CSV
                </Button>

                <Button
                  size="sm"
                  onClick={handleBatchDownloadAll}
                  disabled={passes.length === 0 || isExporting}
                  className="bg-[#E62E2D] hover:bg-[#d02827] text-white text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1" /> Download All ({passes.length})
                </Button>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, serial code, or seat..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/30 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Passes Table */}
            {filteredPasses.length === 0 ? (
              <div className="text-center py-16 space-y-3 border border-dashed border-white/10 rounded-2xl">
                <Ticket className="w-10 h-10 text-white/20 mx-auto" />
                <p className="text-sm text-white/60">No VIP passes found.</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveTab("single")}
                  className="text-xs"
                >
                  Generate your first VIP ticket
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="w-full text-left text-xs text-white/80">
                  <thead className="bg-white/[0.04] text-white/50 border-b border-white/10 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Serial ID</th>
                      <th className="py-3 px-4">VIP Attendee</th>
                      <th className="py-3 px-4">Tier</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {filteredPasses.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                          {p.serial}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-sm">{p.name}</div>
                          <div className="text-white/60 font-mono text-[11px]">{p.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[10px] font-bold text-amber-300">
                            {p.tier}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => downloadTicketImage(p, "horizontal")}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                              title="Download Horizontal PNG"
                            >
                              <Download className="w-3.5 h-3.5 text-amber-300" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedPassForEmail(p)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                              title="Draft VIP Email"
                            >
                              <Mail className="w-3.5 h-3.5 text-amber-300" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEmail(p.email);
                                setName(p.name);
                                setTier(p.tier);
                                setSerial(p.serial);
                                setActiveTab("single");
                              }}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                              title="Load in Preview"
                            >
                              <Eye className="w-3.5 h-3.5 text-white/70" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const remaining = passes.filter((item) => item.id !== p.id);
                                savePasses(remaining);
                                toast.info(`Pass for ${p.name} removed.`);
                              }}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                              title="Delete Pass"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Clear All Passes */}
            {passes.length > 0 && (
              <div className="pt-2 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to clear all saved VIP passes?")) {
                      savePasses([]);
                      toast.info("VIP pass directory cleared.");
                    }
                  }}
                  className="text-red-400 border-red-500/20 hover:bg-red-500/10 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear Directory
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Email Drafter Modal */}
      {selectedPassForEmail && (
        <VipEmailModal
          data={selectedPassForEmail}
          isOpen={!!selectedPassForEmail}
          onClose={() => setSelectedPassForEmail(null)}
        />
      )}
    </div>
  );
}

