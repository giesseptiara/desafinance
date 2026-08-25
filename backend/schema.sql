-- ============================================
-- DesaFinance Database Schema
-- ============================================

-- USERS / ADMIN
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PROFIL DESA
CREATE TABLE IF NOT EXISTS desa_profile (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50),
    address TEXT,
    village_head VARCHAR(100),
    phone VARCHAR(30),
    email VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ANGGARAN
CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    year INTEGER NOT NULL,
    name VARCHAR(150) NOT NULL,
    total_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- KATEGORI PENDAPATAN
CREATE TABLE IF NOT EXISTS income_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- PENDAPATAN
CREATE TABLE IF NOT EXISTS incomes (
    id SERIAL PRIMARY KEY,
    budget_id INTEGER REFERENCES budgets(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES income_categories(id) ON DELETE SET NULL,
    amount NUMERIC(15,2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- KATEGORI BELANJA
CREATE TABLE IF NOT EXISTS expense_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- BELANJA
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    budget_id INTEGER REFERENCES budgets(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES expense_categories(id) ON DELETE SET NULL,
    amount NUMERIC(15,2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEX
-- ============================================

CREATE INDEX IF NOT EXISTS idx_budgets_year
ON budgets(year);

CREATE INDEX IF NOT EXISTS idx_incomes_budget
ON incomes(budget_id);

CREATE INDEX IF NOT EXISTS idx_incomes_date
ON incomes(transaction_date);

CREATE INDEX IF NOT EXISTS idx_expenses_budget
ON expenses(budget_id);

CREATE INDEX IF NOT EXISTS idx_expenses_date
ON expenses(transaction_date);