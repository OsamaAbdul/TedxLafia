import React, { useState } from "react";
import { Copy, Check, Mail, ExternalLink, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { type VipTicketData } from "@/lib/ticket-canvas";

interface VipEmailModalProps {
  data: VipTicketData;
  isOpen: boolean;
  onClose: () => void;
}

export function VipEmailModal({ data, isOpen, onClose }: VipEmailModalProps) {
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);

  if (!isOpen) return null;

  const subject = `Official VIP Delegate Pass — TEDxLafia 2026: "The Tipping Point"`;

  const emailBody = `Dear ${data.name || "Distinguished Guest"},

On behalf of the TEDxLafia Organizing Committee, we have the distinct honor of reserving an exclusive VIP All-Access Pass for you at TEDxLafia 2026.

As our ${data.tier || "VVIP Guest of Honour"}, your dedicated VIP pass is attached to this email.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EVENT CONVENING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Event: TEDxLafia 2026: The Tipping Point
• Date: Saturday, November 7, 2026
• Time: 08:30 AM WAT (VIP Reception doors open at 08:00 AM)
• Venue: Abdullahi Sule Investment Centre (NASIDA), Muhammadu Buhari Way, Lafia, Nasarawa State, Nigeria
• VIP Pass Serial: ${data.serial}

VIP INCLUSIONS & PRIVILEGES:
✓ Priority VIP Fast-Track Entrance (show the QR code on your attached ticket)
✓ Reserved Executive VIP Area & Front Seating
✓ Access to the Backstage & Speakers VIP Lounge
✓ Invitation to the Exclusive Post-Event Speakers Banquet & Networking Dinner
✓ Complimentary Official TEDxLafia Executive Gift Kit

ARRIVAL INSTRUCTIONS:
Please save the attached VIP ticket to your mobile device or bring a printed copy. Present your pass at the dedicated VIP Fast-Track desk upon arrival at the NASIDA Centre for immediate expedited badge credentialing.

If you have any special requirements, please feel free to reply directly to this email or contact us at hello@tedxlafia.com.

We eagerly anticipate welcoming you to Lafia for an unforgettable day of transformative ideas.

With our highest regards,

The TEDxLafia Organizing Team
Website: https://tedxlafia.com
Lafia, Nasarawa State, Nigeria`;

  const handleCopySubject = async () => {
    await navigator.clipboard.writeText(subject);
    setCopiedSubject(true);
    toast.success("Email subject copied to clipboard!");
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const handleCopyBody = async () => {
    await navigator.clipboard.writeText(emailBody);
    setCopiedBody(true);
    toast.success("Full VIP invitation email copied to clipboard!");
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const mailtoUrl = `mailto:${encodeURIComponent(data.email)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(emailBody)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-amber-500/40 bg-[#0e0f15] text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-400" />
            <h3 className="font-display text-lg font-bold text-white">
              VIP Email Invitation Drafter
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Recipient */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10">
            <div>
              <span className="text-xs text-white/50 block">Recipient Email</span>
              <span className="font-mono text-amber-300 font-medium">
                {data.email}
              </span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30">
              {data.tier}
            </span>
          </div>

          {/* Subject Line */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white/70">Email Subject</label>
              <button
                onClick={handleCopySubject}
                className="text-xs text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedSubject ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Subject
                  </>
                )}
              </button>
            </div>
            <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-white/90">
              {subject}
            </div>
          </div>

          {/* Email Body */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white/70">Invitation Message</label>
              <button
                onClick={handleCopyBody}
                className="text-xs text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedBody ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Message Text
                  </>
                )}
              </button>
            </div>
            <textarea
              readOnly
              value={emailBody}
              rows={12}
              className="w-full p-3 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-white/80 leading-relaxed resize-none focus:outline-none"
            />
          </div>

          {/* Pro-tip Notice */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
            💡 <strong>Next Step:</strong> Download the VIP Ticket PNG, copy this message or open your email client, attach the downloaded image, and send!
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyBody}
              className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
            >
              <Copy className="w-4 h-4 mr-1.5" /> Copy Full Text
            </Button>

            <Button asChild size="sm" className="bg-[#E62E2D] hover:bg-[#d02827] text-white">
              <a href={mailtoUrl} target="_blank" rel="noreferrer">
                <Send className="w-4 h-4 mr-1.5" /> Open in Email App
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

