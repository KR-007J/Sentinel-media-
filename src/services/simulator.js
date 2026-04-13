import { SentinelEngine } from './sentinelEngine';

export const ATTACK_PROFILES = {
  BRUTE_FORCE: {
    name: "Brute Force Auth Attack",
    description: "Iterative credential guessing attempt from high-velocity proxy network.",
    steps: [
      { type: 'STATUS', msg: "Detecting high-velocity login attempts on Auth Node...", delay: 500 },
      { type: 'ANOMALY', msg: "Anomalous ASN identified: TOR Exit Node cluster.", delay: 1200 },
      { type: 'THREAT', severity: 'CRITICAL', score: 92, flags: ['BRUTE_FORCE', 'TOR_PROXY', 'MFA_BYPASS_ATTEMPT'], delay: 1000 }
    ],
    telemetry: { requestFrequency: 450, mfaEnabled: false, isNewDevice: true, geoMismatch: true }
  },
  BOT_SCRAPING: {
    name: "Distributed Bot Scraping",
    description: "Headless browser swarm targeting sensitive API endpoints for data exfiltration.",
    steps: [
      { type: 'STATUS', msg: "Analyzing traffic patterns on /api/v1/users...", delay: 800 },
      { type: 'ANOMALY', msg: "Pattern match: Headless Chrome fingerprint detected.", delay: 1000 },
      { type: 'THREAT', severity: 'HIGH', score: 78, flags: ['SCRAPING', 'USER_ENUMERATION'], delay: 1500 }
    ],
    telemetry: { requestFrequency: 800, mfaEnabled: true, isNewDevice: true, geoMismatch: false }
  },
  SQL_INJECTION: {
    name: "SQL Injection Payload",
    description: "Malicious DROP TABLE and UNION SELECT payloads detected in database mutation endpoints.",
    steps: [
      { type: 'STATUS', msg: "Deep Packet Inspection active on Ingress Gateway...", delay: 600 },
      { type: 'ANOMALY', msg: "Payload detected: UNION SELECT 1,2,3,4...", delay: 1200 },
      { type: 'THREAT', severity: 'CRITICAL', score: 98, flags: ['SQL_INJECTION', 'DATABASE_MUTATION'], delay: 1000 }
    ],
    telemetry: { requestFrequency: 5, mfaEnabled: true, isNewDevice: true, geoMismatch: false }
  },
  XSS_PAYLOAD: {
    name: "Cross-Site Scripting (XSS)",
    description: "Execution of <script> and alert() vectors intercepted at ingress gateway.",
    steps: [
      { type: 'STATUS', msg: "Validating input sanitization buffers...", delay: 1000 },
      { type: 'ANOMALY', msg: "Script vector found: <img src=x onerror=alert(1)>", delay: 800 },
      { type: 'THREAT', severity: 'MEDIUM', score: 45, flags: ['XSS', 'INPUT_VULNERABILITY'], delay: 1200 }
    ],
    telemetry: { requestFrequency: 2, mfaEnabled: false, isNewDevice: true, geoMismatch: true }
  }
};

export class AttackSimulator {
  constructor(onEvent) {
    this.onEvent = onEvent;
    this.active = false;
    this.timerRefs = [];
  }

  start(profileKey) {
    const profile = ATTACK_PROFILES[profileKey];
    if (!profile) return;

    this.stop(); // Clear any existing
    this.active = true;
    
    let cumulativeDelay = 0;

    this.onEvent({ type: 'SIM_START', message: `SIMULATION SEQUENCE INITIALIZED: ${profile.name.toUpperCase()}` });

    profile.steps.forEach((step, index) => {
      cumulativeDelay += step.delay;
      const timer = setTimeout(() => {
        if (!this.active) return;

        if (step.type === 'STATUS') {
          this.onEvent({ type: 'STATUS_UPDATE', message: step.msg });
        } else if (step.type === 'ANOMALY') {
          this.onEvent({ type: 'ANOMALY_DETECTED', message: step.msg });
        } else if (step.type === 'THREAT') {
          const threat = {
            id: `sim_${Math.random().toString(36).substr(2, 9)}`,
            type: profile.name,
            description: profile.description,
            severity: step.severity,
            risk_score: step.score,
            flags: step.flags,
            status: 'Active',
            created_at: new Date().toISOString()
          };
          this.onEvent({ type: 'THREAT_DETECTED', threat });
        }

        // Auto-stop if last step
        if (index === profile.steps.length - 1) {
          // Keep active for a moment then "finish" but dont stop simulation UI yet 
          // (Store handles when simulation ends)
        }
      }, cumulativeDelay);
      
      this.timerRefs.push(timer);
    });
  }

  stop() {
    this.active = false;
    this.timerRefs.forEach(clearTimeout);
    this.timerRefs = [];
    this.onEvent({ type: 'SIM_STOP', message: "SIMULATION TERMINATED. SYSTEM RETURNED TO SECURE BASELINE." });
  }
}
