-- Secure DMS Database Schema
-- PostgreSQL 15+ with encryption support

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS uuid-ossp;
CREATE EXTENSION IF NOT EXISTS "hstore";

-- ============================================================================
-- ENUMS (Custom Types)
-- ============================================================================

CREATE TYPE user_role AS ENUM (
    'admin',
    'case_manager',
    'investigator',
    'judge',
    'lawyer',
    'witness',
    'police_officer'
);

CREATE TYPE document_type AS ENUM (
    'fir',
    'report',
    'witness_statement',
    'charge_sheet',
    'evidence',
    'judgment',
    'legal_notice',
    'forensic_report',
    'other'
);

CREATE TYPE classification_level AS ENUM (
    'public',
    'confidential',
    'secret',
    'top_secret'
);

CREATE TYPE case_status AS ENUM (
    'open',
    'investigation',
    'pending_trial',
    'trial',
    'appeal',
    'closed',
    'dismissed'
);

CREATE TYPE access_permission AS ENUM (
    'view',
    'download',
    'edit',
    'share',
    'sign',
    'delete'
);

CREATE TYPE audit_action AS ENUM (
    'upload',
    'download',
    'view',
    'edit',
    'delete',
    'share',
    'sign',
    'access_granted',
    'access_revoked',
    'blockchain_recorded',
    'verified',
    'tamper_detected'
);

-- ============================================================================
-- USERS AND AUTHENTICATION
-- ============================================================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    department VARCHAR(255),
    
    -- Authentication
    hashed_password VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'investigator',
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Multi-Factor Authentication
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    mfa_method VARCHAR(50),  -- 'totp', 'sms', 'email', 'biometric'
    
    -- Security
    last_login TIMESTAMP,
    last_password_change TIMESTAMP,
    failed_login_attempts INT DEFAULT 0,
    account_locked_until TIMESTAMP,
    
    -- Metadata
    profile_picture_url VARCHAR(500),
    encryption_public_key TEXT,  -- For storing digital signatures
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_is_active ON users(is_active);

-- User roles table for fine-grained permissions
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,  -- Array of permission strings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles (name, permissions) VALUES
    ('admin', '["user_management", "system_config", "audit_read", "all_documents"]'::jsonb),
    ('case_manager', '["case_management", "document_management", "user_assignment"]'::jsonb),
    ('investigator', '["document_upload", "document_view", "case_access"]'::jsonb),
    ('judge', '["document_view", "signature_verification", "case_status_update"]'::jsonb),
    ('lawyer', '["document_view", "document_download", "case_access"]'::jsonb),
    ('witness', '["statement_view", "own_documents"]'::jsonb);

-- User permissions mapping
CREATE TABLE user_permissions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id),
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by INT REFERENCES users(id),
    expires_at TIMESTAMP,
    
    UNIQUE(user_id, role_id)
);

CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);

-- ============================================================================
-- CASES
-- ============================================================================

CREATE TABLE cases (
    id SERIAL PRIMARY KEY,
    case_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    
    -- Case metadata
    fir_number VARCHAR(50),
    status case_status DEFAULT 'open',
    jurisdiction VARCHAR(255),
    court_name VARCHAR(255),
    
    -- Personnel
    investigating_officer_id INT REFERENCES users(id),
    assigned_judge_id INT REFERENCES users(id),
    assigned_lawyer_id INT REFERENCES users(id),
    
    -- Dates
    case_filed_date DATE,
    start_date DATE,
    expected_end_date DATE,
    closed_date DATE,
    
    -- Classification
    classification classification_level DEFAULT 'confidential',
    is_sensitive BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT case_number_format CHECK (case_number ~ '^[A-Z0-9/-]+$')
);

CREATE INDEX idx_cases_case_number ON cases(case_number);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_investigating_officer ON cases(investigating_officer_id);
CREATE INDEX idx_cases_jurisdiction ON cases(jurisdiction);

-- Case participants (many-to-many)
CREATE TABLE case_participants (
    id SERIAL PRIMARY KEY,
    case_id INT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id),
    role VARCHAR(50) NOT NULL,  -- investigator, judge, lawyer, etc.
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(case_id, user_id)
);

CREATE INDEX idx_case_participants_case_id ON case_participants(case_id);
CREATE INDEX idx_case_participants_user_id ON case_participants(user_id);

-- ============================================================================
-- DOCUMENTS AND STORAGE
-- ============================================================================

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    
    -- File information
    filename VARCHAR(500) NOT NULL,
    original_filename VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),  -- pdf, doc, docx, jpg, etc.
    file_size BIGINT,  -- in bytes
    
    -- Storage
    file_path VARCHAR(1000),  -- path in MinIO/S3
    file_hash VARCHAR(64) UNIQUE NOT NULL,  -- SHA-256 hash for integrity
    
    -- Encryption
    is_encrypted BOOLEAN DEFAULT TRUE,
    encryption_algorithm VARCHAR(50) DEFAULT 'AES-256',
    encryption_key_id VARCHAR(100),  -- Reference to key in vault
    
    -- Document classification
    case_id INT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    document_type document_type NOT NULL,
    classification classification_level DEFAULT 'confidential',
    
    -- Metadata
    title VARCHAR(500),
    description TEXT,
    keywords TEXT,  -- Comma-separated, searchable
    
    -- Dates and versioning
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INT NOT NULL REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    -- Blockchain integration
    blockchain_hash VARCHAR(66),  -- Keccak-256 hash on blockchain
    blockchain_tx_hash VARCHAR(66),  -- Transaction hash
    blockchain_verified BOOLEAN DEFAULT FALSE,
    blockchain_verified_at TIMESTAMP,
    
    -- Signature status
    is_signed BOOLEAN DEFAULT FALSE,
    signature_count INT DEFAULT 0,
    
    -- OCR and AI
    ocr_data TEXT,
    ai_classification TEXT,
    ai_confidence FLOAT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT file_size_check CHECK (file_size > 0)
);

CREATE INDEX idx_documents_case_id ON documents(case_id);
CREATE INDEX idx_documents_file_hash ON documents(file_hash);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_document_type ON documents(document_type);
CREATE INDEX idx_documents_classification ON documents(classification);
CREATE INDEX idx_documents_blockchain_hash ON documents(blockchain_hash);

-- Full-text search index
CREATE INDEX idx_documents_title_search ON documents USING gin(to_tsvector('english', title));
CREATE INDEX idx_documents_keywords_search ON documents USING gin(to_tsvector('english', keywords));

-- Document versions for version control
CREATE TABLE document_versions (
    id SERIAL PRIMARY KEY,
    document_id INT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    
    version_number INT NOT NULL,
    file_hash VARCHAR(64) NOT NULL,
    file_path VARCHAR(1000),
    file_size BIGINT,
    
    -- Version metadata
    change_summary TEXT,
    changed_by INT NOT NULL REFERENCES users(id),
    
    blockchain_hash VARCHAR(66),
    blockchain_tx_hash VARCHAR(66),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(document_id, version_number)
);

CREATE INDEX idx_document_versions_document_id ON document_versions(document_id);
CREATE INDEX idx_document_versions_version_number ON document_versions(document_id, version_number);

-- Document tags for better organization
CREATE TABLE document_tags (
    id SERIAL PRIMARY KEY,
    document_id INT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    tag_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(document_id, tag_name)
);

CREATE INDEX idx_document_tags_tag_name ON document_tags(tag_name);

-- ============================================================================
-- ACCESS CONTROL AND PERMISSIONS
-- ============================================================================

CREATE TABLE access_control (
    id SERIAL PRIMARY KEY,
    
    -- Resource being accessed
    document_id INT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    
    -- Who has access
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role user_role,
    
    -- Permission
    permission access_permission NOT NULL,
    
    -- Access validity
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by INT NOT NULL REFERENCES users(id),
    expires_at TIMESTAMP,
    
    -- Access restrictions
    max_access_count INT,  -- Limit number of accesses
    access_count INT DEFAULT 0,
    restricted_to_ip_addresses TEXT,  -- JSON array
    restricted_to_departments TEXT,  -- JSON array
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(document_id, user_id, permission)
);

CREATE INDEX idx_access_control_document_id ON access_control(document_id);
CREATE INDEX idx_access_control_user_id ON access_control(user_id);
CREATE INDEX idx_access_control_expires_at ON access_control(expires_at);

-- Access history
CREATE TABLE access_history (
    id SERIAL PRIMARY KEY,
    access_control_id INT REFERENCES access_control(id) ON DELETE SET NULL,
    document_id INT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id),
    
    action VARCHAR(50) NOT NULL,  -- view, download, etc.
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    
    CONSTRAINT action_check CHECK (action IN ('view', 'download', 'edit', 'share', 'sign'))
);

CREATE INDEX idx_access_history_document_id ON access_history(document_id);
CREATE INDEX idx_access_history_user_id ON access_history(user_id);
CREATE INDEX idx_access_history_timestamp ON access_history(timestamp);

-- ============================================================================
-- DIGITAL SIGNATURES AND NON-REPUDIATION
-- ============================================================================

CREATE TABLE digital_signatures (
    id SERIAL PRIMARY KEY,
    document_id INT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    document_version_id INT REFERENCES document_versions(id) ON DELETE SET NULL,
    
    -- Signer information
    signed_by INT NOT NULL REFERENCES users(id),
    signature_hash VARCHAR(128) NOT NULL,  -- HMAC-SHA256
    signature_algorithm VARCHAR(50) DEFAULT 'RSA-SHA256',
    
    -- Certificate information
    certificate_data TEXT,  -- X.509 certificate
    certificate_fingerprint VARCHAR(64),
    certificate_issuer VARCHAR(255),
    
    -- Timestamp and proof
    signed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    timestamp_authority VARCHAR(255),
    timestamp_proof TEXT,
    
    -- Verification
    is_valid BOOLEAN DEFAULT TRUE,
    verification_status VARCHAR(50),  -- valid, revoked, expired
    
    blockchain_verified BOOLEAN DEFAULT FALSE,
    blockchain_tx_hash VARCHAR(66),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_digital_signatures_document_id ON digital_signatures(document_id);
CREATE INDEX idx_digital_signatures_signed_by ON digital_signatures(signed_by);
CREATE INDEX idx_digital_signatures_signed_at ON digital_signatures(signed_at);

-- Signature verification log
CREATE TABLE signature_verifications (
    id SERIAL PRIMARY KEY,
    signature_id INT NOT NULL REFERENCES digital_signatures(id) ON DELETE CASCADE,
    verified_by INT REFERENCES users(id),
    
    verification_method VARCHAR(50),  -- blockchain, certificate_authority, manual
    verification_result BOOLEAN,
    verification_message TEXT,
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    blockchain_hash VARCHAR(66)
);

-- ============================================================================
-- BLOCKCHAIN INTEGRATION
-- ============================================================================

CREATE TABLE blockchain_records (
    id SERIAL PRIMARY KEY,
    
    -- Document reference
    document_id INT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    document_hash VARCHAR(64) NOT NULL,
    
    -- Blockchain transaction
    blockchain_hash VARCHAR(66) UNIQUE,  -- Keccak-256
    transaction_hash VARCHAR(66) UNIQUE,
    block_number BIGINT,
    block_timestamp BIGINT,
    
    -- Smart contract
    smart_contract_address VARCHAR(42),
    contract_function VARCHAR(100),
    contract_parameters JSONB,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',  -- pending, confirmed, failed
    confirmation_count INT DEFAULT 0,
    
    -- Verification
    verified BOOLEAN DEFAULT FALSE,
    verification_timestamp TIMESTAMP,
    tamper_detected BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blockchain_records_document_id ON blockchain_records(document_id);
CREATE INDEX idx_blockchain_records_transaction_hash ON blockchain_records(transaction_hash);
CREATE INDEX idx_blockchain_records_status ON blockchain_records(status);

-- Blockchain audit trail
CREATE TABLE blockchain_audit_trail (
    id SERIAL PRIMARY KEY,
    document_id INT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    blockchain_record_id INT REFERENCES blockchain_records(id),
    
    action VARCHAR(100) NOT NULL,
    actor_address VARCHAR(42),  -- Ethereum address
    timestamp BIGINT,
    
    previous_hash VARCHAR(66),
    new_hash VARCHAR(66),
    change_log JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_blockchain_audit_trail_document_id ON blockchain_audit_trail(document_id);

-- ============================================================================
-- AUDIT LOGGING AND COMPLIANCE
-- ============================================================================

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    
    -- Actor
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    username VARCHAR(255),
    user_role user_role,
    
    -- Action
    action audit_action NOT NULL,
    resource_type VARCHAR(50),  -- document, case, user, etc.
    resource_id INT,
    
    -- Request details
    ip_address INET,
    user_agent TEXT,
    request_id UUID DEFAULT uuid_generate_v4(),
    
    -- Changes
    change_details JSONB,
    previous_value JSONB,
    new_value JSONB,
    
    -- Blockchain
    blockchain_verified BOOLEAN DEFAULT FALSE,
    blockchain_tx_hash VARCHAR(66),
    
    -- Status
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_resource_id ON audit_logs(resource_id);

-- Time-series partitioning for audit logs (optional, for very large datasets)
-- SELECT create_hypertable('audit_logs', 'timestamp', if_not_exists => TRUE);

-- Audit trail immutability view (for Blockchain verification)
CREATE VIEW audit_logs_immutable AS
SELECT 
    id,
    user_id,
    action,
    resource_type,
    resource_id,
    timestamp,
    blockchain_verified,
    blockchain_tx_hash,
    success
FROM audit_logs
WHERE blockchain_verified = TRUE
ORDER BY timestamp;

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    notification_type VARCHAR(50) NOT NULL,  -- document_shared, access_granted, etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    related_entity_type VARCHAR(50),
    related_entity_id INT,
    
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    action_url VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================================================
-- COLLABORATION AND SHARING
-- ============================================================================

CREATE TABLE document_shares (
    id SERIAL PRIMARY KEY,
    document_id INT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    
    shared_by INT NOT NULL REFERENCES users(id),
    shared_with INT NOT NULL REFERENCES users(id),
    
    permissions TEXT,  -- JSON array of permissions
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP,
    
    share_token VARCHAR(255) UNIQUE,  -- For shareable links
    view_count INT DEFAULT 0,
    
    UNIQUE(document_id, shared_with)
);

CREATE INDEX idx_document_shares_document_id ON document_shares(document_id);
CREATE INDEX idx_document_shares_shared_with ON document_shares(shared_with);

-- ============================================================================
-- COMMENTS AND ANNOTATIONS
-- ============================================================================

CREATE TABLE document_comments (
    id SERIAL PRIMARY KEY,
    document_id INT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    
    commented_by INT NOT NULL REFERENCES users(id),
    comment_text TEXT NOT NULL,
    
    -- Threading
    parent_comment_id INT REFERENCES document_comments(id) ON DELETE CASCADE,
    
    -- Metadata
    is_approved BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_document_comments_document_id ON document_comments(document_id);
CREATE INDEX idx_document_comments_commented_by ON document_comments(commented_by);
CREATE INDEX idx_document_comments_parent_comment_id ON document_comments(parent_comment_id);

-- ============================================================================
-- DATA RETENTION AND GDPR COMPLIANCE
-- ============================================================================

CREATE TABLE data_retention_policies (
    id SERIAL PRIMARY KEY,
    
    resource_type VARCHAR(50) NOT NULL,  -- document, audit_log, etc.
    retention_days INT NOT NULL,
    delete_after_days INT,
    
    archived BOOLEAN DEFAULT FALSE,
    archive_location VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User data deletion requests (GDPR right to be forgotten)
CREATE TABLE deletion_requests (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    request_type VARCHAR(50),  -- complete_deletion, data_anonymization
    status VARCHAR(50) DEFAULT 'pending',  -- pending, approved, rejected, completed
    
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    processed_by INT REFERENCES users(id),
    
    reason TEXT,
    notes TEXT
);

CREATE INDEX idx_deletion_requests_user_id ON deletion_requests(user_id);
CREATE INDEX idx_deletion_requests_status ON deletion_requests(status);

-- ============================================================================
-- SESSION MANAGEMENT
-- ============================================================================

CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    session_token VARCHAR(500) UNIQUE NOT NULL,
    refresh_token VARCHAR(500) UNIQUE,
    
    ip_address INET,
    user_agent TEXT,
    device_name VARCHAR(255),
    
    -- Session validity
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Security
    is_active BOOLEAN DEFAULT TRUE,
    mfa_verified BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

-- ============================================================================
-- SYSTEM CONFIGURATION AND SETTINGS
-- ============================================================================

CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50),  -- string, int, boolean, json
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- VIEWS FOR ANALYTICS
-- ============================================================================

-- User activity summary
CREATE VIEW user_activity_summary AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    COUNT(DISTINCT al.id) as total_actions,
    COUNT(DISTINCT al.document_id) as documents_accessed,
    MAX(al.timestamp) as last_activity
FROM users u
LEFT JOIN audit_logs al ON u.id = al.user_id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.name, u.email, u.role;

-- Document security summary
CREATE VIEW document_security_summary AS
SELECT 
    d.id,
    d.filename,
    d.document_type,
    d.is_encrypted,
    d.is_signed,
    d.blockchain_verified,
    COUNT(DISTINCT ac.user_id) as users_with_access,
    COUNT(DISTINCT ds.id) as signature_count,
    MAX(ah.timestamp) as last_accessed
FROM documents d
LEFT JOIN access_control ac ON d.id = ac.document_id
LEFT JOIN digital_signatures ds ON d.id = ds.document_id
LEFT JOIN access_history ah ON d.id = ah.document_id
WHERE d.deleted_at IS NULL
GROUP BY d.id, d.filename, d.document_type, d.is_encrypted, d.is_signed, d.blockchain_verified;

-- Case statistics
CREATE VIEW case_statistics AS
SELECT 
    c.id,
    c.case_number,
    c.status,
    COUNT(DISTINCT d.id) as total_documents,
    COUNT(DISTINCT cp.user_id) as team_members,
    MAX(al.timestamp) as last_activity
FROM cases c
LEFT JOIN documents d ON c.id = d.case_id
LEFT JOIN case_participants cp ON c.id = cp.case_id
LEFT JOIN audit_logs al ON c.id = al.resource_id AND al.resource_type = 'case'
GROUP BY c.id, c.case_number, c.status;

-- ============================================================================
-- FUNCTIONS FOR AUTOMATION
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blockchain_records_updated_at BEFORE UPDATE ON blockchain_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
    p_user_id INT,
    p_action audit_action,
    p_resource_type VARCHAR(50),
    p_resource_id INT,
    p_ip_address INET,
    p_user_agent TEXT,
    p_change_details JSONB DEFAULT NULL
)
RETURNS BIGINT AS $$
DECLARE
    v_log_id BIGINT;
BEGIN
    INSERT INTO audit_logs (
        user_id,
        action,
        resource_type,
        resource_id,
        ip_address,
        user_agent,
        change_details,
        success
    ) VALUES (
        p_user_id,
        p_action,
        p_resource_type,
        p_resource_id,
        p_ip_address,
        p_user_agent,
        p_change_details,
        TRUE
    )
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INITIAL DATA AND CONSTRAINTS
-- ============================================================================

-- Create default departments
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    code VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO departments (name, code, description) VALUES
    ('Law Enforcement', 'LE', 'Police and law enforcement agencies'),
    ('Judiciary', 'JUD', 'Courts and judicial system'),
    ('Legal Affairs', 'LA', 'Legal and prosecution services'),
    ('Investigation', 'INV', 'Investigation departments'),
    ('Forensics', 'FOR', 'Forensic analysis and evidence'),
    ('Administrative', 'ADM', 'Administrative and support services');

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- Composite indexes for common queries
CREATE INDEX idx_documents_case_classification ON documents(case_id, classification);
CREATE INDEX idx_access_control_user_permission ON access_control(user_id, permission);
CREATE INDEX idx_audit_logs_action_timestamp ON audit_logs(action, timestamp);
CREATE INDEX idx_blockchain_records_document_status ON blockchain_records(document_id, status);

-- JSONB indexes for better query performance
CREATE INDEX idx_access_control_restrictions ON access_control USING gin(restricted_to_departments);
CREATE INDEX idx_system_settings_key ON system_settings(setting_key);

-- ============================================================================
-- GRANTS AND PERMISSIONS
-- ============================================================================

-- Create roles for different application layers
CREATE ROLE dms_app_user WITH LOGIN PASSWORD 'secure_password_here';
CREATE ROLE dms_app_admin WITH SUPERUSER;

-- Grant appropriate permissions
GRANT CONNECT ON DATABASE dms_db TO dms_app_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dms_app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dms_app_user;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
