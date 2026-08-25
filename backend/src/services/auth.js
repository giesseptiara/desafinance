const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

async function login(email, password) {
    const result = await pool.query(
        `
        SELECT id, name, email, password_hash, role
        FROM users
        WHERE email = $1
        LIMIT 1
        `,
        [email]
    );

    if (result.rows.length === 0) {
        throw new Error('Email atau password salah');
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatch) {
        throw new Error('Email atau password salah');
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}

module.exports = {
    login
};