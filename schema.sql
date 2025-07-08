-- 1. Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255),
  role ENUM('reader', 'author') NOT NULL DEFAULT 'reader',
  pen_name VARCHAR(100) DEFAULT NULL,
  coins INT DEFAULT 0,

  provider ENUM('local', 'google', 'facebook') DEFAULT 'local',
  provider_id VARCHAR(255),
  avatar_url VARCHAR(255),

  status ENUM('active', 'disabled') NOT NULL DEFAULT 'active',  -- เพิ่มสถานะ

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);



-- 2. Books table
CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_url VARCHAR(255),
  category VARCHAR(100),
  author_id INT NOT NULL,
  price_per_chapter INT DEFAULT 1,
  release_date DATE,
  status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
);


-- 3. Chapters table
CREATE TABLE chapters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  title VARCHAR(255),
  content_text LONGTEXT,
  audio_url VARCHAR(255),
  release_date DATE,
  price INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id)
);

-- 4. Unlocks table
CREATE TABLE unlocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  chapter_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);

-- 5. Ratings table
CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

-- 6. Bookmarks table
CREATE TABLE bookmarks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);

-- 7. Daily Logins table
CREATE TABLE daily_logins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  last_claimed_date DATE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 8. Audio Tasks table (optional, for Botnoi TTS)
CREATE TABLE audio_tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  chapter_id INT NOT NULL,
  status ENUM('pending', 'processing', 'done', 'error') DEFAULT 'pending',
  audio_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id)
);
