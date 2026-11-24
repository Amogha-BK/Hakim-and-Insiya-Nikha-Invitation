const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const rootDir = path.resolve(__dirname, "..");
const outputPath = path.join(rootDir, "Hakim_and_Insiya_Wedding_Invitation.pdf");

// A4 dimensions in points
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const doc = new PDFDocument({
  size: [PAGE_WIDTH, PAGE_HEIGHT],
  margins: { top: 0, bottom: 0, left: 0, right: 0 },
  bufferPages: true,
  info: {
    Title: "Hakim & Insiya - Wedding Invitation",
    Author: "Limdiwala Family",
    Subject: "Wedding Invitation & Programme",
    Keywords: "Wedding, Nikah, Hakim, Insiya, Pune",
  },
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Register Windows system fonts for typography matching the reference
const fonts = {
  serif: "C:/Windows/Fonts/georgia.ttf",
  serifBold: "C:/Windows/Fonts/georgiab.ttf",
  serifItalic: "C:/Windows/Fonts/georgiai.ttf",
  sans: "C:/Windows/Fonts/arial.ttf",
  sansBold: "C:/Windows/Fonts/arialbd.ttf",
};

doc.registerFont("Serif", fonts.serif);
doc.registerFont("Serif-Bold", fonts.serifBold);
doc.registerFont("Serif-Italic", fonts.serifItalic);
doc.registerFont("Sans", fonts.sans);
doc.registerFont("Sans-Bold", fonts.sansBold);

// Colors matching the reference
const COLORS = {
  wineBg: "#3d0c15",        // Page 1 deep burgundy
  creamBg: "#fbf8f3",       // Page 2 & 3 warm ivory parchment
  gold: "#c59b48",          // Regal metallic gold
  goldLight: "#e2c992",     // Soft light gold for inner border
  goldBright: "#f3d47b",    // Bright warm gold for text highlights
  goldMuted: "#8c6b2d",     // Deep antique gold for tracking labels
  maroon: "#4a0e17",        // Deep royal maroon heading color
  maroonDark: "#33080e",    // Dark maroon for text accents
  charcoal: "#262626",      // Primary body text
  charcoalMuted: "#4b5563", // Secondary muted text
  cardBg: "#f4ede1",        // Tinted venue box background
  ruleColor: "#d8be8d",     // Horizontal dividing rule
};

function drawDoubleBorder(isDarkPage = false) {
  const outerX = 22;
  const outerY = 22;
  const outerW = PAGE_WIDTH - 44;
  const outerH = PAGE_HEIGHT - 44;

  const innerX = 28;
  const innerY = 28;
  const innerW = PAGE_WIDTH - 56;
  const innerH = PAGE_HEIGHT - 56;

  const strokeOuter = isDarkPage ? COLORS.gold : COLORS.gold;
  const strokeInner = isDarkPage ? "#d4af3777" : COLORS.goldLight;

  doc.rect(outerX, outerY, outerW, outerH).lineWidth(1.5).strokeColor(strokeOuter).stroke();
  doc.rect(innerX, innerY, innerW, innerH).lineWidth(0.75).strokeColor(strokeInner).stroke();
}

function drawDiamond(cx, cy, size = 4.5, color = COLORS.gold) {
  doc.save();
  doc.fillColor(color);
  doc.moveTo(cx, cy - size)
     .lineTo(cx + size, cy)
     .lineTo(cx, cy + size)
     .lineTo(cx - size, cy)
     .closePath()
     .fill();
  doc.restore();
}

function drawDiamondWithRules(cx, cy, halfWidth = 70, color = COLORS.gold) {
  drawDiamond(cx, cy, 4, color);
  doc.rect(cx - halfWidth, cy - 0.35, halfWidth - 12, 0.7).fill(color);
  doc.rect(cx + 12, cy - 0.35, halfWidth - 12, 0.7).fill(color);
}

function drawBotanicalSprig(startX, startY, flipX = 1) {
  doc.save();
  doc.strokeColor(COLORS.goldBright).lineWidth(0.75).lineCap("round");

  // Main vine stem
  doc.moveTo(startX, startY)
     .bezierCurveTo(
       startX + 30 * flipX, startY - 45,
       startX + 15 * flipX, startY - 110,
       startX + 40 * flipX, startY - 175
     )
     .stroke();

  // Leaves & flower buds along the vine
  const leaves = [
    [startX + 14 * flipX, startY - 28, 16, -14],
    [startX + 24 * flipX, startY - 65, -15, -12],
    [startX + 17 * flipX, startY - 105, 18, -15],
    [startX + 28 * flipX, startY - 145, -16, -14],
  ];

  leaves.forEach(([lx, ly, dx, dy]) => {
    // Leaf branch
    doc.moveTo(lx, ly)
       .bezierCurveTo(lx + dx * 0.4 * flipX, ly + dy * 0.3, lx + dx * flipX, ly + dy * 0.7, lx + dx * flipX, ly + dy)
       .stroke();
    // Little flower / leaf petal loop
    doc.circle(lx + dx * flipX, ly + dy, 3).stroke();
  });

  doc.restore();
}

// ===========================================================================
// PAGE 1: COVER PAGE
// ===========================================================================
// Background fill
doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.wineBg);
drawDoubleBorder(true);

// Eyebrow label
doc.font("Sans-Bold")
   .fontSize(10)
   .fillColor(COLORS.goldBright)
   .text("SHUBH NIKAH", 45, 68, {
     width: PAGE_WIDTH - 90,
     align: "center",
     characterSpacing: 3.5,
   });

// Couple Names
doc.font("Serif-Bold")
   .fontSize(38)
   .fillColor("#ffffff")
   .text("Hakim & Insiya", 45, 96, {
     width: PAGE_WIDTH - 90,
     align: "center",
   });

// Diamond ornament
drawDiamondWithRules(PAGE_WIDTH / 2, 155, 60, COLORS.goldBright);

// Central Arched Portrait
const archW = 215;
const archH = 295;
const archX = (PAGE_WIDTH - archW) / 2;
const archY = 188;
const archRadius = archW / 2;

// Draw botanical side flourishes
drawBotanicalSprig(archX - 6, archY + archH - 20, -1);
drawBotanicalSprig(archX + archW + 6, archY + archH - 20, 1);

// Clip and embed couple illustration inside the arch
const coupleImgPath = path.join(rootDir, "public/assets/couple-illustration.png");
if (fs.existsSync(coupleImgPath)) {
  doc.save();
  // Create arch path: semicircle on top, rectangular body on bottom
  doc.moveTo(archX, archY + archRadius)
     .arc(archX + archRadius, archY + archRadius, archRadius, Math.PI, 0, false)
     .lineTo(archX + archW, archY + archH)
     .lineTo(archX, archY + archH)
     .closePath();
  doc.clip();

  // Background gradient inside the arch
  doc.rect(archX, archY, archW, archH).fill("#23050b");
  // Render couple portrait
  doc.image(coupleImgPath, archX + 7, archY + 12, { width: archW - 14 });
  doc.restore();

  // Stroke the arch border in brilliant gold
  doc.moveTo(archX, archY + archRadius)
     .arc(archX + archRadius, archY + archRadius, archRadius, Math.PI, 0, false)
     .lineTo(archX + archW, archY + archH)
     .lineTo(archX, archY + archH)
     .closePath()
     .lineWidth(1.5)
     .strokeColor(COLORS.goldBright)
     .stroke();
} else {
  // Fallback box if image missing
  doc.rect(archX, archY, archW, archH).lineWidth(1.5).strokeColor(COLORS.goldBright).stroke();
}

// Bottom Date & Location
const bottomStartY = 535;

doc.font("Sans-Bold")
   .fontSize(14.5)
   .fillColor("#ffffff")
   .text("Saturday, 23 January 2027", 45, bottomStartY, {
     width: PAGE_WIDTH - 90,
     align: "center",
   });

doc.font("Serif")
   .fontSize(13)
   .fillColor(COLORS.goldBright)
   .text("Pune, Maharashtra", 45, bottomStartY + 24, {
     width: PAGE_WIDTH - 90,
     align: "center",
   });

// Clickable online invitation link
const linkY = bottomStartY + 72;
const linkText = "View the online invitation";
const onlineUrl = "https://hakim-and-insiya-nikha-invitation.vercel.app";

doc.font("Sans")
   .fontSize(9.5)
   .fillColor(COLORS.goldBright)
   .text(linkText, 45, linkY, {
     width: PAGE_WIDTH - 90,
     align: "center",
     underline: true,
   });

// Register clickable PDF link
const textWidth = doc.widthOfString(linkText);
const linkX = (PAGE_WIDTH - textWidth) / 2;
doc.link(linkX, linkY, textWidth, 14, onlineUrl);


// ===========================================================================
// PAGE 2: THE WEDDING INVITATION (BLESSINGS & FAMILY)
// ===========================================================================
doc.addPage();
doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.creamBg);
drawDoubleBorder(false);

// Header Eyebrow
doc.font("Sans-Bold")
   .fontSize(9)
   .fillColor(COLORS.goldMuted)
   .text("WITH THE BLESSINGS OF OUR ELDERS", 55, 62, {
     width: PAGE_WIDTH - 110,
     align: "center",
     characterSpacing: 2.8,
   });

// Main Heading
doc.font("Serif")
   .fontSize(31)
   .fillColor(COLORS.maroon)
   .text("The Wedding Invitation", 55, 84, {
     width: PAGE_WIDTH - 110,
     align: "center",
   });

// Diamond ornament
drawDiamondWithRules(PAGE_WIDTH / 2, 134, 55, COLORS.gold);

let curY = 155;
const contentW = PAGE_WIDTH - 130;
const leftMargin = 65;

// Sacred Islamic Invocations (Styled Bohra Wedding Tradition)
doc.font("Serif-Bold")
   .fontSize(11)
   .fillColor(COLORS.charcoal)
   .text("|| Bismi-Allāhi ar-Rahmāni ar-Rahīm ||", leftMargin, curY, {
     width: contentW,
     align: "center",
   });
curY += 20;

doc.font("Serif-Italic")
   .fontSize(9.5)
   .fillColor(COLORS.charcoalMuted)
   .text(
     "By the grace of Allah & Vasilah-E-Panjatan Pak (A.S.), Maulana Abbas Alamdar (A.S.), Aimmat Tahereen (S.A.), Duatul Mutlaqeen (R.A.), & Vasilah of Ad-Dai al-Muqaddas Syedna Mohammed Burhanuddin (R.A.) & Dua Mubarak of Syedna va Maulana Aaliqadar Mufaddal Saifuddin (T.U.S.)",
     leftMargin,
     curY,
     {
       width: contentW,
       align: "center",
       lineGap: 3.5,
     }
   );
curY += 64;

// Heavenly Blessings of Grandparents
doc.font("Serif")
   .fontSize(10.5)
   .fillColor(COLORS.charcoal)
   .text("With the heavenly blessings of Late Femiben & Late Mulla Hakimuddin Limdiwala.", leftMargin, curY, {
     width: contentW,
     align: "center",
     lineGap: 4,
   });
curY += 38;

// Primary Invitation Request
doc.font("Serif")
   .fontSize(10.5)
   .fillColor(COLORS.charcoal)
   .text(
     "Mrs Alefiya & Mr Hatim Limdiwala request the pleasure of your company for the wedding celebrations of their beloved son",
     leftMargin,
     curY,
     {
       width: contentW,
       align: "center",
       lineGap: 4,
     }
   );
curY += 34;

// Couple Highlight
doc.font("Serif-Bold")
   .fontSize(16.5)
   .fillColor(COLORS.maroon)
   .text("Hakim", leftMargin, curY, {
     width: contentW,
     align: "center",
   });
curY += 21;

doc.font("Serif-Italic")
   .fontSize(10)
   .fillColor(COLORS.charcoalMuted)
   .text("with", leftMargin, curY, {
     width: contentW,
     align: "center",
   });
curY += 16;

doc.font("Serif-Bold")
   .fontSize(16.5)
   .fillColor(COLORS.maroon)
   .text("Insiya", leftMargin, curY, {
     width: contentW,
     align: "center",
   });
curY += 22;

doc.font("Serif")
   .fontSize(10)
   .fillColor(COLORS.charcoalMuted)
   .text(
     "(Daughter of Mrs Taheraben & Mr Khuzemabhai Bhanpurawala)\nfrom 22nd to 24th January 2027 in Pune.",
     leftMargin,
     curY,
     {
       width: contentW,
       align: "center",
       lineGap: 3.5,
     }
   );
curY += 46;

// Special Blessings & Sharing The Joy
doc.font("Sans-Bold")
   .fontSize(9.5)
   .fillColor(COLORS.maroon)
   .text("With Kind Blessings of: ", leftMargin, curY, { continued: true });
doc.font("Serif")
   .fontSize(9.5)
   .fillColor(COLORS.charcoal)
   .text("Sakinaben & Yahyabhai Kapadia.");
curY += 22;

doc.font("Sans-Bold")
   .fontSize(9.5)
   .fillColor(COLORS.maroon)
   .text("Sharing The Joy: ", leftMargin, curY, { continued: true });
doc.font("Serif")
   .fontSize(9.5)
   .fillColor(COLORS.charcoal)
   .text("Sakina & Husain Limdiwala, Sakina Abbas Shehrawala, Limdiwala & Kapadia Family.");
curY += 50;

// Sign-off
doc.font("Serif-Italic")
   .fontSize(11)
   .fillColor(COLORS.charcoalMuted)
   .text("With warm regards and love,", leftMargin, curY, {
     width: contentW,
     align: "center",
   });
curY += 22;

doc.font("Serif-Bold")
   .fontSize(22)
   .fillColor(COLORS.maroon)
   .text("Hakim & Insiya", leftMargin, curY, {
     width: contentW,
     align: "center",
   });


// ===========================================================================
// PAGE 3: WEDDING PROGRAMME (SCHEDULE OF EVENTS)
// ===========================================================================
doc.addPage();
doc.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT).fill(COLORS.creamBg);
drawDoubleBorder(false);

// Header Eyebrow
doc.font("Sans-Bold")
   .fontSize(9)
   .fillColor(COLORS.goldMuted)
   .text("22ND – 24TH JANUARY 2027", 55, 62, {
     width: PAGE_WIDTH - 110,
     align: "center",
     characterSpacing: 2.8,
   });

// Main Heading
doc.font("Serif")
   .fontSize(31)
   .fillColor(COLORS.maroon)
   .text("Wedding Programme", 55, 84, {
     width: PAGE_WIDTH - 110,
     align: "center",
   });

doc.font("Serif-Italic")
   .fontSize(10.5)
   .fillColor(COLORS.charcoalMuted)
   .text("All times are in IST", 55, 126, {
     width: PAGE_WIDTH - 110,
     align: "center",
   });

// Timeline Events List
let progY = 160;
const timeColX = 58;
const timeColW = 85;
const descColX = 152;
const descColW = PAGE_WIDTH - descColX - 58;

function drawEventRow(timeStr, title, subline, venueStr) {
  // Dividing horizontal rule
  doc.rect(timeColX, progY, PAGE_WIDTH - 116, 0.65).fill(COLORS.ruleColor);
  progY += 15;

  // Left Time Badge
  doc.font("Sans-Bold")
     .fontSize(11.5)
     .fillColor(COLORS.maroon)
     .text(timeStr, timeColX, progY);

  // Right Title & Details
  doc.font("Serif-Bold")
     .fontSize(15.5)
     .fillColor(COLORS.maroon)
     .text(title, descColX, progY);

  const startDescY = progY + 22;
  doc.font("Serif")
     .fontSize(9.5)
     .fillColor(COLORS.charcoal)
     .text(subline, descColX, startDescY, {
       width: descColW,
       lineGap: 3,
     });

  const nextY = doc.y + 4;
  doc.font("Serif-Italic")
     .fontSize(9)
     .fillColor(COLORS.charcoalMuted)
     .text(venueStr, descColX, nextY, {
       width: descColW,
       lineGap: 2.5,
     });

  progY = doc.y + 16;
}

// Event 1: Mehendi
drawEventRow(
  "10:00 AM",
  "Mehendi Ceremony — of Hakim",
  "Friday, 22 January 2027 · 15th Shabanul Karim, 1448 H\nMehendi gathering and festivities followed by lunch.",
  "iRiS Banquet, 6th Floor, Dorabjee’s Royale Heritage Mall, NIBM, Pune – 411060."
);

// Event 2: Nikah Majlis
drawEventRow(
  "06:30 PM",
  "Nikah Majlis",
  "Saturday, 23 January 2027 · 16th Shabanul Karim, 1448 H\nShitabi at 6:30 PM | Sacred Nikah Majlis at 7:30 PM followed by traditional dinner.",
  "Husainy Baug, 605, Sachapir St, near Trophy House, Camp, Pune – 411002."
);

// Event 3: Wedding Reception
drawEventRow(
  "06:30 PM",
  "Wedding Reception",
  "Sunday, 24 January 2027 · 17th Shabanul Karim, 1448 H\nProcession (Barat) at 6:30 PM IST | Royal Reception from 7:30 PM onwards.",
  "Jarande Lawns, Jarande Nagar, Mohammed Wadi, Pune – 411060."
);

// Bottom dividing rule
doc.rect(timeColX, progY, PAGE_WIDTH - 116, 0.65).fill(COLORS.ruleColor);
progY += 16;

// Featured Venue Card Box
const boxX = 58;
const boxW = PAGE_WIDTH - 116;
const boxH = 58;

doc.rect(boxX, progY, boxW, boxH).fill(COLORS.cardBg);
doc.rect(boxX, progY, boxW, boxH).stroke(COLORS.ruleColor);
doc.rect(boxX, progY, 3.5, boxH).fill(COLORS.gold);

doc.font("Serif-Bold")
   .fontSize(12.5)
   .fillColor(COLORS.maroon)
   .text("Primary Venues · Pune", boxX + 16, progY + 8);

doc.font("Serif")
   .fontSize(8.5)
   .fillColor(COLORS.charcoal)
   .text("Husainy Baug (Camp, Pune) & Jarande Lawns (Mohammed Wadi, Pune)", boxX + 16, progY + 25);

const mapsLinkText = "Open in Google Maps";
const mapsUrl = "https://maps.google.com/?q=Husainy+Baug+Pune";
doc.font("Sans-Bold")
   .fontSize(8.5)
   .fillColor(COLORS.maroon)
   .text(mapsLinkText, boxX + 16, progY + 41, {
     underline: true,
   });

const mapTextW = doc.widthOfString(mapsLinkText);
doc.link(boxX + 16, progY + 41, mapTextW, 11, mapsUrl);

progY += boxH + 18;

// Dress Code & Notes
doc.font("Sans-Bold")
   .fontSize(9)
   .fillColor(COLORS.maroon)
   .text("Dress code. ", 58, progY, { continued: true });
doc.font("Serif")
   .fontSize(9)
   .fillColor(COLORS.charcoal)
   .text("We warmly invite you to celebrate in your finest traditional attire — Libas-ul-Anwar.", {
     width: PAGE_WIDTH - 116,
   });
progY = doc.y + 7;

doc.font("Sans-Bold")
   .fontSize(9)
   .fillColor(COLORS.maroon)
   .text("Residence & contact. ", 58, progY, { continued: true });
doc.font("Serif")
   .fontSize(9)
   .fillColor(COLORS.charcoal)
   .text("Limdiwala Family, Pune. Contact: Mrs Alefiya & Mr Hatim Limdiwala", {
     width: PAGE_WIDTH - 116,
   });
progY = doc.y + 16;

doc.font("Serif-Italic")
   .fontSize(11)
   .fillColor(COLORS.maroon)
   .text("Only duas and blessings.", 58, progY, {
     width: PAGE_WIDTH - 116,
     align: "center",
   });

doc.end();

writeStream.on("finish", () => {
  console.log(`Generated exactly 3 pages at: ${outputPath}`);
});
