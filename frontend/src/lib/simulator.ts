import { SimulationWeightsRequest, SuspectThreatScore } from "../types";

export function calculateSimulatedLeaderboard(
  weights: Partial<SimulationWeightsRequest>,
  baseLeaderboard: SuspectThreatScore[]
): SuspectThreatScore[] {
  const cctvW = weights.cctv_weight ?? 30;
  const cdrW = weights.cdr_weight ?? 20;
  const firW = weights.fir_weight ?? 15;
  const crimW = weights.criminal_weight ?? 15;
  const finW = weights.financial_weight ?? 10;
  const survW = weights.surveillance_weight ?? 10;

  if (!baseLeaderboard || !Array.isArray(baseLeaderboard) || baseLeaderboard.length === 0) {
    return [];
  }

  const updated = baseLeaderboard.map((item) => {
    // Base max weights are CCTV:30, CDR:20, FIR:15, Criminal:15, Financial:10, Surveillance:10
    const cctv = Math.min(cctvW, ((item.cctv_meeting_score ?? 0) / 30.0) * cctvW);
    const cdr = Math.min(cdrW, ((item.cdr_network_score ?? 0) / 20.0) * cdrW);
    const fir = Math.min(firW, ((item.fir_severity_score ?? 0) / 15.0) * firW);
    const crim = Math.min(crimW, ((item.criminal_history_score ?? 0) / 15.0) * crimW);
    const fin = Math.min(finW, ((item.financial_risk_score ?? 0) / 10.0) * finW);
    const surv = Math.min(survW, ((item.surveillance_score ?? 0) / 10.0) * survW);

    const total = Math.round((cctv + cdr + fir + crim + fin + surv) * 10) / 10;

    const breakdown: Record<string, number> = {
      "CCTV Sightings": Math.round(cctv * 10) / 10,
      "CDR Network": Math.round(cdr * 10) / 10,
      "FIR Severity": Math.round(fir * 10) / 10,
      "Criminal Record": Math.round(crim * 10) / 10,
      "Financial Risk": Math.round(fin * 10) / 10,
      "Surveillance": Math.round(surv * 10) / 10,
    };

    let primary_driver = "None";
    let primary_pct = 0;
    if (total > 0) {
      primary_driver = Object.keys(breakdown).reduce((a, b) =>
        breakdown[a] > breakdown[b] ? a : b
      );
      primary_pct = Math.round((breakdown[primary_driver] / total) * 1000) / 10;
    }

    return {
      ...item,
      total_threat_score: total,
      cctv_meeting_score: Math.round(cctv * 10) / 10,
      cdr_network_score: Math.round(cdr * 10) / 10,
      fir_severity_score: Math.round(fir * 10) / 10,
      criminal_history_score: Math.round(crim * 10) / 10,
      financial_risk_score: Math.round(fin * 10) / 10,
      surveillance_score: Math.round(surv * 10) / 10,
      primary_driver,
      primary_driver_pct: primary_pct,
      driver_breakdown: breakdown,
    };
  });

  return updated.sort((a, b) => b.total_threat_score - a.total_threat_score);
}
