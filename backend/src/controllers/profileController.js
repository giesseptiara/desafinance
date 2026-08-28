const pool = require('../config/database');

async function getProfile(req, res) {
    try {
        const result = await pool.query(`
            SELECT
                id,
                name,
                code,
                address,
                village_head,
                phone,
                email,
                created_at,
                updated_at
            FROM desa_profile
            ORDER BY id ASC
            LIMIT 1
        `);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Village profile not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Get profile error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to get village profile'
        });
    }
}

async function updateProfile(req, res) {
    try {
        const {
            name,
            code,
            address,
            village_head,
            phone,
            email
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Village name is required'
            });
        }

        const existing = await pool.query(`
            SELECT id
            FROM desa_profile
            ORDER BY id ASC
            LIMIT 1
        `);

        if (existing.rows.length === 0) {
            const result = await pool.query(`
                INSERT INTO desa_profile
                    (
                        name,
                        code,
                        address,
                        village_head,
                        phone,
                        email
                    )
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `, [
                name,
                code || null,
                address || null,
                village_head || null,
                phone || null,
                email || null
            ]);

            return res.status(201).json({
                success: true,
                message: 'Village profile created successfully',
                data: result.rows[0]
            });
        }

        const profileId = existing.rows[0].id;

        const result = await pool.query(`
            UPDATE desa_profile
            SET
                name = $1,
                code = $2,
                address = $3,
                village_head = $4,
                phone = $5,
                email = $6,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $7
            RETURNING *
        `, [
            name,
            code || null,
            address || null,
            village_head || null,
            phone || null,
            email || null,
            profileId
        ]);

        res.json({
            success: true,
            message: 'Village profile updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update profile error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to update village profile'
        });
    }
}

module.exports = {
    getProfile,
    updateProfile
};