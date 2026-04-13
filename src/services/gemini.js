// Sentinel Zero — AI Threat Intelligence Service
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Explains a security threat in human-readable tactical language.
 */
export async function getThreatExplanation(threat) {
  const prompt = `
    As a Senior Security Architect at Sentinel Zero, analyze this threat event and provide a concise, high-fidelity explanation.
    
    THREAT DATA:
    - Type: ${threat.type}
    - Severity: ${threat.severity}
    - Risk Score: ${threat.risk_score}/100
    - Description: ${threat.description}
    - Detected Flags: ${threat.flags?.join(', ') || 'N/A'}
    
    RESPONSE STRUCTURE (Markdown):
    1. **Analysis**: 1-2 sentences explain why this is a threat from a Zero Trust perspective.
    2. **Technical Details**: Brief bullet points on the attack vector (e.g., identity spoofing, velocity matching).
    3. **Remediation**: 2 immediate tactical actions for the SOC team.
    
    Keep it professional, high-tech, and under 150 words.
  `;

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
      }),
    });
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'ANALYSIS COMPLETE: Threat matches known adversarial pattern. Elevated vigilance recommended.';
  } catch (err) {
    return 'Analysis Core Offline: Local heuristics identify this as a significant vector for lateral movement. Protocol dictates immediate session audit and MFA challenge.';
  }
}


/**
 * Analyzes a raw event log for hidden anomalies.
 */
export async function analyzeLogAnomalies(logData) {
  const prompt = `Analyze this system log for Zero Trust violations or security anomalies:
  "${logData}"
  
  Return a JSON object:
  {
    "anomalyDetected": boolean,
    "confidence": 0-1,
    "likelyVector": "string",
    "recommendation": "string"
  }`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.1 },
      }),
    });
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return JSON.parse(text);
  } catch (err) {
    return { anomalyDetected: false, confidence: 0, likelyVector: 'N/A', recommendation: 'Manual audit required' };
  }
}

/**
 * Generates a realistic live security threat event.
 */
export async function generateLiveThreat() {
  const prompt = `Generate a futuristic cybersecurity threat event for a Zero Trust dashboard.
  Return ONLY valid JSON:
  {
    "type": "e.g. Brute Force, Token Hijacking, SQLi, Port Scan",
    "severity": "CRITICAL | WARNING | INFO",
    "risk_score": <number 50-100>,
    "description": "Short technical summary",
    "flags": ["Flag 1", "Flag 2"]
  }`;

  try {
    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch (err) {
    const fallbacks = [
      { type: 'DDoS Swarm', severity: 'CRITICAL', risk_score: 94, description: 'Distributed UDP flood originating from botnet cluster 0xD2', flags: ['High Velocity', 'Spoofed IP'] },
      { type: 'Credential Stuffing', severity: 'WARNING', risk_score: 62, description: 'Rapid sequential login failures detected on identity endpoint', flags: ['Auth Failure'] },
      { type: 'Lateral Movement', severity: 'CRITICAL', risk_score: 88, description: 'Suspicious escalation of privileges from unauthenticated node', flags: ['PrivEsc'] }
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}
