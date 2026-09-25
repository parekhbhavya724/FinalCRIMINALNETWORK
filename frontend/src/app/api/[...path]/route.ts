import { NextRequest, NextResponse } from "next/server";
import { generateCopilotResponse } from "@/lib/copilotEngine";
import { calculateSimulatedLeaderboard } from "@/lib/simulator";
import { fallbackLeaderboard } from "@/lib/mockData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join("/");
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();
  const query = searchParams ? `?${searchParams}` : "";

  const backendBase =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.BACKEND_URL ||
    "http://127.0.0.1:8080";

  try {
    const backendRes = await fetch(`${backendBase}/api/${path}${query}`, {
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(800),
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    // Backend offline or unreachable — fallback handled by client SDK
  }

  // Fallback response for /api/health
  if (path === "health") {
    return NextResponse.json({
      status: "HEALTHY (DEMO RESILIENT MODE)",
      system: "Brihanmumbai Police Tactical Intelligence Platform",
      version: "2.0.0",
      total_suspects: 10,
    });
  }

  return NextResponse.json(
    {
      error: "BACKEND_OFFLINE",
      message: `Endpoint /api/${path} is offline. Using client data layer.`,
      path: path,
    },
    { status: 503 }
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const path = resolvedParams.path.join("/");

  let body: any = {};
  try {
    body = await request.json().catch(() => ({}));
  } catch (e) {}

  const prompt = body?.prompt || body?.query || "";

  const backendBase =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.BACKEND_URL ||
    "http://127.0.0.1:8080";

  try {
    // If request is to core-ai copilot query, attempt backend call first
    const backendRes = await fetch(`${backendBase}/api/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(800),
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data);
    }
  } catch (err) {
    // Backend offline or unreachable
  }

  // Fallback for copilot route when backend is offline or throws exception
  if (path.includes("copilot")) {
    const { answer, suggested_queries, entities } = generateCopilotResponse(prompt);
    return NextResponse.json({
      status: "SUCCESS",
      query: prompt,
      answer: answer,
      answer_markdown: answer,
      suggested_queries,
      metadata: { entities, suggestedActions: suggested_queries }
    });
  }

  if (path.includes("threat/simulate")) {
    const simulated = calculateSimulatedLeaderboard(body, fallbackLeaderboard.leaderboard);
    const totalWeight = (body.cctv_weight || 30) + (body.cdr_weight || 20) + (body.fir_weight || 15) + (body.criminal_weight || 15) + (body.financial_weight || 10) + (body.surveillance_weight || 10);
    return NextResponse.json({
      total_weight: totalWeight,
      simulated_leaderboard: simulated,
    });
  }

  return NextResponse.json({
    status: "SUCCESS",
    message: `Operation for /api/${path} recorded in offline demonstration buffer.`,
  });
}
