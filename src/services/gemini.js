// Sentinel Zero — AI Threat Intelligence Service
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Use flash-latest for better compatibility with v1beta
const MODEL = "gemini-1.5-flash-latest"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

/**
 * Generic Fetcher with Fallback and Logging
 */
export async function callGemini(prompt) {
  if (!API_KEY || API_KEY === 'undefined') {
    console.error('Gemini API Key missing');
    return null;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error('Gemini API Error:', errData);
      throw new Error(`Gemini API returned ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
  } catch (error) {
    console.error('Gemini Request Failed:', error);
    return null;
  }
}

/**
 * Provides a technical XAI explanation for a threat.
 */
export async function getThreatExplanation(threat, role) {
    const roleTone = {
      'ADMIN': 'ACT AS A SENIOR CYBERSECURITY ARCHITECT. Provide deep technical forensics, raw packet-level assumptions, and infrastructure-wide impact analysis.',
      'ANALYST': 'ACT AS A TACTICAL SOC ANALYST. Focus on immediate mitigation steps, threat actor profiling, and specific CVE/vulnerability classification.',
      'VIEWER': 'ACT AS A CYBERSECURITY EXECUTIVE. Focus on business risk, potential compliance impact, and high-level summaries for non-technical stakeholders.'
    };

    const prompt = `
    ${roleTone[role] || roleTone['ANALYST']}
    
    ANALYZE THIS THREAT EVENT IDENTIFIED BY SENTINEL-ZERO:
    ---
    URL/TARGET: ${threat.url || threat.target}
    PLATFORM: ${threat.platform}
    REASON: ${threat.reason}
    SEVERITY: ${threat.severity || 'Medium'}
    RISK SCORE: ${threat.risk_score || 50}
    ---
    PROVIDE A STRUCTURED JSON ANALYSIS. DO NOT PROPOSE ANY MARKDOWN BLOCK. JUST PURE JSON.
    FORMAT:
    {
       "threatType": "Short classification of the threat (e.g. Brute Force)",
       "reason": "Technical reason why this was flagged (mention Zero Trust rules) in 1-2 sentences. Human-readable.",
       "confidence": "Percentage like '98%'",
       "fix": "Step-by-step instructions for mitigation. Tailor tone to the role."
    }
    KEEP IT PROFESSIONAL, TACTICAL, AND CONCISE.
  `;
  
  const res = await callGemini(prompt);
  try {
    const cleaned = res.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse getThreatExplanation", e);
    return {
      threatType: "Unknown Threat Vector",
      reason: "FAILED TO REACH AI CLUSTER. LOCAL HEURISTICS SUGGEST ABNORMAL VELOCITY.",
      confidence: "??%",
      fix: "- Sever connection immediately\n- Review ingress logs\n- Manually rotate API keys"
    };
  }
}

/**
 * Generates an Intelligence Dossier for legal/admin use.
 */
export async function createLegalDossier(threat) {
  const prompt = `
    GENERATE A FORMAL "LEGAL EVIDENCE DOSSIER" FOR COPYRIGHT INFRINGEMENT.
    ID: ${threat.id}
    EVIDENCE: ${threat.url}
    TIMESTAMP: ${new Date().toISOString()}
    
    INCLUDE:
    - CHAIN OF CUSTODY OVERVIEW
    - FORENSIC IMAGE/SOURCE VERIFICATION
    - DIGITAL MILLENNIUM COPYRIGHT ACT (DMCA) COMPLIANCE VERDICT
    - RECOMMENDED ENFORCEMENT ACTION
  `;
  
  return await callGemini(prompt);
}

/**
 * Compiles a multi-threat summary report.
 */
export async function generateReport(threats) {
  const threatSummary = threats.map(t => `- ${t.url} (${t.platform}): ${t.reason}`).join('\n');
  const prompt = `
    GENERATE AN "EXECUTIVE THREAT MATRIX" REPORT BASED ON THESE INCIDENTS:
    ${threatSummary}
    
    FOCUS ON:
    - SYSTEMIC PROPAGATION TRENDS
    - REGIONAL RISK CLUSTERS
    - INFRASTRUCTURE VULNERABILITES EXPOSED
  `;
  
  return await callGemini(prompt);
}

/**
 * AI-Powered scan analyzer
 */
export async function analyzeScan(data) {
  const prompt = `
    PERFORM A NEURAL VULNERABILITY AUDIT ON THIS DATA:
    ${JSON.stringify(data)}
    
    OUTPUT:
    1. RISK SCORE (0-100)
    2. KEY VULNERABILITIES FOUND
    3. AI RECOMMENDATIONS
  `;
  
  return await callGemini(prompt);
}

/**
 * Simulated threat generator
 */
export async function generateLiveThreat() {
  const prompt = "GENERATE A JSON OBJECT (ONLY) REPRESENTING A CYBER THREAT. FIELDS: url, platform, reason, risk_score (0-100), severity (Low, Medium, High).";
  const res = await callGemini(prompt);
  try {
    return JSON.parse(res);
  } catch {
    const fallbacks = [
      { url: 'https://malicious-node.io', platform: 'Web', reason: 'DDoS Swarm', severity: 'CRITICAL', risk_score: 94 },
      { url: 'https://auth-bypass.net', platform: 'Identity', reason: 'Credential Stuffing', severity: 'WARNING', risk_score: 62 },
      { url: 'internal-server-01', platform: 'Network', reason: 'Lateral Movement', severity: 'CRITICAL', risk_score: 88 }
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}
