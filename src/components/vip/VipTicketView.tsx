import React, { useMemo } from "react";
import { generateQRCodeMatrix } from "@/lib/qr";
import { type VipTicketData, type TicketOrientation } from "@/lib/ticket-canvas";
import { Sparkles, Calendar, MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";

interface VipTicketViewProps {
  data: VipTicketData;
  orientation?: TicketOrientation;
  className?: string;
}

export function VipTicketView({
  data,
  orientation = "horizontal",
  className = "",
}: VipTicketViewProps) {
  // Generate QR Code matrix dynamically based on ticket payload
  const qrMatrix = useMemo(() => {
    const payload = `https://tedxlafia.com/verify?serial=${encodeURIComponent(data.serial || "TX-VIP-2026")}&email=${encodeURIComponent(data.email || "")}&tier=${encodeURIComponent(data.tier || "")}`;
    return generateQRCodeMatrix(payload);
  }, [data.serial, data.email, data.tier]);

  if (orientation === "vertical") {
    return (
      <div
        id="printable-vip-ticket"
        className={`relative w-full max-w-[440px] mx-auto rounded-3xl overflow-hidden border-2 border-amber-500/70 bg-[#090a0f] text-white shadow-[0_25px_60px_-15px_rgba(212,175,55,0.25)] transition-all select-none ${className}`}
      >
        {/* Ambient Glows */}
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#E62E2D]/20 via-[#E62E2D]/5 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-amber-500/15 to-transparent pointer-events-none" />

        {/* Lanyard Slot Hole Simulation */}
        <div className="relative pt-6 flex justify-center">
          <div className="w-24 h-4 rounded-full bg-black/80 border border-amber-400/60 shadow-inner flex items-center justify-center">
            <span className="text-[9px] text-amber-300/40 uppercase tracking-widest font-mono">LANYARD SLOT</span>
          </div>
        </div>

        {/* Top Header & Branding */}
        <div className="px-6 pt-5 pb-3 text-center space-y-1 relative">
          <div className="flex items-center justify-center gap-1.5 font-display text-3xl font-extrabold tracking-tight">
            <span className="text-[#E62E2D]">TEDx</span>
            <span className="text-white">Lafia</span>
          </div>
          <p className="text-[10px] tracking-[0.2em] text-white/60 uppercase">
            x = independently organized TED event
          </p>

          {/* Hologram Badge Stamp */}
          <div className="absolute top-4 right-6 w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-cyan-400 p-[1.5px] shadow-lg">
            <div className="w-full h-full rounded-full bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-[7.5px] font-bold text-amber-200">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>VIP 2026</span>
            </div>
          </div>
        </div>

        {/* Massive Gold VIP Band */}
        <div className="my-3 py-2.5 px-4 bg-gradient-to-r from-amber-500/30 via-amber-400/90 to-amber-500/30 text-black text-center shadow-md">
          <span className="font-display font-black text-base tracking-widest text-[#0c0d12] uppercase flex items-center justify-center gap-2">
            <span>★</span>
            <span>VIP ALL-ACCESS DELEGATE</span>
            <span>★</span>
          </span>
        </div>

        {/* Attendee Credentials */}
        <div className="px-6 py-4 text-center space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/40 text-[11px] font-bold text-amber-300 tracking-wider uppercase">
            {data.tier || "VVIP GUEST OF HONOUR"}
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-white tracking-tight leading-tight">
            {data.name || "Distinguished VIP Guest"}
          </h2>

          <p className="text-xs font-mono text-white/70 break-all">{data.email || "vip@tedxlafia.com"}</p>

          {/* Pass ID Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/40 text-xs font-mono font-bold text-amber-300 mt-2">
            <span>ID: {data.serial || "TX-VIP-2026-0001"}</span>
          </div>
        </div>

        {/* Theme & Logistics */}
        <div className="px-6 py-3 border-y border-white/10 bg-white/[0.02] text-center space-y-1">
          <div className="text-[10px] text-[#E62E2D] font-bold tracking-widest uppercase">THEME</div>
          <div className="font-display text-lg font-bold text-white tracking-tight">THE TIPPING POINT</div>
          <div className="flex items-center justify-center gap-3 text-[11px] text-white/70 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-400" /> Nov 7, 2026 • 08:30 AM
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#E62E2D]" /> NASIDA Centre, Lafia
            </span>
          </div>
        </div>

        {/* Verification QR & Barcode */}
        <div className="p-6 text-center space-y-4">
          <div className="inline-block p-3 rounded-2xl bg-white shadow-xl">
            <div
              className="grid gap-0"
              style={{
                gridTemplateColumns: `repeat(${qrMatrix.length}, 1fr)`,
                width: 170,
                height: 170,
              }}
            >
              {qrMatrix.map((row, r) =>
                row.map((cell, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={cell ? "bg-black" : "bg-white"}
                  />
                ))
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="font-mono text-xs font-bold text-amber-400 tracking-wider">
              {data.serial}
            </div>
            <p className="text-[9px] text-white/50 tracking-wider uppercase">
              SCAN AT VIP FAST-TRACK ENTRANCE • PHOTO ID REQUIRED
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Horizontal Boarding Pass Format (Classic Luxury Ticket)
  return (
    <div
      id="printable-vip-ticket"
      className={`relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border-2 border-amber-500/60 bg-[#08090d] text-white shadow-[0_30px_70px_-20px_rgba(212,175,55,0.3)] transition-all select-none ${className}`}
    >
      {/* Background radial gradient lights */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#E62E2D]/15 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Outer subtle micro-grid watermark */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      <div className="relative grid grid-cols-1 md:grid-cols-[1fr_290px] min-h-[380px]">
        {/* MAIN BODY (LEFT) */}
        <div className="p-7 sm:p-9 flex flex-col justify-between space-y-6">
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-display text-3xl font-extrabold tracking-tight">
                <span className="text-[#E62E2D]">TEDx</span>
                <span className="text-white">Lafia</span>
              </div>
              <p className="text-[10px] tracking-[0.2em] text-white/60 uppercase">
                x = independently organized TED event
              </p>
            </div>

            {/* VIP Official Pass Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/80 bg-gradient-to-r from-amber-500/20 via-[#E62E2D]/20 to-amber-500/20 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="text-xs font-bold tracking-wider text-amber-300 uppercase">
                ★ OFFICIAL VIP ALL-ACCESS PASS ★
              </span>
            </div>
          </div>

          {/* Theme & Attendee Info */}
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold tracking-widest text-[#E62E2D] uppercase">
                THEME: THE TIPPING POINT
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1 capitalize sm:uppercase">
                {data.name || "Distinguished VIP Guest"}
              </h2>
              <p className="text-sm font-mono text-amber-200/90 mt-0.5">{data.email || "vip@tedxlafia.com"}</p>
            </div>

            {/* Badges strip */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-400/15 border border-amber-400/50 text-xs font-bold text-amber-300">
                ★ {data.tier || "VVIP GUEST OF HONOUR"}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white/70">
                ID: {data.serial}
              </span>
            </div>

            {/* VIP Privileges */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-white/80">
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-amber-400" /> Priority Reserved Seating
              </span>
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-amber-400" /> Backstage Executive Lounge
              </span>
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-amber-400" /> Speakers Banquet
              </span>
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-amber-400" /> Delegate Gift Pack
              </span>
            </div>
          </div>

          {/* Footer Logistics */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10 text-xs">
            <div>
              <div className="text-[10px] text-[#E62E2D] font-bold uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Date & Time
              </div>
              <div className="font-bold text-white text-sm mt-0.5">{data.eventDate || "Saturday, Nov 7, 2026"}</div>
              <div className="text-white/60 text-[11px]">{data.eventTime || "08:30 AM WAT (Doors open 08:00 AM)"}</div>
            </div>

            <div>
              <div className="text-[10px] text-[#E62E2D] font-bold uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Venue Location
              </div>
              <div className="font-bold text-white text-sm mt-0.5">NASIDA Investment Centre</div>
              <div className="text-white/60 text-[11px] truncate">Muhammadu Buhari Way, Lafia, Nasarawa</div>
            </div>
          </div>
        </div>

        {/* TICKET STUB (RIGHT) */}
        <div className="relative border-t md:border-t-0 md:border-l-2 md:border-dashed md:border-amber-500/40 bg-gradient-to-b from-white/[0.04] to-transparent p-7 flex flex-col justify-between items-center text-center">
          {/* Semicircle notches for horizontal perforated effect */}
          <div className="hidden md:block absolute -left-3.5 -top-3.5 w-7 h-7 rounded-full bg-[#030304] border-2 border-amber-500/60" />
          <div className="hidden md:block absolute -left-3.5 -bottom-3.5 w-7 h-7 rounded-full bg-[#030304] border-2 border-amber-500/60" />

          {/* Stub header */}
          <div className="w-full flex items-center justify-between pb-2 border-b border-white/10">
            <div className="text-left">
              <span className="text-xs font-bold text-amber-400">VIP PASS STUB</span>
              <p className="text-[9px] text-white/50">TEDxLafia 2026</p>
            </div>
            {/* Hologram stamp */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-cyan-400 p-[1px] shadow-md">
              <div className="w-full h-full rounded-full bg-black/70 flex items-center justify-center text-[7px] text-amber-200 font-bold">
                ★ VIP
              </div>
            </div>
          </div>

          {/* Live Scannable QR Code */}
          <div className="my-3 p-3 rounded-2xl bg-white shadow-xl">
            <div
              className="grid gap-0"
              style={{
                gridTemplateColumns: `repeat(${qrMatrix.length}, 1fr)`,
                width: 150,
                height: 150,
              }}
            >
              {qrMatrix.map((row, r) =>
                row.map((cell, c) => (
                  <div
                    key={`${r}-${c}`}
                    className={cell ? "bg-black" : "bg-white"}
                  />
                ))
              )}
            </div>
          </div>

          {/* Stub details */}
          <div className="w-full space-y-2">
            <div>
              <div className="text-xs font-bold text-amber-300 font-display truncate">
                {data.name || "VIP GUEST"}
              </div>
              <div className="text-[10px] font-semibold text-amber-200/80 uppercase tracking-wider">
                VIP ALL-ACCESS
              </div>
            </div>

            {/* Barcode line simulation */}
            <div className="py-1">
              <div className="h-6 w-full flex justify-between items-stretch gap-[2px] opacity-80">
                {Array.from({ length: 42 }).map((_, i) => (
                  <div
                    key={i}
                    className={`bg-white rounded-xs ${
                      i % 7 === 0 || i % 5 === 0 ? "w-1" : i % 3 === 0 ? "w-0.5" : "w-[1px]"
                    }`}
                  />
                ))}
              </div>
              <div className="font-mono text-[10px] text-amber-400 font-bold mt-1">
                * {data.serial} *
              </div>
            </div>

            <p className="text-[8px] text-white/40 uppercase tracking-widest">
              FAST-TRACK VIP ENTRANCE SCAN
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

