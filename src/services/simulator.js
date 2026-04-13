/**
 * SENTINEL ZERO — Attack Simulation Engine
 * Used for "Presentation Mode" to demonstrate real-time mitigation of various cyber threats.
 */

import { SentinelEngine } from './sentinelEngine';

export const ATTACK_PROFILES = {
  BRUTE_FORCE: {
    name: "Brute Force Auth Attack",
    description: "Iterative credential guessing attempt from high-velocity proxy network.",
    telemetry: {
      requestFrequency: 450,
      mfaEnabled: false,
      isNewDevice: true,
      geoMismatch: true
    }
  },
  BOT_SCRAPING: {
    name: "Distributed Bot Scraping",
    description: "Headless browser swarm targeting sensitive API endpoints for data exfiltration.",
    telemetry: {
      requestFrequency: 800,
      mfaEnabled: true,
      isNewDevice: true,
      geoMismatch: false
    }
  },
  GEO_SPOOFING: {
    name: "VPN/Proxy Tunnel Anomaly",
    description: "Authorized identity accessing from unusual geographic coordinate with mismatched IP ASN.",
    telemetry: {
      requestFrequency: 12,
      mfaEnabled: true,
      isNewDevice: false,
      geoMismatch: true
    }
  },
  SQL_INJECTION: {
    name: "SQL Injection Payload",
    description: "Malicious DROP TABLE and UNION SELECT payloads detected in database mutation endpoints.",
    telemetry: {
      requestFrequency: 5,
      mfaEnabled: true,
      isNewDevice: true,
      geoMismatch: false
    }
  },
  XSS_PAYLOAD: {
    name: "Cross-Site Scripting (XSS)",
    description: "Execution of <script> and alert() vectors intercepted at ingress gateway.",
    telemetry: {
      requestFrequency: 2,
      mfaEnabled: false,
      isNewDevice: true,
      geoMismatch: true
    }
  }
};

export class AttackSimulator {
  constructor(onEvent) {
    this.onEvent = onEvent;
    this.active = false;
    this.sequence = null;
  }

  start(profileKey) {
    const profile = ATTACK_PROFILES[profileKey];
    if (!profile) return;

    this.active = true;
    const analysis = SentinelEngine.calculateEventRisk(profile.telemetry);
    
    // Simulate real-world progression
    this.onEvent({
      type: 'SIM_START',
      message: `SIMULATION INITIALIZED: ${profile.name}`,
      data: profile
    });

    setTimeout(() => {
      this.onEvent({
        type: 'THREAT_DETECTED',
        threat: {
          id: `sim_${Math.random().toString(36).substr(2, 9)}`,
          type: profile.name,
          description: profile.description,
          severity: analysis.label,
          risk_score: analysis.score,
          flags: analysis.flags,
          status: 'Active',
          created_at: new Date().toISOString()
        }
      });
    }, 1500);
  }

  stop() {
    this.active = false;
    this.onEvent({ type: 'SIM_STOP', message: "SIMULATION TERMINATED. SYSTEM RETURNED TO SECURE BASELINE." });
  }
}
