-- Membuat enum yang dibutuhkan
CREATE TYPE user_role as ENUM ('admin', 'trainer', 'member');

-- Membuat tabel users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role user_role NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255),
    email VARCHAR(100) UNIQUE NOT NULL,
    provider VARCHAR(20),
    provider_id VARCHAR(100),
    avatar TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR(100) NOT NULL,
    phone_no VARCHAR(15) UNIQUE,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Membuat tabel events
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL DEFAULT 'Event Title',
    images TEXT NOT NULL DEFAULT '',
    description VARCHAR(200) DEFAULT 'Description here',
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    joinform TEXT DEFAULT 'https://example.com/join-form'
);

-- Membuat tabel liked_by
CREATE TABLE liked_by (
    id SERIAL PRIMARY KEY,
    u_id INT NOT NULL,
    e_id INT NOT NULL,
    FOREIGN KEY (u_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (e_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Membuat tabel trained_by
CREATE TABLE trained_by (
    trainer_id INT NOT NULL,
    member_id INT NOT NULL,
    stat1 INT,
    stat2 INT,
    stat3 INT,
    stat4 INT,
    stat5 INT,
    PRIMARY KEY (trainer_id, member_id),
    FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Membuat tabel training_assignments
CREATE TABLE training_assignments (
    id SERIAL PRIMARY KEY,
    trainer_id INT NOT NULL,
    member_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES users(id) ON UPDATE NO ACTION,
    FOREIGN KEY (member_id) REFERENCES users(id) ON UPDATE NO ACTION
);