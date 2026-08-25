require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('neon.tech')
        ? { rejectUnauthorized: false }
        : false
});

async function seed() {
    const client = await pool.connect();

    try {
        console.log('🌱 Starting database seed...');

        await client.query('BEGIN');

        // Admin
        const bcrypt = require('bcrypt');

        const passwordHash = await bcrypt.hash('admin123', 10);

        await client.query(`
            INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING
        `, [
            'Administrator Desa',
            'admin@desafinance.com',
            passwordHash,
            'admin'
        ]);

        // Profil Desa
        await client.query(`
            INSERT INTO desa_profile
                (name, code, address, village_head, phone, email)
            VALUES
                ($1, $2, $3, $4, $5, $6)
        `, [
            'Desa Sukamaju',
            'DESA-001',
            'Jl. Raya Sukamaju No. 10',
            'Budi Santoso',
            '081234567890',
            'desa.sukamaju@example.com'
        ]);

        // Anggaran
        const budgetResult = await client.query(`
            INSERT INTO budgets
                (year, name, total_amount, description)
            VALUES
                ($1, $2, $3, $4)
            RETURNING id
        `, [
            2026,
            'Anggaran Desa Tahun 2026',
            1000000000,
            'Anggaran Pendapatan dan Belanja Desa Tahun 2026'
        ]);

        const budgetId = budgetResult.rows[0].id;

        // Kategori Pendapatan
        const incomeCategories = [
            ['Dana Desa', 'Dana Desa dari pemerintah pusat'],
            ['Alokasi Dana Desa', 'Alokasi dana dari pemerintah daerah'],
            ['Pendapatan Asli Desa', 'Pendapatan asli desa'],
            ['Pendapatan Lainnya', 'Sumber pendapatan lainnya']
        ];

        for (const [name, description] of incomeCategories) {
            await client.query(`
                INSERT INTO income_categories (name, description)
                VALUES ($1, $2)
                ON CONFLICT (name) DO NOTHING
            `, [name, description]);
        }

        // Kategori Belanja
        const expenseCategories = [
            ['Pemerintahan Desa', 'Belanja penyelenggaraan pemerintahan desa'],
            ['Pembangunan Desa', 'Belanja pembangunan infrastruktur desa'],
            ['Pembinaan Masyarakat', 'Belanja pembinaan masyarakat'],
            ['Pemberdayaan Masyarakat', 'Belanja pemberdayaan masyarakat'],
            ['Penanggulangan Bencana', 'Belanja keadaan darurat dan bencana']
        ];

        for (const [name, description] of expenseCategories) {
            await client.query(`
                INSERT INTO expense_categories (name, description)
                VALUES ($1, $2)
                ON CONFLICT (name) DO NOTHING
            `, [name, description]);
        }

        // Ambil kategori
        const incomeCategory = await client.query(`
            SELECT id FROM income_categories
            WHERE name = 'Dana Desa'
            LIMIT 1
        `);

        const expenseCategory = await client.query(`
            SELECT id FROM expense_categories
            WHERE name = 'Pembangunan Desa'
            LIMIT 1
        `);

        // Pendapatan
        await client.query(`
            INSERT INTO incomes
                (budget_id, category_id, amount, description, transaction_date)
            VALUES
                ($1, $2, $3, $4, $5)
        `, [
            budgetId,
            incomeCategory.rows[0].id,
            950000000,
            'Dana Desa Tahun Anggaran 2026',
            '2026-01-15'
        ]);

        // Belanja
        await client.query(`
            INSERT INTO expenses
                (budget_id, category_id, amount, description, transaction_date)
            VALUES
                ($1, $2, $3, $4, $5)
        `, [
            budgetId,
            expenseCategory.rows[0].id,
            250000000,
            'Pembangunan jalan desa',
            '2026-03-10'
        ]);

        await client.query(`
            INSERT INTO expenses
                (budget_id, category_id, amount, description, transaction_date)
            VALUES
                ($1, $2, $3, $4, $5)
        `, [
            budgetId,
            expenseCategory.rows[0].id,
            150000000,
            'Pembangunan fasilitas umum',
            '2026-05-20'
        ]);

        await client.query('COMMIT');

        console.log('✅ Database seed completed successfully.');
        console.log('');
        console.log('Admin login:');
        console.log('Email    : admin@desafinance.com');
        console.log('Password : admin123');

    } catch (error) {
        await client.query('ROLLBACK');

        console.error('❌ Seed failed:');
        console.error(error);

        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
}

seed();