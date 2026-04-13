import { describe, it, expect } from 'vitest';
import { SentinelEngine } from '../services/sentinelEngine';

describe('SentinelEngine', () => {
  it('should calculate base risk correctly for a secure telemetry', () => {
    const telemetry = {
      mfaEnabled: true,
      isNewDevice: false,
      requestFrequency: 10,
      geoMismatch: false
    };
    const result = SentinelEngine.calculateEventRisk(telemetry);
    // Baseline score is 5 + 0 for these flags. (Temporal check might add 10 if run at night, but overall low)
    expect(result.score).toBeLessThan(40);
    expect(result.label).toBe('SECURE');
  });

  it('should flag CRITICAL for extremely high request frequency', () => {
    const telemetry = {
      mfaEnabled: true,
      isNewDevice: false,
      requestFrequency: 500,
      geoMismatch: false
    };
    const result = SentinelEngine.calculateEventRisk(telemetry);
    expect(result.score).toBeGreaterThanOrEqual(40);
    expect(result.flags).toContain('Velocity: Abnormal request frequency detected');
  });

  it('should flag geo mismatch as a warning vector', () => {
    const telemetry = {
      mfaEnabled: true,
      isNewDevice: false,
      requestFrequency: 10,
      geoMismatch: true
    };
    const result = SentinelEngine.calculateEventRisk(telemetry);
    expect(result.flags).toContain('Geo: Access from restricted or mismatch region');
  });
});
