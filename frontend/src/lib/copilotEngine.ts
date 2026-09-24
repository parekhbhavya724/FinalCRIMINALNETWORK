export function generateCopilotResponse(prompt: string): {
  answer: string;
  suggested_queries: string[];
  entities: string[];
} {
  const q = prompt.toLowerCase().trim();

  let answer = "";
  let entities: string[] = [];
  const suggested_queries: string[] = [
    "Who controls Zenith Horizon Mercantile?",
    "List all mules under Vikramaditya Singhania",
    "What is the total value of seized PMLA assets?",
    "Show nocturnal call anomalies for Md. Ranbir Bhalla"
  ];

  if (["hello", "hi", "hey", "good morning", "good evening", "namaste"].some(w => q === w || q.startsWith(w + " "))) {
    answer = "👮‍♂️ **Tactical Intelligence Copilot Online**\n\nGreetings Officer! I am your AI Tactical Assistant for the Brihanmumbai Police Special Intel Division. How can I assist your investigation today?";
  } else if (q.includes("zenith") || q.includes("shell") || q.includes("horizon")) {
    answer = `🏢 **Shell Company Intelligence: Zenith Horizon Mercantile Pvt Ltd**\n\n` +
      `• **Registration**: Nariman Point, Mumbai (CIN: U74999MH2021PTC365412)\n` +
      `• **True Beneficial Owner**: **Vikramaditya 'Bhai' Singhania** (Syndicate Kingpin, ENT-KP-01)\n` +
      `• **Nominee Directors**: Rameshwar Chauhan (Office Peon, 98% shadow equity) & Suman Devi\n` +
      `• **Financial Activity**: Over ₹48.5 Crore in layering transactions routed from 8 mule accounts\n` +
      `• **PMLA Action**: Provisional Attachment Order under PMLA Section 5 issued for main office suite (₹4.8 Cr).`;
    entities = ["Zenith Horizon Mercantile", "Vikramaditya Singhania", "Rameshwar Chauhan", "Nariman Point"];
  } else if (q.includes("mule") || q.includes("smurfing") || q.includes("singhania")) {
    answer = `💳 **Mule Network Analysis: Vikramaditya Singhania Syndicate**\n\n` +
      `Identified **8 active mule accounts** operated under Singhania's direction:\n\n` +
      `1. **Rameshwar Chauhan** (HDFC - Current A/C #...8812) — Layering hub: ₹14.2 Cr\n` +
      `2. **Vijay Kumar Sahu** (Axis Bank - A/C #...4091) — Smurfing funnel: ₹3.8 Cr\n` +
      `3. **Anand Sharma** (ICICI - A/C #...9912) — Angadia cashout: ₹2.5 Cr\n` +
      `4. **5 Student / Delivery Agent Accounts** — Micro-transfers (<₹50,000/day)\n\n` +
      `⚠️ **Modus Operandi**: Automated UPI micro-bursts bypassing STR flags, consolidated at Zaveri Bazaar Angadia desks.`;
    entities = ["Vikramaditya Singhania", "Rameshwar Chauhan", "Angadia Desk", "Zaveri Bazaar"];
  } else if (q.includes("asset") || q.includes("seize") || q.includes("pmla") || q.includes("penthouse") || q.includes("attachment") || q.includes("value")) {
    answer = `🏛️ **PMLA Section 5 Provisional Asset Attachment Summary**\n\n` +
      `**Total Seized Asset Value: ₹39.25 Crores** across 5 high-value properties:\n\n` +
      `• 🏢 **Worli Sea Face Penthouse**: ₹12.50 Cr (Beneficiary: Singhania Family Trust)\n` +
      `• 🏬 **Nariman Point Commercial Suite**: ₹4.80 Cr (Registered under Zenith Horizon)\n` +
      `• 🚗 **Mercedes-Maybach S-Class**: ₹3.20 Cr (Vehicle Reg: MH-01-EV-0001)\n` +
      `• 🪙 **Zaveri Bazaar Gold Bullion Vault**: ₹11.25 Cr (Seized from Angadia Vault #4)\n` +
      `• 🏡 **Alibaug Waterfront Estate**: ₹7.50 Cr (Benami property under nominee driver)\n\n` +
      `📋 *All attachments confirmed by PMLA Adjudicating Authority.*`;
    entities = ["Worli Penthouse", "Nariman Point Suite", "Mercedes-Maybach", "Zaveri Bazaar Gold"];
  } else if (q.includes("advik") || q.includes("golla")) {
    answer = `🎯 **Suspect Dossier: Md. Advik Golla (Rank #1)**\n\n` +
      `• **Threat Index Score**: **89.1 / 100** (CRITICAL THREAT - Red Notice Priority)\n` +
      `• **Role**: Ring-01 Operations Lead & Syndicate Executor\n` +
      `• **MSISDN**: +91-0751400478\n` +
      `• **Active Warrants**: FIR 0254/2026 (Extortion), FIR 0112/2026 (IPC 307 - Attempted Homicide)\n` +
      `• **CDR Intelligence**: 14 high-frequency midnight calls with Md. Ranbir Bhalla\n` +
      `• **CCTV Verification**: MH-CCTV-9890 (Byculla Junction) at 23:14 IST.`;
    entities = ["Md. Advik Golla", "Ring-01", "Extortion", "Byculla"];
  } else if (q.includes("ranbir") || q.includes("bhalla")) {
    answer = `🎯 **Suspect Dossier: Md. Ranbir Bhalla (Rank #2)**\n\n` +
      `• **Threat Index Score**: **87.4 / 100** (CRITICAL THREAT)\n` +
      `• **Role**: Field Logistics & Angadia Cash Collector\n` +
      `• **MSISDN**: +91-9820199201\n` +
      `• **Nocturnal Anomaly**: 42 late-night calls logged between 01:30 AM – 04:00 AM\n` +
      `• **Co-Locations**: 6 camera overlaps with Md. Teerth Bhargava in Dongri & Byculla.`;
    entities = ["Md. Ranbir Bhalla", "Angadia Collector", "Dongri", "Byculla"];
  } else if (q.includes("nocturnal") || q.includes("night") || q.includes("call")) {
    answer = `🌙 **Nocturnal Call Anomaly Analysis**\n\n` +
      `• **Total Flagged Calls**: 412 interactions logged between 01:00 AM – 04:30 AM\n` +
      `• **Primary High-Risk Cluster**: Md. Ranbir Bhalla ↔ Md. Teerth Bhargava (42 calls, average duration: 14m 20s)\n` +
      `• **Tower Triangulation**: MH-TOWER-BYCULLA-04 & MH-TOWER-DONGRI-02\n` +
      `• **Tactical Assessment**: Pre-operational coordination window for contraband delivery.`;
    entities = ["Md. Ranbir Bhalla", "Md. Teerth Bhargava", "Byculla Tower", "Dongri Tower"];
  } else if (q.includes("cctv") || q.includes("camera") || q.includes("meeting")) {
    answer = `📹 **CCTV Spatiotemporal Co-Location Report**\n\n` +
      `• **Total Sightings**: 12 verified camera encounters across South Mumbai\n` +
      `• **Key Intersection**: Camera MH-CCTV-9890 (Byculla Junction)\n` +
      `• **High Confidence Sighting**: Md. Advik Golla, Md. Ranbir Bhalla, and Md. Teerth Bhargava spotted together in Black SUV (MH-01-CD-4421) at 23:14:02 IST\n` +
      `• **Proximity**: <3.2 meters spacing for 18 minutes inside restaurant parking.`;
    entities = ["MH-CCTV-9890", "Md. Advik Golla", "Md. Ranbir Bhalla", "Byculla Junction"];
  } else {
    answer = `🔍 **Intelligence Database Query Result**\n\n` +
      `Cross-referencing intelligence databases for "${prompt}":\n\n` +
      `• **CDR Records**: 14 matching call records across Byculla & Dongri towers\n` +
      `• **CCTV Encounters**: 3 co-location camera hits near South Mumbai nodes\n` +
      `• **Financial Mesh**: 2 flagged UPI smurfing transactions linked to syndicate accounts\n\n` +
      `💡 **Recommended Action**: Issue Section 91 CrPC notice for bank statements & request tower dump for cell MH-TOWER-BYCULLA-04.`;
    entities = ["CDR Correlation", "CCTV Mesh", "PMLA Analytics"];
  }

  return { answer, suggested_queries, entities };
}
