-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'RESELLER',
    balance INTEGER DEFAULT 0,
    panel_code TEXT NOT NULL,
    invited_by INTEGER,
    is_blocked INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Panels Table
CREATE TABLE IF NOT EXISTS panels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    panel_code TEXT UNIQUE NOT NULL,
    panel_name TEXT,
    connect_token TEXT UNIQUE NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_value TEXT UNIQUE NOT NULL,
    panel_code TEXT NOT NULL,
    duration TEXT NOT NULL,
    device_limit INTEGER DEFAULT 1,
    created_by INTEGER,
    is_active INTEGER DEFAULT 1,
    is_blocked INTEGER DEFAULT 0,
    expires_at DATETIME,
    uses INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Key Devices Table
CREATE TABLE IF NOT EXISTS key_devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key_id INTEGER NOT NULL,
    device_uuid TEXT NOT NULL,
    panel_code TEXT NOT NULL,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(key_id, device_uuid)
);

-- Mod Settings Table
CREATE TABLE IF NOT EXISTS mod_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    panel_code TEXT NOT NULL,
    setting_name TEXT NOT NULL,
    setting_value TEXT,
    UNIQUE(panel_code, setting_name)
);

-- Mod Maintenance Table
CREATE TABLE IF NOT EXISTS mod_maintenance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    panel_code TEXT NOT NULL,
    is_active INTEGER DEFAULT 0,
    reason TEXT
);

-- Sessions Table (Optional for JWT tracking)
CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
);

-- Create default OWNER user (username: admin, password: admin123)
INSERT INTO users (username, password, role, balance, panel_code) 
VALUES ('admin', '$2a$10$YourHashedPasswordHere', 'OWNER', 999999, 'ARC001');

-- Create default panel
INSERT INTO panels (panel_code, panel_name, connect_token, created_by) 
VALUES ('ARC001', 'ARC PANEL', 'ARCROOT', 1);