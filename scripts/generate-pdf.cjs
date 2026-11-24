const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const rootDir = path.resolve(__dirname, "..");
const outputPath = path.join(rootDir, "Hakim_and_Insiya_Nikah_Invitation_Project_Report.pdf");

// Create PDF document
const doc = new PDFDocument({
  size: "A4",
  margins: { top: 45, bottom: 45, left: 45, right: 45 },
  bufferPages: true,
  info: {
    Title: "Hakim & Insiya Nikah Invitation - Project Documentation & Source Code",
    Author: "Amogha B K",
    Subject: "Wedding Invitation Web Application Documentation",
    Keywords: "Wedding, React, Vite, Tailwind CSS, TypeScript, Nikah, Pune",
  },
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

const PAGE_WIDTH = doc.page.width;
const PAGE_HEIGHT = doc.page.height;
const CONTENT_WIDTH = PAGE_WIDTH - 90;

// Color Palette
const COLORS = {
  navy: "#0a1128",
  gold: "#b89039",
  goldLight: "#f4ecd8",
  goldDark: "#856404",
  maroon: "#460c14",
  text: "#222222",
  textMuted: "#555555",
  codeBg: "#f8f9fa",
  codeBorder: "#e2e8f0",
  tableHeader: "#0a1128",
  tableRowAlt: "#f9fafb",
  border: "#cbd5e1",
  success: "#15803d",
  warning: "#b45309",
};

// Helper Functions
function drawHeader(title) {
  doc.save();
  doc.rect(45, 20, CONTENT_WIDTH, 1.5).fill(COLORS.gold);
  doc.fontSize(8).fillColor(COLORS.goldDark).text(title.toUpperCase(), 45, 10, {
    width: CONTENT_WIDTH,
    align: "left",
  });
  doc.restore();
}

function addSectionTitle(title, subtitle) {
  if (doc.y > PAGE_HEIGHT - 120) {
    doc.addPage();
  }
  doc.moveDown(0.8);
  doc.save();
  doc.rect(45, doc.y, 4, 22).fill(COLORS.gold);
  doc.fontSize(16).fillColor(COLORS.navy).text(`   ${title}`, 45, doc.y + 2);
  doc.restore();

  if (subtitle) {
    doc.fontSize(9.5).fillColor(COLORS.textMuted).text(subtitle, 45, doc.y + 4);
  }
  doc.moveDown(0.6);
}

function addSubTitle(title) {
  if (doc.y > PAGE_HEIGHT - 90) {
    doc.addPage();
  }
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor(COLORS.maroon).text(title, 45, doc.y);
  doc.moveDown(0.3);
}

function addParagraph(text) {
  doc.fontSize(9.5).fillColor(COLORS.text).text(text, {
    width: CONTENT_WIDTH,
    lineGap: 3,
  });
  doc.moveDown(0.4);
}

// ---------------------------------------------------------------------------
// COVER PAGE
// ---------------------------------------------------------------------------
doc.rect(0, 0, PAGE_WIDTH, 200).fill(COLORS.navy);
doc.rect(0, 195, PAGE_WIDTH, 6).fill(COLORS.gold);

doc.fontSize(11).fillColor(COLORS.gold).text("ROYAL MIDNIGHT JALI THEME · WEDDING WEB APPLICATION", 45, 55, {
  letterSpacing: 1.5,
  align: "center",
  width: CONTENT_WIDTH,
});

doc.fontSize(28).fillColor("#ffffff").text("Hakim & Insiya", 45, 80, {
  align: "center",
  width: CONTENT_WIDTH,
});

doc.fontSize(14).fillColor(COLORS.goldLight).text("Sacred Nikah & Wedding Reception Invitation", 45, 120, {
  align: "center",
  width: CONTENT_WIDTH,
});

doc.fontSize(10).fillColor("#cbd5e1").text("22nd – 24th January 2027 · Pune, Maharashtra", 45, 145, {
  align: "center",
  width: CONTENT_WIDTH,
});

doc.y = 230;

doc.rect(45, doc.y, CONTENT_WIDTH, 120).fillAndStroke("#faf8f5", COLORS.gold);
const cardTop = doc.y + 15;
doc.fontSize(13).fillColor(COLORS.maroon).text("Project & Source Code Documentation", 60, cardTop);
doc.fontSize(9).fillColor(COLORS.text).text("Document Type: Complete Project Specification, Requirements & Source Code Export", 60, cardTop + 22);
doc.fontSize(9).text("Target Framework: React 19, TypeScript 5.7, Vite 8, Tailwind CSS v4, Motion", 60, cardTop + 37);
doc.fontSize(9).text("Hosting / CDN: Vercel Production Environment", 60, cardTop + 52);
doc.fontSize(9).text("Repository: Hakim-and-Insiya-Nikha-Invitation (main branch)", 60, cardTop + 67);
doc.fontSize(9).text(`Export Timestamp: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 60, cardTop + 82);

doc.y = 380;
doc.fontSize(14).fillColor(COLORS.navy).text("Table of Contents", 45, doc.y);
doc.rect(45, doc.y + 18, CONTENT_WIDTH, 1).fill(COLORS.gold);
doc.y += 26;

const tocItems = [
  ["1. Executive Summary & Application Overview", "Overview of design, user interaction flow, and features"],
  ["2. Required vs Optional Project Files Matrix", "Detailed checklist of files required to run, build, and deploy the application"],
  ["3. Wedding Invitation Details & Content Spec", "Full transcription of couple names, Islamic invocation, timings, and venues"],
  ["4. Core Configuration & Content Code", "src/invitationConfig.ts, schema.ts, entranceMedia.ts"],
  ["5. Main UI & Interactive Components Code", "src/App.tsx, InvitationOpening.tsx, ScratchCard.tsx"],
  ["6. Supporting Components & Utilities Code", "CouplePortrait.tsx, SparkleField.tsx, countdown.ts"],
  ["7. Build & Styling Configuration", "package.json, vite.config.ts, tsconfig.json, index.html"],
];

tocItems.forEach(([item, desc]) => {
  doc.fontSize(10).fillColor(COLORS.maroon).text(item, 50, doc.y, { continued: false });
  doc.fontSize(8.5).fillColor(COLORS.textMuted).text(`    ${desc}`, 50, doc.y + 2);
  doc.moveDown(0.35);
});

// ---------------------------------------------------------------------------
// SECTION 1: EXECUTIVE SUMMARY
// ---------------------------------------------------------------------------
doc.addPage();
addSectionTitle("1. Executive Summary & Application Overview", "Comprehensive architectural summary of the wedding invitation project");

addParagraph(
  "This project is a bespoke, luxury mobile-first digital wedding invitation engineered for Hakim and Insiya's sacred Nikah and Wedding celebrations in Pune (January 2027). The application is themed around a royal 'Midnight Jali' aesthetic featuring deep navy backgrounds (#081225 / #050b18), regal gold filigree (#d4af37 / #f3e5ab), and rich maroon accent badges (#460c14)."
);

addSubTitle("Key Functional Capabilities");

const features = [
  ["Interactive Envelope Opening", "A seamless video-to-scroll entrance animation featuring the custom wax seal with couple monogram ('H & I') that unfolds into the full invitation card."],
  ["Ambient Islamic/Wedding Music Player", "Background audio control with floating playback/mute toggles, user-interaction auto-start, and seamless loop playback."],
  ["Bismillah & Islamic Invocations", "Bismillah calligraphy and sacred Fatemi Dawat Dua Mubarak text honoring the spiritual traditions of the families."],
  ["Royal Keepsake Scratch Card", "An HTML5 Canvas interactive scratch-to-reveal card where guests scratch to reveal function dates or tap 'Reveal Dates'."],
  ["Real-Time Indian Standard Time Countdown", "Live ticker calculating days, hours, minutes, and seconds until the Nikah on 23 January 2027 in Asia/Kolkata timezone."],
  ["Three Multi-Day Celebration Cards", "Cards for Mehendi (22 Jan, iRiS Banquet), Nikah Majlis (23 Jan, Husainy Baug), and Wedding Reception (24 Jan, Jarande Lawns) with Google Maps directions, Add-to-Calendar, and QR codes."],
  ["Special Procession Highlighting", "Wedding Reception card distinctly highlights '7:30 pm onwards IST' in the maroon badge with 'Procession at 6:30 pm IST' prominently styled in bold black font directly below."],
  ["Closing Memorial & Family Blessings", "Tributes to Late Femiben & Late Mulla Hakimuddin Limdiwala, blessings from grandparents and extended Limdiwala and Kapadia families."],
];

features.forEach(([title, desc]) => {
  doc.fontSize(9.5).fillColor(COLORS.navy).text(`• ${title}: `, 55, doc.y, { continued: true });
  doc.fontSize(9).fillColor(COLORS.text).text(desc);
  doc.moveDown(0.2);
});

// ---------------------------------------------------------------------------
// SECTION 2: REQUIRED VS OPTIONAL FILES MATRIX
// ---------------------------------------------------------------------------
doc.addPage();
addSectionTitle("2. Required vs Optional Project Files Matrix", "Precise inventory of all files required to run, build, and deploy this project");

addParagraph(
  "The table below categorizes every file in the project into strictly required, required for media, or optional development aids. If you are sharing, backing up, or deploying the project, ensure all 'Strictly Required' and 'Required Asset' files are included."
);

const filesTable = [
  // Core App
  ["src/main.tsx", "Core", "Strictly Required", "React entrypoint mounting App to #root with index.css"],
  ["src/App.tsx", "Core", "Strictly Required", "Main application UI layout, navigation, audio controls & celebration cards"],
  ["src/index.css", "Core", "Strictly Required", "Tailwind CSS v4 base, royal midnight jali styles, print & animations"],
  ["index.html", "Core", "Strictly Required", "Vite HTML shell with metadata, OpenGraph tags, fonts & #root"],
  ["package.json", "Build", "Strictly Required", "Declares React 19, Motion, Lucide, Tailwind v4, Vite & scripts"],
  ["vite.config.ts", "Build", "Strictly Required", "Vite config with @tailwindcss/vite, React plugin & '@' path alias"],
  ["tsconfig.json", "Build", "Strictly Required", "TypeScript strict compiler options and DOM types"],
  // Content & Config
  ["src/invitationConfig.ts", "Content", "Strictly Required", "Master wedding record: couple details, invocation, timings, venues"],
  ["src/invitation/schema.ts", "Content", "Strictly Required", "Data schema, validation logic, timezone handling, template adapters"],
  ["src/invitation/InvitationContext.tsx", "Content", "Strictly Required", "React context provider making wedding config available to all components"],
  ["src/invitation/defaultRecord.ts", "Content", "Strictly Required", "Re-exports invitationConfig as customerRecord"],
  ["src/invitation/entranceMedia.ts", "Content", "Strictly Required", "Asset path mappings for envelope video and courtyard posters"],
  // Interactive UI
  ["src/InvitationOpening.tsx", "UI", "Strictly Required", "Interactive animated envelope opening with video/poster fallbacks"],
  ["src/ScratchCard.tsx", "UI", "Strictly Required", "HTML5 canvas scratch-off card revealing wedding dates"],
  ["src/CouplePortrait.tsx", "UI", "Strictly Required", "Royal couple illustration & botanical Islamic flourish"],
  ["src/SparkleField.tsx", "UI", "Strictly Required", "Ambient animated golden particle effect"],
  ["src/countdown.ts", "Utility", "Strictly Required", "IST timezone calculation for days/hours/minutes countdown"],
  // Media Assets
  ["public/envelope-open.mp4", "Media", "Required Asset", "High-definition envelope unsealing video"],
  ["public/envelope-poster.jpg", "Media", "Required Asset", "Static fallback poster before video plays"],
  ["public/assets/kudmayi.m4a", "Media", "Required Asset", "Background wedding instrumental soundtrack"],
  ["public/assets/wedding-ceremony-hd-opt.webp", "Media", "Required Asset", "Floral arch card artwork for Mehendi & Nikah cards"],
  ["public/assets/reception-hd-opt.webp", "Media", "Required Asset", "Reception card background artwork"],
  ["public/assets/entrance-courtyard-hd-opt.webp", "Media", "Required Asset", "Royal courtyard background image"],
  // Optional / Dev
  ["src/countdown.test.ts", "Test", "Optional (Dev)", "Automated test suite verifying event dates and countdown behavior"],
  ["src/invitation/schema.test.ts", "Test", "Optional (Dev)", "Automated test suite for wedding record schema validation"],
  ["src/editor/*", "Tooling", "Optional (Admin)", "Internal customer self-service WYSIWYG editor"],
  ["scripts/*", "Tooling", "Optional (Dev)", "Helper scripts for build automation and cover share generation"],
  [".figma/*", "Tooling", "Optional (Figma)", "Configuration files for Figma Make integration"],
  ["vercel.json", "Deploy", "Optional (Deploy)", "Vercel route rules and cache headers (standard for deployment)"],
];

// Draw Table Header
let tableY = doc.y + 5;
doc.rect(45, tableY, CONTENT_WIDTH, 20).fill(COLORS.navy);
doc.fontSize(8.5).fillColor("#ffffff");
doc.text("File Path", 50, tableY + 5, { width: 170 });
doc.text("Category", 225, tableY + 5, { width: 60 });
doc.text("Status", 290, tableY + 5, { width: 95 });
doc.text("Description & Purpose", 390, tableY + 5, { width: 160 });

tableY += 20;

filesTable.forEach(([filePath, cat, status, desc], i) => {
  if (tableY > PAGE_HEIGHT - 55) {
    doc.addPage();
    tableY = 45;
    doc.rect(45, tableY, CONTENT_WIDTH, 20).fill(COLORS.navy);
    doc.fontSize(8.5).fillColor("#ffffff");
    doc.text("File Path", 50, tableY + 5, { width: 170 });
    doc.text("Category", 225, tableY + 5, { width: 60 });
    doc.text("Status", 290, tableY + 5, { width: 95 });
    doc.text("Description & Purpose", 390, tableY + 5, { width: 160 });
    tableY += 20;
  }

  const rowHeight = 18;
  if (i % 2 === 1) {
    doc.rect(45, tableY, CONTENT_WIDTH, rowHeight).fill(COLORS.tableRowAlt);
  }
  doc.rect(45, tableY, CONTENT_WIDTH, rowHeight).stroke(COLORS.codeBorder);

  doc.fontSize(7.5).fillColor(COLORS.navy).text(filePath, 50, tableY + 4, { width: 170 });
  doc.fontSize(7.5).fillColor(COLORS.textMuted).text(cat, 225, tableY + 4, { width: 60 });

  const statusColor = status.includes("Strictly")
    ? COLORS.maroon
    : status.includes("Required")
      ? COLORS.goldDark
      : COLORS.textMuted;
  doc.fontSize(7.5).fillColor(statusColor).text(status, 290, tableY + 4, { width: 95 });

  doc.fontSize(7).fillColor(COLORS.text).text(desc, 390, tableY + 4, { width: 160 });

  tableY += rowHeight;
});

doc.y = tableY + 15;

// ---------------------------------------------------------------------------
// SECTION 3: WEDDING INVITATION DETAILS & CONTENT SPEC
// ---------------------------------------------------------------------------
doc.addPage();
addSectionTitle("3. Wedding Invitation Details & Content Specification", "Exact live invitation text and event details as configured in the system");

const specCard = (title, contentObj) => {
  if (doc.y > PAGE_HEIGHT - 130) {
    doc.addPage();
  }
  doc.rect(45, doc.y, CONTENT_WIDTH, 18).fill(COLORS.maroon);
  doc.fontSize(9.5).fillColor("#ffffff").text(`  ${title}`, 45, doc.y + 4);
  doc.y += 18;

  const startY = doc.y;
  Object.entries(contentObj).forEach(([label, value]) => {
    doc.fontSize(8.5).fillColor(COLORS.navy).text(`${label}: `, 55, doc.y + 4, { continued: true });
    doc.fontSize(8.5).fillColor(COLORS.text).text(value);
    doc.moveDown(0.2);
  });
  doc.rect(45, startY, CONTENT_WIDTH, doc.y - startY + 4).stroke(COLORS.codeBorder);
  doc.moveDown(0.6);
};

specCard("Couple & Family Information", {
  "Couple Names": "Hakim (Groom) & Insiya (Bride)",
  "Groom Parents": "Mrs Alefiya & Mr Hatim Limdiwala",
  "Bride Parents": "Taheraben & Khuzemabhai Bhanpurawala",
  "Memorial Line": "Late Femiben & Late Mulla Hakimuddin Limdiwala",
  "Special Blessings": "Sakinaben & Yahyabhai Kapadia",
  "Best Wishes From": "Sakina & Husain Limdiwala, Sakina Abbas Shehrawala, Limdiwala & Kapadia Family",
});

specCard("Function 1: Mehendi Ceremony — of Hakim", {
  "Date (Gregorian)": "Friday, 22 January 2027",
  "Date (Hijri)": "15th Shabanul Karim, 1448 H",
  "Timing": "10:00 am onwards IST",
  "Venue": "iRiS Banquet",
  "Address": "Near Bibwewadi, Pune, Maharashtra",
});

specCard("Function 2: Nikah Majlis", {
  "Date (Gregorian)": "Saturday, 23 January 2027",
  "Date (Hijri)": "16th Shabanul Karim, 1448 H",
  "Ceremony Timings": "Shitabi at 6:30 pm | Majlis at 7:30 pm IST",
  "Venue": "Husainy Baug",
  "Address": "Husainy Baug, Pune, Maharashtra",
});

specCard("Function 3: Wedding Reception", {
  "Date (Gregorian)": "Sunday, 24 January 2027",
  "Date (Hijri)": "17th Shabanul Karim, 1448 H",
  "Main Reception Timing": "7:30 pm onwards IST (Highlighted in main maroon badge)",
  "Procession Timing": "Procession at 6:30 pm IST (Bold Black font below time badge)",
  "Venue": "Jarande Lawns",
  "Address": "Pune, Maharashtra",
});

// ---------------------------------------------------------------------------
// SECTION 4 - 7: SOURCE CODE OF KEY FILES
// ---------------------------------------------------------------------------
function addCodeBlock(fileName, relativePath, description) {
  doc.addPage();
  addSectionTitle(`File: ${relativePath}`, description);

  const fullPath = path.join(rootDir, relativePath);
  let code = "";
  try {
    code = fs.readFileSync(fullPath, "utf-8");
  } catch (err) {
    code = `// Could not read ${relativePath}: ${err.message}`;
  }

  const lines = code.split("\n");
  const maxLinesFirstPage = 50;
  const maxLinesSubsequent = 65;

  let lineIdx = 0;
  let isFirstPage = true;

  while (lineIdx < lines.length) {
    if (!isFirstPage) {
      doc.addPage();
      drawHeader(`Source Code: ${relativePath} (Continued)`);
      doc.y = 42;
    }

    const pageSize = isFirstPage ? maxLinesFirstPage : maxLinesSubsequent;
    const chunk = lines.slice(lineIdx, lineIdx + pageSize);
    const boxY = doc.y;
    const boxHeight = chunk.length * 10.5 + 8;

    doc.rect(45, boxY, CONTENT_WIDTH, boxHeight).fill(COLORS.codeBg);
    doc.rect(45, boxY, CONTENT_WIDTH, boxHeight).stroke(COLORS.codeBorder);

    let curY = boxY + 4;
    chunk.forEach((rawLine, idx) => {
      const lineNum = String(lineIdx + idx + 1).padStart(4, " ");
      const displayLine = rawLine.replace(/\t/g, "  ").slice(0, 95);
      doc.fontSize(7).font("Courier").fillColor("#94a3b8").text(`${lineNum} | `, 50, curY, { lineBreak: false });
      doc.fillColor("#0f172a").text(displayLine, 85, curY, { lineBreak: false });
      curY += 10.5;
    });

    doc.y = curY + 12;
    lineIdx += chunk.length;
    isFirstPage = false;
  }
}

// Add code files in logical order
addCodeBlock("invitationConfig.ts", "src/invitationConfig.ts", "Master wedding invitation data configuration, events, and addresses");
addCodeBlock("App.tsx", "src/App.tsx", "Primary application container, navigation, audio control & card rendering");
addCodeBlock("schema.ts", "src/invitation/schema.ts", "Wedding record schema, validation rules, and timezone adapter");
addCodeBlock("InvitationOpening.tsx", "src/InvitationOpening.tsx", "Interactive video envelope opening mechanism");
addCodeBlock("ScratchCard.tsx", "src/ScratchCard.tsx", "Interactive canvas scratch card component");
addCodeBlock("CouplePortrait.tsx", "src/CouplePortrait.tsx", "Couple illustration & decorative Islamic jali vector sprig");
addCodeBlock("countdown.ts", "src/countdown.ts", "Asia/Kolkata timezone countdown engine");
addCodeBlock("package.json", "package.json", "Project dependencies, scripts, and runtime configuration");
addCodeBlock("vite.config.ts", "vite.config.ts", "Vite build tool configuration with Tailwind v4 & React plugins");
addCodeBlock("index.html", "index.html", "Root HTML shell with metadata, OpenGraph tags, and font wiring");

// Add page numbers
const range = doc.bufferedPageRange();
for (let i = 0; i < range.count; i++) {
  doc.switchToPage(i);
  doc.page.margins.bottom = 0;
  doc.page.margins.top = 0;
  if (i > 0) {
    // Top running header
    doc.fontSize(7.5).font("Helvetica").fillColor(COLORS.goldDark).text(
      "HAKIM & INSIYA · NIKAH INVITATION PROJECT DOCUMENTATION",
      45,
      22,
      { width: CONTENT_WIDTH, align: "left", lineBreak: false }
    );
    doc.rect(45, 33, CONTENT_WIDTH, 0.75).fill(COLORS.codeBorder);

    // Bottom running footer
    doc.rect(45, PAGE_HEIGHT - 32, CONTENT_WIDTH, 0.75).fill(COLORS.codeBorder);
    doc.fontSize(8).font("Helvetica").fillColor(COLORS.textMuted).text(
      `Page ${i + 1} of ${range.count}`,
      45,
      PAGE_HEIGHT - 24,
      { width: CONTENT_WIDTH, align: "right", lineBreak: false }
    );
    doc.text(
      "Confidential · Hakim & Insiya Nikah Celebration",
      45,
      PAGE_HEIGHT - 24,
      { width: CONTENT_WIDTH, align: "left", lineBreak: false }
    );
  }
}

doc.end();

writeStream.on("finish", () => {
  console.log(`PDF successfully generated at: ${outputPath}`);
});
