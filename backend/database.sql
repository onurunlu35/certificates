-- Sertifikalar tablosu
CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,  -- c11 etiketi için değer
    issuer_tag VARCHAR(10) NOT NULL DEFAULT 'c11',  -- sabit etiket
    at_location VARCHAR(255) NOT NULL,  -- c12 etiketi için değer
    at_location_tag VARCHAR(10) NOT NULL DEFAULT 'c12',  -- sabit etiket
    on_date DATE NOT NULL,  -- c13 etiketi için değer
    on_date_tag VARCHAR(10) NOT NULL DEFAULT 'c13',  -- sabit etiket
    last_annual DATE,  -- c14 etiketi için değer
    last_annual_tag VARCHAR(10) NOT NULL DEFAULT 'c14',  -- sabit etiket
    expiry_date DATE NOT NULL,  -- c15 etiketi için değer
    expiry_tag VARCHAR(10) NOT NULL DEFAULT 'c15',  -- sabit etiket
    status VARCHAR(50) NOT NULL,  -- c16 etiketi için değer
    status_tag VARCHAR(10) NOT NULL DEFAULT 'c16',  -- sabit etiket
    certificate_no VARCHAR(100),  -- c17 etiketi için değer
    certificate_no_tag VARCHAR(10) NOT NULL DEFAULT 'c17',  -- sabit etiket
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sertifika dokümanları tablosu
CREATE TABLE certificate_documents (
    id SERIAL PRIMARY KEY,
    certificate_id INTEGER REFERENCES certificates(id),
    document_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Örnek veri ekleme
INSERT INTO certificates (
    type, 
    issuer,
    at_location,
    on_date,
    last_annual,
    expiry_date,
    status,
    certificate_no
) VALUES (
    'Ship Register Certificate',
    'deneme reg',
    'istanbul',
    '2024-12-28',
    '2024-12-13',
    '2025-06-28',
    'Valid',
    '-'
);