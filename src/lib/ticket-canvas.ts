import { generateQRCodeMatrix } from "./qr";

export interface VipTicketData {
  id: string;
  serial: string;
  email: string;
  name: string;
  tier: string;
  seat?: string;
  organization?: string;
  issuedDate?: string;
  eventDate?: string;
  eventTime?: string;
  venue?: string;
  notes?: string;
}

export type TicketOrientation = "horizontal" | "vertical";

// Helper: draw rounded rectangle
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Helper: draw simulated Code128 barcode
function drawBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  text: string,
  color = "#ffffff"
) {
  ctx.save();
  ctx.fillStyle = color;
  const hash = Array.from(text).reduce(
    (acc, char) => (acc * 31 + char.charCodeAt(0)) % 1000000007,
    7
  );
  const bars = 48;
  const barWidth = width / bars;
  for (let i = 0; i < bars; i++) {
    // pseudo-random deterministic bar thickness
    const bit = ((hash * (i + 13)) ^ (i * 73)) % 100;
    if (bit > 30) {
      const thickness = (bit % 3) + 1;
      ctx.fillRect(x + i * barWidth, y, Math.min(barWidth * thickness * 0.7, barWidth), height);
    }
  }
  ctx.restore();
}

// Helper: draw QR Code on canvas
function drawQRCode(
  ctx: CanvasRenderingContext2D,
  matrix: boolean[][],
  x: number,
  y: number,
  size: number,
  fgColor = "#000000",
  bgColor = "#ffffff"
) {
  const n = matrix.length;
  const cellSize = size / n;

  ctx.save();
  // Background
  ctx.fillStyle = bgColor;
  roundRect(ctx, x - 6, y - 6, size + 12, size + 12, 10);
  ctx.fill();

  // Matrix modules
  ctx.fillStyle = fgColor;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (matrix[r][c]) {
        ctx.fillRect(
          Math.floor(x + c * cellSize),
          Math.floor(y + r * cellSize),
          Math.ceil(cellSize),
          Math.ceil(cellSize)
        );
      }
    }
  }
  ctx.restore();
}

// Helper: draw faux hologram badge
function drawHologramBadge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
) {
  ctx.save();
  const holoGrad = ctx.createLinearGradient(
    x - radius,
    y - radius,
    x + radius,
    y + radius
  );
  holoGrad.addColorStop(0, "rgba(255, 215, 0, 0.85)");
  holoGrad.addColorStop(0.25, "rgba(255, 75, 75, 0.75)");
  holoGrad.addColorStop(0.5, "rgba(0, 225, 255, 0.7)");
  holoGrad.addColorStop(0.75, "rgba(220, 120, 255, 0.75)");
  holoGrad.addColorStop(1, "rgba(255, 215, 0, 0.85)");

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = holoGrad;
  ctx.fill();

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();

  // Inner ring
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.75, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 9px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("VIP 2026", x, y);
  ctx.restore();
}

/**
 * Render Executive Horizontal VIP Pass
 * Resolution: 2400 x 1080 (Super crisp 2x retina)
 */
export function renderHorizontalTicket(
  canvas: HTMLCanvasElement,
  data: VipTicketData
) {
  const width = 2400;
  const height = 1080;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  // 1. Rich Obsidian Canvas Background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, "#08080a");
  bgGrad.addColorStop(0.4, "#111217");
  bgGrad.addColorStop(0.8, "#181920");
  bgGrad.addColorStop(1, "#0a0a0d");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Subtle ambient red & gold glow
  const redGlow = ctx.createRadialGradient(200, 200, 50, 400, 400, 800);
  redGlow.addColorStop(0, "rgba(230, 46, 45, 0.18)");
  redGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = redGlow;
  ctx.fillRect(0, 0, width, height);

  const goldGlow = ctx.createRadialGradient(width - 400, height - 300, 50, width - 400, height - 300, 700);
  goldGlow.addColorStop(0, "rgba(212, 175, 55, 0.12)");
  goldGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = goldGlow;
  ctx.fillRect(0, 0, width, height);

  // 2. High-security guilloche-like geometric micro-grid
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
  ctx.lineWidth = 1;
  const step = 40;
  for (let x = 0; x < width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Luxurious outer card border
  const margin = 40;
  const cardW = width - margin * 2;
  const cardH = height - margin * 2;
  const cornerR = 28;

  ctx.save();
  roundRect(ctx, margin, margin, cardW, cardH, cornerR);
  ctx.lineWidth = 4;
  const borderGrad = ctx.createLinearGradient(margin, margin, width - margin, height - margin);
  borderGrad.addColorStop(0, "rgba(212, 175, 55, 0.9)"); // Gold
  borderGrad.addColorStop(0.3, "rgba(230, 46, 45, 0.8)"); // TEDx Red
  borderGrad.addColorStop(0.7, "rgba(255, 255, 255, 0.3)");
  borderGrad.addColorStop(1, "rgba(212, 175, 55, 0.9)");
  ctx.strokeStyle = borderGrad;
  ctx.stroke();

  // Inner fine gold accent hairline
  roundRect(ctx, margin + 8, margin + 8, cardW - 16, cardH - 16, cornerR - 6);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(212, 175, 55, 0.35)";
  ctx.stroke();
  ctx.restore();

  // 4. Perforated division line and cutout notches
  const stubX = width - 640;
  ctx.save();
  // Perforated line
  ctx.beginPath();
  ctx.setLineDash([16, 16]);
  ctx.moveTo(stubX, margin + 30);
  ctx.lineTo(stubX, height - margin - 30);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(212, 175, 55, 0.35)";
  ctx.stroke();

  // Top & bottom ticket notch cutouts
  ctx.setLineDash([]);
  ctx.fillStyle = "#030304";
  ctx.beginPath();
  ctx.arc(stubX, margin, 32, 0, Math.PI);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(212, 175, 55, 0.6)";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(stubX, height - margin, 32, Math.PI, 0);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 5. LEFT SECTION: BRANDING & EVENT
  const leftX = margin + 70;

  // TEDx Logo
  ctx.save();
  ctx.font = "900 68px 'Bricolage Grotesque', 'Arial Black', sans-serif";
  ctx.fillStyle = "#E62E2D";
  ctx.fillText("TEDx", leftX, margin + 110);
  const tedW = ctx.measureText("TEDx").width;

  ctx.font = "800 68px 'Bricolage Grotesque', 'Arial Black', sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Lafia", leftX + tedW + 6, margin + 110);
  const brandW = tedW + ctx.measureText("Lafia").width + 10;

  // Subtitle
  ctx.font = "600 20px 'Manrope', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.fillText("x = independently organized TED event", leftX, margin + 148);

  // VIP Official Pill
  const pillX = leftX + brandW + 40;
  const pillY = margin + 65;
  const pillW = 440;
  const pillH = 54;
  roundRect(ctx, pillX, pillY, pillW, pillH, 27);
  const pillGrad = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY);
  pillGrad.addColorStop(0, "rgba(212, 175, 55, 0.2)");
  pillGrad.addColorStop(0.5, "rgba(230, 46, 45, 0.25)");
  pillGrad.addColorStop(1, "rgba(212, 175, 55, 0.2)");
  ctx.fillStyle = pillGrad;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(212, 175, 55, 0.85)";
  ctx.stroke();

  ctx.font = "bold 22px 'Manrope', sans-serif";
  ctx.fillStyle = "#FFE259";
  ctx.textAlign = "center";
  ctx.fillText("★ OFFICIAL VIP DELEGATE PASS ★", pillX + pillW / 2, pillY + 34);
  ctx.restore();

  // Event Theme Heading
  ctx.save();
  ctx.font = "300 32px 'Manrope', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.fillText("ANNUAL CONFERENCE 2026 • THEME", leftX, margin + 230);

  ctx.font = "800 78px 'Bricolage Grotesque', sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("THE TIPPING POINT", leftX, margin + 310);
  ctx.restore();

  // 6. VIP ATTENDEE CREDENTIALS BOX
  const credBoxY = margin + 360;
  const credBoxW = stubX - leftX - 60;
  const credBoxH = 340;

  ctx.save();
  roundRect(ctx, leftX, credBoxY, credBoxW, credBoxH, 20);
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
  ctx.stroke();

  // Inner Attendee Label
  ctx.font = "bold 18px 'Manrope', sans-serif";
  ctx.fillStyle = "#D4AF37";
  ctx.fillText("VIP DELEGATE CREDENTIALS", leftX + 36, credBoxY + 45);

  // Attendee Full Name
  ctx.font = "800 58px 'Bricolage Grotesque', sans-serif";
  const nameGrad = ctx.createLinearGradient(leftX + 36, 0, leftX + 800, 0);
  nameGrad.addColorStop(0, "#FFFFFF");
  nameGrad.addColorStop(0.7, "#FFF4D2");
  nameGrad.addColorStop(1, "#E6C687");
  ctx.fillStyle = nameGrad;
  const displayName = data.name ? data.name.toUpperCase() : "DISTINGUISHED VIP GUEST";
  ctx.fillText(displayName, leftX + 36, credBoxY + 115);

  // Email address
  ctx.font = "500 26px 'Manrope', monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.fillText(data.email || "vip@tedxlafia.com", leftX + 36, credBoxY + 160);

  // Tier Badge & Pass Serial
  const tierPillY = credBoxY + 195;
  roundRect(ctx, leftX + 36, tierPillY, 440, 52, 12);
  ctx.fillStyle = "rgba(212, 175, 55, 0.2)";
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "#D4AF37";
  ctx.stroke();

  ctx.font = "bold 22px 'Manrope', sans-serif";
  ctx.fillStyle = "#FFD700";
  ctx.fillText(`★ ${data.tier || "VVIP GUEST OF HONOUR"}`, leftX + 54, tierPillY + 34);

  // Pass Serial Pill
  roundRect(ctx, leftX + 496, tierPillY, 320, 52, 12);
  ctx.fillStyle = "rgba(230, 46, 45, 0.15)";
  ctx.fill();
  ctx.strokeStyle = "rgba(230, 46, 45, 0.6)";
  ctx.stroke();

  ctx.font = "bold 20px monospace";
  ctx.fillStyle = "#FFC2C0";
  ctx.fillText(`PASS ID: ${data.serial || "TX-VIP-2026-0001"}`, leftX + 520, tierPillY + 34);

  // VIP Privileges bar
  ctx.font = "600 19px 'Manrope', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.fillText(
    "PRIVILEGES:  Priority Reserved Front Seating  •  Backstage Lounge  •  Speakers Banquet  •  Executive Gift Kit",
    leftX + 36,
    credBoxY + 300
  );
  ctx.restore();

  // 7. EVENT LOGISTICS FOOTER (Date & Venue)
  const footY = margin + 740;
  ctx.save();
  ctx.font = "600 24px 'Manrope', sans-serif";
  ctx.fillStyle = "#E62E2D";
  ctx.fillText("DATE & TIME", leftX, footY + 28);
  ctx.font = "700 32px 'Manrope', sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(data.eventDate || "Saturday, November 7, 2026", leftX, footY + 68);
  ctx.font = "500 24px 'Manrope', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.fillText(data.eventTime || "08:30 AM WAT (Doors open 08:00 AM Prompt)", leftX, footY + 102);

  const venueX = leftX + 540;
  ctx.font = "600 24px 'Manrope', sans-serif";
  ctx.fillStyle = "#E62E2D";
  ctx.fillText("EXCLUSIVE VENUE", venueX, footY + 28);
  ctx.font = "700 32px 'Manrope', sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("NASIDA Investment Centre", venueX, footY + 68);
  ctx.font = "500 24px 'Manrope', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.fillText(data.venue || "Muhammadu Buhari Way, Lafia, Nasarawa State", venueX, footY + 102);
  ctx.restore();

  // Security Seal & Watermark bottom left
  ctx.save();
  ctx.font = "italic 16px 'Manrope', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fillText("AUTHORIZED TEDxLAFIA 2026 EXECUTIVE CREDENTIAL • PRESENT UPON ARRIVAL", leftX, height - margin - 35);
  ctx.restore();

  // 8. RIGHT SECTION: STUB & VERIFICATION
  const stubContentX = stubX + 60;
  const stubW = width - margin - stubX - 100;

  // Header of Stub
  ctx.save();
  ctx.font = "900 36px 'Bricolage Grotesque', sans-serif";
  ctx.fillStyle = "#E62E2D";
  ctx.fillText("TEDx", stubContentX, margin + 95);
  const sTedW = ctx.measureText("TEDx").width;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Lafia", stubContentX + sTedW + 4, margin + 95);

  ctx.font = "bold 18px 'Manrope', sans-serif";
  ctx.fillStyle = "#D4AF37";
  ctx.fillText("VIP ACCESS STUB", stubContentX, margin + 130);

  // Faux Hologram Badge top right of stub
  drawHologramBadge(ctx, width - margin - 100, margin + 110, 42);

  // Scannable QR Code
  const qrSize = 340;
  const qrX = stubContentX + (stubW - qrSize) / 2;
  const qrY = margin + 175;
  const qrPayload = `https://tedxlafia.com/verify?serial=${encodeURIComponent(data.serial)}&email=${encodeURIComponent(data.email)}&tier=${encodeURIComponent(data.tier)}`;
  const matrix = generateQRCodeMatrix(qrPayload);
  drawQRCode(ctx, matrix, qrX, qrY, qrSize, "#0d0e12", "#ffffff");

  // QR Label
  ctx.font = "bold 18px 'Manrope', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.textAlign = "center";
  ctx.fillText("FAST-TRACK VIP SCAN", stubX + (width - margin - stubX) / 2, qrY + qrSize + 32);

  // Attendee summary on stub
  ctx.font = "bold 24px 'Bricolage Grotesque', sans-serif";
  ctx.fillStyle = "#FFE259";
  ctx.fillText(data.name || "VIP GUEST", stubX + (width - margin - stubX) / 2, qrY + qrSize + 70);

  ctx.font = "bold 20px 'Manrope', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.fillText("VIP ALL-ACCESS", stubX + (width - margin - stubX) / 2, qrY + qrSize + 102);

  // Barcode
  const barcodeY = height - margin - 170;
  const barcodeW = stubW + 40;
  const barcodeX = stubContentX - 20;
  drawBarcode(ctx, barcodeX, barcodeY, barcodeW, 60, data.serial, "#ffffff");

  // Barcode Serial text
  ctx.font = "bold 20px monospace";
  ctx.fillStyle = "#D4AF37";
  ctx.textAlign = "center";
  ctx.fillText(`* ${data.serial} *`, stubX + (width - margin - stubX) / 2, barcodeY + 90);

  ctx.font = "14px 'Manrope', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.fillText("NON-TRANSFERABLE • VALID WITH PHOTO ID", stubX + (width - margin - stubX) / 2, barcodeY + 116);
  ctx.restore();
}

/**
 * Render Vertical VIP Lanyard Badge
 * Resolution: 1400 x 2100 (Crisp 2x portrait lanyard pass)
 */
export function renderVerticalBadge(
  canvas: HTMLCanvasElement,
  data: VipTicketData
) {
  const width = 1400;
  const height = 2100;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);

  // 1. Dark executive carbon background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, "#08080a");
  bgGrad.addColorStop(0.3, "#121319");
  bgGrad.addColorStop(0.7, "#171822");
  bgGrad.addColorStop(1, "#07080a");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Top Red Spotlight glow
  const topGlow = ctx.createRadialGradient(width / 2, 250, 40, width / 2, 250, 700);
  topGlow.addColorStop(0, "rgba(230, 46, 45, 0.25)");
  topGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = topGlow;
  ctx.fillRect(0, 0, width, height);

  // Bottom Gold glow
  const botGlow = ctx.createRadialGradient(width / 2, height - 200, 40, width / 2, height - 200, 600);
  botGlow.addColorStop(0, "rgba(212, 175, 55, 0.18)");
  botGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = botGlow;
  ctx.fillRect(0, 0, width, height);

  // 2. Micro-grid lines
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Luxurious outer frame
  const margin = 40;
  const cardW = width - margin * 2;
  const cardH = height - margin * 2;
  const cornerR = 36;

  ctx.save();
  roundRect(ctx, margin, margin, cardW, cardH, cornerR);
  ctx.lineWidth = 4;
  const borderGrad = ctx.createLinearGradient(margin, margin, width - margin, height - margin);
  borderGrad.addColorStop(0, "rgba(212, 175, 55, 0.9)");
  borderGrad.addColorStop(0.5, "rgba(230, 46, 45, 0.8)");
  borderGrad.addColorStop(1, "rgba(212, 175, 55, 0.9)");
  ctx.strokeStyle = borderGrad;
  ctx.stroke();

  roundRect(ctx, margin + 8, margin + 8, cardW - 16, cardH - 16, cornerR - 6);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
  ctx.stroke();
  ctx.restore();

  // 4. Lanyard Slot Hole at Top
  ctx.save();
  const slotW = 180;
  const slotH = 26;
  const slotY = margin + 35;
  const slotX = (width - slotW) / 2;
  roundRect(ctx, slotX, slotY, slotW, slotH, slotH / 2);
  ctx.fillStyle = "#020203";
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "rgba(212, 175, 55, 0.7)";
  ctx.stroke();
  ctx.restore();

  // 5. Official Branding
  ctx.save();
  const brandY = slotY + 110;
  ctx.textAlign = "center";
  ctx.font = "900 84px 'Bricolage Grotesque', sans-serif";
  ctx.fillStyle = "#E62E2D";
  ctx.fillText("TEDx", width / 2 - 110, brandY);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("Lafia", width / 2 + 100, brandY);

  ctx.font = "600 22px 'Manrope', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.fillText("x = independently organized TED event", width / 2, brandY + 44);

  // Hologram seal at top right
  drawHologramBadge(ctx, width - margin - 120, brandY - 20, 50);
  ctx.restore();

  // 6. VIP Massive Gold Ribbon
  const ribY = brandY + 80;
  const ribH = 90;
  ctx.save();
  const ribGrad = ctx.createLinearGradient(margin + 20, ribY, width - margin - 20, ribY);
  ribGrad.addColorStop(0, "rgba(212, 175, 55, 0.15)");
  ribGrad.addColorStop(0.3, "rgba(212, 175, 55, 0.95)");
  ribGrad.addColorStop(0.5, "rgba(255, 240, 160, 1)");
  ribGrad.addColorStop(0.7, "rgba(212, 175, 55, 0.95)");
  ribGrad.addColorStop(1, "rgba(212, 175, 55, 0.15)");

  ctx.fillStyle = ribGrad;
  ctx.fillRect(margin + 20, ribY, cardW - 40, ribH);

  ctx.textAlign = "center";
  ctx.font = "900 48px 'Bricolage Grotesque', sans-serif";
  ctx.fillStyle = "#09090b";
  ctx.fillText("★ VIP ALL-ACCESS DELEGATE ★", width / 2, ribY + 62);
  ctx.restore();

  // 7. Attendee Credentials Area
  ctx.save();
  ctx.textAlign = "center";

  // Tier Title
  const tierY = ribY + 170;
  ctx.font = "bold 28px 'Manrope', sans-serif";
  ctx.fillStyle = "#D4AF37";
  ctx.fillText(data.tier ? data.tier.toUpperCase() : "VVIP GUEST OF HONOUR", width / 2, tierY);

  // Big Attendee Name
  const nameY = tierY + 85;
  ctx.font = "900 68px 'Bricolage Grotesque', sans-serif";
  const nameGrad = ctx.createLinearGradient(margin + 100, 0, width - margin - 100, 0);
  nameGrad.addColorStop(0, "#FFFFFF");
  nameGrad.addColorStop(0.5, "#FFF6E0");
  nameGrad.addColorStop(1, "#FFFFFF");
  ctx.fillStyle = nameGrad;
  ctx.fillText(data.name || "VIP DELEGATE", width / 2, nameY);

  // Email
  ctx.font = "500 30px 'Manrope', monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.fillText(data.email || "vip@tedxlafia.com", width / 2, nameY + 54);

  // Pass ID Pill
  const idPillY = nameY + 95;
  const idPillW = 540;
  const idPillH = 64;
  const idPillX = (width - idPillW) / 2;
  roundRect(ctx, idPillX, idPillY, idPillW, idPillH, 18);
  ctx.fillStyle = "rgba(212, 175, 55, 0.15)";
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(212, 175, 55, 0.6)";
  ctx.stroke();

  ctx.font = "bold 26px monospace";
  ctx.fillStyle = "#FFD700";
  ctx.fillText(`PASS ID: ${data.serial || "TX-VIP-2026-0001"}`, width / 2, idPillY + 42);
  ctx.restore();

  // 8. Event Theme Section
  const themeY = idPillY + 125;
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "600 24px 'Manrope', sans-serif";
  ctx.fillStyle = "#E62E2D";
  ctx.fillText("TEDxLAFIA 2026 THEME", width / 2, themeY);

  ctx.font = "800 52px 'Bricolage Grotesque', sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("THE TIPPING POINT", width / 2, themeY + 56);

  ctx.font = "500 26px 'Manrope', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  ctx.fillText("Saturday, November 7, 2026 • 08:30 AM", width / 2, themeY + 104);
  ctx.fillText("NASIDA Investment Centre, Lafia", width / 2, themeY + 140);
  ctx.restore();

  // 9. QR Code & Fast-Track Section
  const qrSize = 360;
  const qrX = (width - qrSize) / 2;
  const qrY = themeY + 190;
  const qrPayload = `https://tedxlafia.com/verify?serial=${encodeURIComponent(data.serial)}&email=${encodeURIComponent(data.email)}&tier=${encodeURIComponent(data.tier)}`;
  const matrix = generateQRCodeMatrix(qrPayload);
  drawQRCode(ctx, matrix, qrX, qrY, qrSize, "#0d0e12", "#ffffff");

  // Serial & Barcode
  const bY = qrY + qrSize + 40;
  drawBarcode(ctx, (width - 600) / 2, bY, 600, 60, data.serial, "#ffffff");

  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "bold 24px monospace";
  ctx.fillStyle = "#D4AF37";
  ctx.fillText(`* ${data.serial} *`, width / 2, bY + 95);

  ctx.font = "600 20px 'Manrope', sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.fillText("SCAN AT VIP FAST-TRACK ENTRANCE • NON-TRANSFERABLE", width / 2, height - margin - 35);
  ctx.restore();
}

/**
 * Trigger immediate browser download of the ticket as high-resolution PNG
 */
export async function downloadTicketImage(
  data: VipTicketData,
  orientation: TicketOrientation = "horizontal"
) {
  const canvas = document.createElement("canvas");
  if (orientation === "horizontal") {
    renderHorizontalTicket(canvas, data);
  } else {
    renderVerticalBadge(canvas, data);
  }

  return new Promise<void>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create image blob"));
          return;
        }
        const url = URL.createObjectURL(blob);
        const safeName = (data.name || "VIP")
          .replace(/[^a-zA-Z0-9_-]/g, "_")
          .substring(0, 30);
        const fileName = `TEDxLafia-VIP-${safeName}-${data.serial}-${orientation}.png`;

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      },
      "image/png",
      1.0
    );
  });
}

