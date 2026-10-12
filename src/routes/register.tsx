import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Loader2,
  Download,
  Image as ImageIcon,
  Printer,
  Upload,
  User,
  ArrowRight,
  RotateCcw,
  Ticket,
  AlertCircle,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register for TEDxLafia 2026 — Official Ticket & Pass" },
      {
        name: "description",
        content: "Register for TEDxLafia 2026 and download your official PNG or JPEG attendee ticket pass.",
      },
      { property: "og:title", content: "Register for TEDxLafia 2026" },
    ],
  }),
  component: RegisterPage,
});

// Connected live Google Apps Script Web App URL for dynamic capacity & duplicate prevention
const GOOGLE_SHEET_API_URL: string =
  ((import.meta.env as Record<string, string | undefined>)["VITE_GOOGLE_SHEET_URL"] || "");

const WEB3FORMS_ACCESS_KEY: string =
  ((import.meta.env as Record<string, string | undefined>)["VITE_WEB3FORMS_ACCESS_KEY"] || "");

const fieldClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary";

function RegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [checkingCapacity, setCheckingCapacity] = useState(true);

  // Dynamic capacity & attendee state (live-synced from Google Sheet)
  const [maxCapacity, setMaxCapacity] = useState(150);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [isRegistrationClosed, setIsRegistrationClosed] = useState(false);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [ticketDetails, setTicketDetails] = useState({
    firstName: "Attendee",
    fullName: "",
    email: "",
    phone: "",
    occupation: "",
    reason: "",
    seatNumber: "A-42",
    passId: "TXL-2026-084",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    occupation: "",
    reason: "",
  });

  // 1. Fetch live capacity and attendee count from Google Sheet on page load
  useEffect(() => {
    async function fetchCapacity() {
      if (!GOOGLE_SHEET_API_URL) {
        setCheckingCapacity(false);
        return;
      }

      try {
        const res = await fetch(GOOGLE_SHEET_API_URL);
        const data = await res.json();

        if (data && typeof data.capacity === "number") {
          setMaxCapacity(data.capacity);
          setRegisteredCount(data.totalRegistered || 0);

          if (data.isFull || !data.isOpen || (data.totalRegistered >= data.capacity)) {
            setIsRegistrationClosed(true);
          }
        }
      } catch (err) {
        console.warn("Could not fetch live capacity from Google Sheet. Using fallback limit (150).", err);
      } finally {
        setCheckingCapacity(false);
      }
    }

    fetchCapacity();
  }, []);

  const update = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (JPG or PNG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const cleanEmail = form.email.trim().toLowerCase();

    if (
      !form.name.trim() ||
      !cleanEmail ||
      !form.phone.trim() ||
      !form.occupation.trim() ||
      !form.reason.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Step A: Client-side duplicate check (checks previous registrations from this device)
    const storedEmails: string[] = JSON.parse(
      localStorage.getItem("tedxlafia_registered_emails") || "[]"
    );
    if (storedEmails.includes(cleanEmail)) {
      toast.error("Already registered", {
        description: "This email address has already been used to register for TEDxLafia 2026.",
      });
      return;
    }

    setSubmitting(true);

    // Prominent first name for ticket
    const rawFirst = form.name.trim().split(" ")[0] || "Attendee";
    const firstName = rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1).toLowerCase();

    // Generate seat & pass ID
    const randomSeat = `A-${Math.floor(10 + Math.random() * 89)}`;
    const randomId = `TXL-2026-${Math.floor(100 + Math.random() * 899)}`;

    try {
      // Step B: Validate uniqueness & capacity in Google Sheet
      if (GOOGLE_SHEET_API_URL) {
        try {
          const sheetRes = await fetch(GOOGLE_SHEET_API_URL, {
            method: "POST",
            body: JSON.stringify({
              name: form.name.trim(),
              email: cleanEmail,
              phone: form.phone.trim(),
              occupation: form.occupation.trim(),
              reason: form.reason.trim(),
              seat: randomSeat,
              passId: randomId,
            }),
          });

          const sheetData = await sheetRes.json();

          if (sheetData.status === "ALREADY_REGISTERED") {
            toast.error("Duplicate Email Detected", {
              description: "This email address is already registered on our attendee list.",
            });
            setSubmitting(false);
            return;
          }

          if (sheetData.status === "FULL_CAPACITY") {
            setIsRegistrationClosed(true);
            toast.error("Registration Closed", {
              description: `All ${sheetData.capacity || maxCapacity} seats have been reserved.`,
            });
            setSubmitting(false);
            return;
          }

          if (typeof sheetData.totalRegistered === "number") {
            setRegisteredCount(sheetData.totalRegistered);
          }
        } catch (sheetErr) {
          console.warn("Google Sheet validation warning:", sheetErr);
        }
      }

      // Step C: Forward submission to Web3Forms for email delivery & dashboard tracking
      if (!WEB3FORMS_ACCESS_KEY) {
        toast.error("Configuration Error", {
          description: "VITE_WEB3FORMS_ACCESS_KEY is not configured in your environment.",
        });
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("access_key", WEB3FORMS_ACCESS_KEY);
      formData.append(
        "subject",
        `New TEDxLafia 2026 Registration: ${form.name.trim()} (${form.occupation.trim()})`
      );
      formData.append("from_name", "TEDxLafia 2026 Registration");
      formData.append("name", form.name.trim());
      formData.append("email", cleanEmail);
      formData.append("phone", form.phone.trim());
      formData.append("occupation", form.occupation.trim());
      formData.append("reason_to_attend", form.reason.trim());
      formData.append("seat_assigned", randomSeat);
      formData.append("pass_id", randomId);

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        // Save to local storage cache to guard against duplicate submissions
        storedEmails.push(cleanEmail);
        localStorage.setItem(
          "tedxlafia_registered_emails",
          JSON.stringify(storedEmails)
        );

        setRegisteredCount((prev) => prev + 1);

        setTicketDetails({
          firstName,
          fullName: form.name.trim(),
          email: cleanEmail,
          phone: form.phone.trim(),
          occupation: form.occupation.trim(),
          reason: form.reason.trim(),
          seatNumber: randomSeat,
          passId: randomId,
        });

        setSubmitted(true);
        toast.success("Registration Successful!", {
          description: "Your official TEDxLafia 2026 ticket is ready to download.",
        });
        window.scrollTo({ top: 100, behavior: "smooth" });
      } else {
        toast.error("Registration failed", {
          description: data.message || "Please check your details and try again.",
        });
      }
    } catch {
      toast.error("Network error", {
        description: "Could not submit registration. Please check your connection.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setForm({
      name: "",
      email: "",
      phone: "",
      occupation: "",
      reason: "",
    });
    setPhotoPreview(null);
    setSubmitted(false);
  }

  // High-Resolution 300 DPI Canvas Rendering for PNG & JPEG Download
  const downloadTicketImage = async (format: "png" | "jpeg" = "png") => {
    if (downloading) return;
    setDownloading(true);

    try {
      const canvas = document.createElement("canvas");
      // High-resolution 2x canvas (1400 x 600) for print-ready fidelity
      const width = 1400;
      const height = 600;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas context");

      // 1. Backgrounds
      // Left section (0 to 950): Deep luxury ink black
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, 950, height);

      // Right stub section (950 to 1400): TEDx Red
      ctx.fillStyle = "#E62E2D";
      ctx.fillRect(950, 0, 450, height);

      // 2. Perforated dashed divider line at x = 950
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 3;
      ctx.setLineDash([12, 10]);
      ctx.beginPath();
      ctx.moveTo(950, 0);
      ctx.lineTo(950, height);
      ctx.stroke();
      ctx.restore();

      // Top and bottom circular tear notches
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(950, 0, 24, 0, Math.PI);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(950, height, 24, Math.PI, 0);
      ctx.fill();

      // 3. Left Section Header: TEDxLafia 2026 Logo
      ctx.font = "bold 44px Jost, sans-serif";
      ctx.fillStyle = "#E62E2D";
      ctx.fillText("TEDx", 60, 90);
      const tedxWidth = ctx.measureText("TEDx").width;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("Lafia", 60 + tedxWidth + 4, 90);
      const lafiaWidth = ctx.measureText("Lafia").width;

      ctx.font = "normal 24px Jost, sans-serif";
      ctx.fillStyle = "#E62E2D";
      ctx.fillText("2026", 60 + tedxWidth + lafiaWidth + 12, 90);

      // Subtitle tagline
      ctx.font = "14px Jost, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillText("x = independently organized TED event", 60, 120);

      // Official Pass Pill Tag
      ctx.save();
      ctx.strokeStyle = "rgba(230, 46, 45, 0.6)";
      ctx.lineWidth = 2;
      ctx.fillStyle = "rgba(230, 46, 45, 0.15)";
      ctx.beginPath();
      ctx.roundRect(750, 60, 140, 36, 18);
      ctx.fill();
      ctx.stroke();
      ctx.font = "bold 13px Jost, sans-serif";
      ctx.fillStyle = "#E62E2D";
      ctx.textAlign = "center";
      ctx.fillText("OFFICIAL PASS", 820, 83);
      ctx.restore();

      // 4. Attendee Details: Prominent First Name & Full Name
      ctx.font = "14px Jost, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillText("ATTENDEE", 60, 210);

      ctx.font = "600 76px 'Cormorant Garamond', Georgia, serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(ticketDetails.firstName.toUpperCase(), 60, 285);

      ctx.font = "20px Jost, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillText(ticketDetails.fullName, 60, 325);

      // Badge: "I'm attending TEDxLafia 2026"
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(60, 360, 370, 46, 23);
      ctx.fill();
      ctx.stroke();

      // Red pulse dot
      ctx.fillStyle = "#E62E2D";
      ctx.beginPath();
      ctx.arc(86, 383, 6, 0, Math.PI * 2);
      ctx.fill();

      // Badge text
      ctx.font = "bold 15px Jost, sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("I'M ATTENDING TEDXLAFIA 2026", 106, 389);
      ctx.restore();

      // 5. Portrait Photo
      const photoX = 740;
      const photoY = 270;
      const photoRadius = 100;

      // Outer gold/red ring
      ctx.save();
      ctx.strokeStyle = "#E62E2D";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(photoX, photoY, photoRadius + 4, 0, Math.PI * 2);
      ctx.stroke();

      // Circular clipped portrait
      ctx.beginPath();
      ctx.arc(photoX, photoY, photoRadius, 0, Math.PI * 2);
      ctx.clip();

      if (photoPreview) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            ctx.drawImage(
              img,
              photoX - photoRadius,
              photoY - photoRadius,
              photoRadius * 2,
              photoRadius * 2
            );
            resolve();
          };
          img.onerror = () => resolve();
          img.src = photoPreview;
        });
      } else {
        ctx.fillStyle = "#222222";
        ctx.fillRect(photoX - photoRadius, photoY - photoRadius, photoRadius * 2, photoRadius * 2);
        ctx.fillStyle = "#888888";
        ctx.font = "bold 24px Jost, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("PASS", photoX, photoY + 8);
      }
      ctx.restore();

      // 6. Left Bottom Meta Bar (Date, Venue, Seat)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(60, 470);
      ctx.lineTo(890, 470);
      ctx.stroke();

      // Date
      ctx.font = "13px Jost, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillText("DATE", 60, 505);
      ctx.font = "bold 18px Jost, sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("Nov 7th, 2026", 60, 535);

      // Venue
      ctx.font = "13px Jost, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillText("VENUE", 260, 505);
      ctx.font = "bold 15px Jost, sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("NASIDA (Abdullahi Sule Centre)", 260, 528);
      ctx.font = "12px Jost, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.fillText("Muhammadu Buhari Way, Lafia", 260, 548);

      // Access Type
      ctx.font = "13px Jost, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillText("ACCESS", 700, 505);
      ctx.font = "bold 18px Jost, sans-serif";
      ctx.fillStyle = "#E62E2D";
      ctx.fillText("General Admission", 700, 535);

      // 7. Right Section (Perforated Stub)
      ctx.textAlign = "center";
      ctx.font = "bold 16px Jost, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.fillText("TEDxLAFIA 2026", 1175, 80);

      ctx.font = "300 24px 'Cormorant Garamond', Georgia, serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText("Admission Stub", 1175, 115);

      // White Card for QR & Barcode
      ctx.save();
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(1030, 150, 290, 310, 24);
      ctx.fill();

      // Draw QR Code
      const qrX = 1075;
      const qrY = 175;
      ctx.fillStyle = "#000000";
      // Corner 1
      ctx.fillRect(qrX, qrY, 50, 50);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(qrX + 10, qrY + 10, 30, 30);
      ctx.fillStyle = "#000000";
      ctx.fillRect(qrX + 18, qrY + 18, 14, 14);

      // Corner 2
      ctx.fillRect(qrX + 150, qrY, 50, 50);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(qrX + 160, qrY + 10, 30, 30);
      ctx.fillStyle = "#000000";
      ctx.fillRect(qrX + 168, qrY + 18, 14, 14);

      // Corner 3
      ctx.fillRect(qrX, qrY + 150, 50, 50);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(qrX + 10, qrY + 160, 30, 30);
      ctx.fillStyle = "#000000";
      ctx.fillRect(qrX + 18, qrY + 168, 14, 14);

      // QR Data dots
      const cells = [
        [70, 20], [90, 20], [110, 20], [70, 40], [120, 40],
        [70, 70], [90, 70], [110, 90], [130, 70], [150, 70],
        [20, 70], [40, 70], [30, 90], [50, 110], [20, 120],
        [70, 120], [90, 140], [110, 120], [130, 140], [150, 120],
        [170, 70], [180, 100], [160, 140], [180, 160], [170, 180],
        [70, 160], [90, 180], [110, 160], [130, 180], [70, 190],
      ];
      cells.forEach(([cx, cy]) => {
        if (typeof cx === "number" && typeof cy === "number") {
          ctx.fillRect(qrX + cx, qrY + cy, 14, 14);
        }
      });

      // Barcode lines
      const barY = qrY + 225;
      const bars = [3, 1, 4, 2, 5, 1, 6, 2, 2, 4, 1, 3, 5, 2, 1, 4, 2, 5, 3, 2, 6, 1, 4, 2];
      let curX = qrX + 10;
      bars.forEach((bw) => {
        ctx.fillRect(curX, barY, bw * 2, 35);
        curX += bw * 2 + 5;
      });
      ctx.restore();

      // Stub footer Access
      ctx.font = "bold 18px Jost, sans-serif";
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.fillText("GENERAL ADMISSION", 1175, 512);

      ctx.font = "14px Jost, sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fillText("Official Attendee Pass", 1175, 538);

      // Trigger Direct Browser Download
      const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
      const extension = format === "jpeg" ? "jpg" : "png";
      const dataUrl = canvas.toDataURL(mimeType, 0.95);

      const link = document.createElement("a");
      link.download = `TEDxLafia-2026-Ticket-${ticketDetails.firstName.toUpperCase()}.${extension}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Ticket downloaded as ${extension.toUpperCase()}!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate ticket image. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 lg:pt-36 lg:pb-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {submitted ? (
          /* Live Ticket Pass View */
          <div className="space-y-8">
            <div className="text-center space-y-2 print:hidden">
              <span className="eyebrow inline-flex items-center gap-2 text-primary">
                <span className="mark-red" />
                TEDxLafia 2026 Pass Ready
              </span>
              <h1 className="font-display text-4xl sm:text-5xl text-foreground font-light">
                Your Official Attendee Ticket
              </h1>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Download your official high-resolution ticket below for event day entry and social sharing.
              </p>
            </div>

            {/* Ticket Preview Card */}
            <div
              id="printable-ticket"
              className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/20 bg-neutral-950 text-white shadow-2xl relative select-none"
            >
              <div className="relative flex flex-col md:flex-row">
                {/* Main Ticket Body (Left 68%) */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-dashed border-white/20 relative">
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-baseline gap-1 font-sans text-2xl font-bold tracking-tight">
                        <span className="text-primary font-black">TEDx</span>
                        <span className="text-white">Lafia</span>
                        <span className="text-primary text-xs ml-1 font-normal">2026</span>
                      </div>
                      <p className="text-[9px] font-sans uppercase tracking-[0.22em] text-white/50 mt-0.5">
                        x = independently organized TED event
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-primary">
                        Official Pass
                      </span>
                    </div>
                  </div>

                  {/* Middle Content */}
                  <div className="flex items-center justify-between gap-4 py-4 my-auto">
                    <div className="space-y-3 min-w-0">
                      <div>
                        <p className="eyebrow text-[10px] text-white/40">Attendee</p>
                        <h2 className="font-display text-4xl sm:text-6xl font-normal tracking-tight text-white uppercase truncate">
                          {ticketDetails.firstName}
                        </h2>
                        <p className="text-xs text-white/60 font-sans mt-0.5 truncate max-w-[240px]">
                          {ticketDetails.fullName}
                        </p>
                      </div>

                      {/* Attendee Badge Pill */}
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        <span className="eyebrow text-[10px] font-semibold tracking-widest text-white">
                          I'm attending TEDxLafia 2026
                        </span>
                      </div>
                    </div>

                    {/* Portrait Photo Frame */}
                    <div className="shrink-0 pl-2">
                      <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full p-1 border-2 border-primary/80 bg-neutral-900 shadow-xl relative overflow-hidden">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt={`${ticketDetails.fullName} Portrait`}
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="h-full w-full rounded-full bg-neutral-800 flex items-center justify-center text-white/40">
                            <User className="h-12 w-12" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-white/10 pt-4 mt-6 text-left items-start">
                    <div>
                      <p className="eyebrow text-[9px] text-white/40">Date</p>
                      <p className="text-xs sm:text-sm font-medium text-white font-sans mt-0.5">
                        Nov 7th, 2026
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow text-[9px] text-white/40">Venue</p>
                      <p className="text-xs sm:text-sm font-medium text-white font-sans mt-0.5 leading-snug">
                        Nasarawa Investment &amp; Development Agency (NASIDA)
                      </p>
                      <p className="text-[10px] sm:text-[11px] text-white/70 font-sans mt-0.5 leading-tight">
                        Abdullahi Sule Investment Centre, Muhammadu Buhari Way, Lafia, Nasarawa State, Nigeria
                      </p>
                    </div>
                    <div className="text-left sm:text-right col-span-2 sm:col-span-1">
                      <p className="eyebrow text-[9px] text-white/40">Access</p>
                      <p className="text-xs sm:text-sm font-bold text-primary font-sans mt-0.5">
                        General Admission
                      </p>
                    </div>
                  </div>
                </div>

                {/* Perforated Stub Section (Right 32%) */}
                <div className="w-full md:w-64 bg-primary text-primary-foreground p-6 sm:p-8 flex flex-col justify-between items-center text-center relative overflow-hidden">
                  <div className="hidden md:block absolute -left-3 top-[-12px] h-6 w-6 rounded-full bg-background" />
                  <div className="hidden md:block absolute -left-3 bottom-[-12px] h-6 w-6 rounded-full bg-background" />

                  <div className="w-full">
                    <p className="eyebrow text-[9px] text-white/80 tracking-widest">TEDxLafia</p>

                  </div>

                  {/* QR & Barcode */}
                  <div className="my-4 p-3 bg-white rounded-2xl shadow-lg flex flex-col items-center">
                    <svg
                      viewBox="0 0 100 100"
                      className="h-24 w-24 text-black"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="5" y="5" width="30" height="30" rx="4" fill="black" />
                      <rect x="11" y="11" width="18" height="18" fill="white" />
                      <rect x="16" y="16" width="8" height="8" fill="black" />
                      <rect x="65" y="5" width="30" height="30" rx="4" fill="black" />
                      <rect x="71" y="11" width="18" height="18" fill="white" />
                      <rect x="76" y="16" width="8" height="8" fill="black" />
                      <rect x="5" y="65" width="30" height="30" rx="4" fill="black" />
                      <rect x="11" y="71" width="18" height="18" fill="white" />
                      <rect x="16" y="76" width="8" height="8" fill="black" />
                      <rect x="42" y="8" width="8" height="8" fill="black" />
                      <rect x="50" y="20" width="8" height="8" fill="black" />
                      <rect x="42" y="42" width="16" height="16" fill="black" />
                      <rect x="65" y="42" width="8" height="8" fill="black" />
                      <rect x="78" y="55" width="14" height="8" fill="black" />
                      <rect x="42" y="65" width="8" height="14" fill="black" />
                      <rect x="65" y="75" width="14" height="14" fill="black" />
                      <rect x="85" y="70" width="8" height="8" fill="black" />
                      <rect x="18" y="42" width="8" height="8" fill="black" />
                      <rect x="8" y="50" width="8" height="8" fill="black" />
                    </svg>

                    <div className="flex gap-[2px] h-6 items-end mt-2 px-1">
                      {[3, 1, 4, 1, 5, 2, 6, 2, 1, 4, 3, 2, 5, 1, 3, 2, 4, 1, 6, 2].map((w, idx) => (
                        <div
                          key={idx}
                          className="bg-black"
                          style={{ width: `${w * 1.5}px`, height: "100%" }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="w-full text-center">

                    <p className="text-[9px] text-white/70 font-sans mt-0.5">
                      Official Attendee Pass
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Buttons: PNG & JPEG */}
            <div className="flex flex-wrap gap-4 justify-center print:hidden pt-4">
              <Button
                onClick={() => downloadTicketImage("png")}
                disabled={downloading}
                variant="editorial"
                size="editorial"
                className="flex items-center justify-center gap-2"
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download Ticket (PNG)
              </Button>

              <Button
                onClick={() => downloadTicketImage("jpeg")}
                disabled={downloading}
                variant="secondary"
                size="editorial"
                className="flex items-center justify-center gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                Download Ticket (JPEG)
              </Button>

              <Button
                onClick={() => window.print()}
                variant="outline"
                size="editorial"
                className="flex items-center justify-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Print / Save PDF
              </Button>

              <Button
                onClick={handleReset}
                variant="ghost"
                size="editorial"
                className="flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Register Another Attendee
              </Button>
            </div>
          </div>
        ) : isRegistrationClosed ? (
          /* Capacity Reached / Registration Closed View */
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-14 shadow-2xl text-center space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Ticket className="h-10 w-10" />
            </div>

            <div>
              <span className="eyebrow text-primary">Registration Closed</span>
              <h2 className="font-display text-4xl sm:text-5xl text-foreground font-light mt-2">
                Maximum Capacity Reached
              </h2>
              <p className="mt-4 text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
                All <strong className="text-foreground">{maxCapacity} seats</strong> for TEDxLafia 2026 have been filled. Registration is currently closed to maintain our intimate event format.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background/50 p-6 max-w-md mx-auto space-y-3 text-sm text-foreground/80">
              <div className="flex items-center justify-between">
                <span>Reserved Seats:</span>
                <span className="font-semibold text-primary">{maxCapacity} / {maxCapacity}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <span className="font-semibold text-rose-500">Sold Out</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="editorial" size="editorial">
                <Link to="/contact">
                  Join the Waitlist / Contact Us <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="editorial">
                <Link to="/">Return to Homepage</Link>
              </Button>
            </div>
          </div>
        ) : (
          /* Registration Form View */
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 shadow-xl">
            <div className="mb-8 border-b border-border pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="eyebrow flex items-center gap-2 text-primary">
                  <span className="mark-red" aria-hidden />
                  TEDxLafia 2026
                </p>
                <h1 className="font-display text-3xl sm:text-4xl text-foreground mt-2">
                  Registration & Ticket Application
                </h1>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Complete your details below to generate and download your personalized TEDxLafia 2026 ticket pass.
                </p>
              </div>

              {/* Live Capacity Indicator Badge */}
              <div className="shrink-0 flex items-center gap-2 rounded-full border border-border bg-background/60 px-3.5 py-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>
                  Limited to <strong className="text-foreground">{maxCapacity}</strong> attendees
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo Upload Input */}
              <div className="rounded-2xl border border-dashed border-border bg-background/50 p-6 text-center">
                <label className="block eyebrow text-xs text-muted-foreground mb-3">
                  Upload Portrait Photo (For your official ticket)
                </label>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                  <div className="h-20 w-20 rounded-full border-2 border-primary/50 bg-neutral-900 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Photo Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-muted-foreground/60" />
                    )}
                  </div>
                  <div className="text-left space-y-1">
                    <label
                      htmlFor="photo-upload"
                      className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-medium text-primary cursor-pointer hover:bg-primary/20 transition-colors"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {photoPreview ? "Change Photo" : "Upload Headshot Photo"}
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Square or portrait format (JPG, PNG, max 5MB).
                    </p>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="reg-name" className="block eyebrow text-xs text-muted-foreground mb-2">
                  Full Name *
                </label>
                <input
                  id="reg-name"
                  required
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="e.g Osama Abdullahi"
                  className={fieldClass}
                />
              </div>

              {/* Email & Phone */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="reg-email" className="block eyebrow text-xs text-muted-foreground mb-2">
                    Email Address *
                  </label>
                  <input
                    id="reg-email"
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={update("email")}
                    placeholder="osama@example.com"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label htmlFor="reg-phone" className="block eyebrow text-xs text-muted-foreground mb-2">
                    Phone Number *
                  </label>
                  <input
                    id="reg-phone"
                    required
                    type="tel"
                    name="phone"
                    value={form.phone}
                    maxLength={11}
                    onChange={update("phone")}
                    placeholder="08012345678"
                    className={fieldClass}
                  />
                </div>
              </div>

              {/* Organization / Occupation */}
              <div>
                <label htmlFor="reg-occupation" className="block eyebrow text-xs text-muted-foreground mb-2">
                  Organization / Occupation *
                </label>
                <input
                  id="reg-occupation"
                  required
                  type="text"
                  name="occupation"
                  value={form.occupation}
                  onChange={update("occupation")}
                  placeholder="e.g. Student, Entrepreneur, Software Engineer, Creative"
                  className={fieldClass}
                />
              </div>

              {/* Why you would like to attend */}
              <div>
                <label htmlFor="reg-reason" className="block eyebrow text-xs text-muted-foreground mb-2">
                  Why would you like to attend TEDxLafia 2026? *
                </label>
                <textarea
                  id="reg-reason"
                  required
                  rows={4}
                  name="reason"
                  value={form.reason}
                  onChange={update("reason")}
                  placeholder="Share what inspires you to join the conversation and connect with our community."
                  className={`${fieldClass} resize-none`}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="editorial"
                  size="editorial"
                  disabled={submitting || checkingCapacity}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting & Generating Pass…
                    </>
                  ) : (
                    "Generate My Ticket"
                  )}
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground pt-1">
                Your ticket pass with your portrait and badge will be rendered instantly upon submission.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
