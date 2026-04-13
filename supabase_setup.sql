-- Sentinel Zero - Database Schema Setup
-- Run this in the Supabase SQL Editor

-- 1. Enable Realtime
ALTER publication supabase_realtime ADD TABLE threats;
ALTER publication supabase_realtime ADD TABLE system_metrics;

-- 2. Threats Table
CREATE TABLE IF NOT EXISTS threats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    type TEXT NOT NULL, -- 'DDoS', 'Malware', 'Intrusion', 'Phishing'
    severity TEXT NOT NULL, -- 'Critical', 'High', 'Medium', 'Low'
    status TEXT DEFAULT 'Active', -- 'Active', 'Mitigated', 'Under Review'
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    description TEXT,
    source_ip TEXT
);

-- 3. System Metrics Table
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cpu_load FLOAT,
    network_traffic FLOAT, -- Mbps
    memory_usage FLOAT,
    active_agents INTEGER
);

-- 4. AI Interaction History
CREATE TABLE IF NOT EXISTS ai_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id TEXT,
    role TEXT, -- 'user', 'assistant'
    content TEXT
);

-- 5. Row Level Security (RLS)
ALTER TABLE threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_history ENABLE ROW LEVEL SECURITY;

-- For prototype: Allow public access (Read)
CREATE POLICY "Allow public read" ON threats FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON system_metrics FOR SELECT USING (true);

-- 6. Initial Seed Data
INSERT INTO threats (type, severity, status, lat, lng, description) VALUES
('DDoS Attack', 'Critical', 'Active', 51.5074, -0.1278, 'High volume traffic originating from botnet cluster-7.'),
('Malware Detection', 'High', 'Mitigated', 40.7128, -74.0060, 'Trojan.Sentinel.X isolated on workstation node-22.'),
('Unauthorized Login', 'Medium', 'Active', 35.6895, 139.6917, 'Failed authentication attempts from unknown source in region AS-1.');

INSERT INTO system_metrics (cpu_load, network_traffic, memory_usage, active_agents) VALUES
(42.5, 120.4, 68.2, 12),
(45.1, 118.2, 69.1, 12),
(41.8, 122.5, 67.5, 12);
