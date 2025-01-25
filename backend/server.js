const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Sabit sertifika sıralaması
const CERTIFICATE_ORDER = [
    'Certificate of Registry',
    'International Tonnage Certificate',
    'Certificate of Survey',
    'Continuous Synopsis Record (CSR)',
    'Document of Compliance (DOC)',
    'Safety Management Certificate (SMC)',
    'International Ship Security Certificate (ISSC)',
    'Maritime Labour Certificate (MLC)',
    'P&I - MLC compliance certificates',
    'Cargo Ship Safety Radio',
    'Record of Safety Radio (Form R)',
    'Cargo Ship Safety Construction'
];

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Check if user exists
        const userCheck = await pool.query(
            'SELECT * FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const result = await pool.query(
            'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, hashedPassword, email]
        );

        // Generate token
        const token = jwt.sign(
            { id: result.rows[0].id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({ 
            user: result.rows[0],
            token 
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, result.rows[0].password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { id: result.rows[0].id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            user: {
                id: result.rows[0].id,
                username: result.rows[0].username,
                email: result.rows[0].email
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Protected Routes
app.get('/api/certificates', auth, async (req, res) => {
    try {
        const orderCaseQuery = CERTIFICATE_ORDER.map((cert, index) => 
            `WHEN type = '${cert}' THEN ${index}`
        ).join(' ');

        const result = await pool.query(`
            SELECT * FROM certificates 
            ORDER BY 
                CASE 
                    ${orderCaseQuery}
                    ELSE ${CERTIFICATE_ORDER.length}
                END
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Public Routes
app.get('/api/certificates/public', async (req, res) => {
    try {
        const orderCaseQuery = CERTIFICATE_ORDER.map((cert, index) => 
            `WHEN type = '${cert}' THEN ${index}`
        ).join(' ');

        const result = await pool.query(`
            SELECT * FROM certificates 
            ORDER BY 
                CASE 
                    ${orderCaseQuery}
                    ELSE ${CERTIFICATE_ORDER.length}
                END
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/certificates/public/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            issuer,
            at_location,
            on_date,
            last_annual,
            expiry_date,
            certificate_no
        } = req.body;

        const result = await pool.query(
            `UPDATE certificates 
             SET issuer = $1, 
                 at_location = $2, 
                 on_date = $3, 
                 last_annual = $4, 
                 expiry_date = $5, 
                 certificate_no = $6,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $7
             RETURNING *`,
            [issuer, at_location, on_date, last_annual, expiry_date, certificate_no, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Certificate not found' });
        }

        // Güncellenmiş sertifikayı sıralı listede doğru konumda döndür
        const orderCaseQuery = CERTIFICATE_ORDER.map((cert, index) => 
            `WHEN type = '${cert}' THEN ${index}`
        ).join(' ');

        const updatedResult = await pool.query(`
            SELECT * FROM certificates 
            ORDER BY 
                CASE 
                    ${orderCaseQuery}
                    ELSE ${CERTIFICATE_ORDER.length}
                END
        `);

        res.json(updatedResult.rows);
    } catch (error) {
        console.error('Error updating certificate:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});