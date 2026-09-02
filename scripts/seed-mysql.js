try {
  require('dotenv').config();
} catch (e) {
  // dotenv optional
}
const mysql = require('mysql2/promise');

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Blackora Royal Chronograph Matte Gold',
    slug: 'blackora-royal-chronograph-matte-gold',
    tagline: 'Precision dual-dial chronograph with obsidian black accents',
    description: 'Engineered for distinction. The Royal Chronograph Matte Gold features a multi-layered obsidian dial framed by surgical-grade brushed gold stainless steel. Equipped with Japanese precision quartz movement and sapphire crystal glass.',
    category: 'men',
    price: 4999,
    originalPrice: 7999,
    stock: 24,
    commissionAmount: 350,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop'
    ]),
    specs: JSON.stringify({
      caseDiameter: '42 mm',
      caseThickness: '11 mm',
      dialColor: 'Obsidian Black / Gold',
      movement: 'Japanese Quartz Chronograph',
      strapMaterial: '316L Solid Stainless Steel',
      waterResistance: '5 ATM (50 Meters)',
      glassType: 'Scratch-Resistant Sapphire Crystal'
    }),
    featured: 1,
    bestSeller: 1,
    isNewArrival: 0,
    rating: 4.9,
    reviewCount: 42
  },
  {
    id: 'prod-2',
    name: 'Blackora Obsidian Skeleton Automatic',
    slug: 'blackora-obsidian-skeleton-automatic',
    tagline: 'Self-winding mechanical masterpiece with exhibition caseback',
    description: 'An open-heart tour de force. Witness every mechanical gear in motion with the Obsidian Skeleton Automatic. Featuring 21 jewels automatic movement, 40-hour power reserve, and an ergonomic leather strap with contrast gold stitching.',
    category: 'men',
    price: 6499,
    originalPrice: 9999,
    stock: 18,
    commissionAmount: 450,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop'
    ]),
    specs: JSON.stringify({
      caseDiameter: '43 mm',
      caseThickness: '13 mm',
      dialColor: 'Open-work Skeleton Black',
      movement: '21-Jewels Self-Winding Automatic',
      strapMaterial: 'Hand-stitched Genuine Italian Leather',
      waterResistance: '5 ATM (50 Meters)',
      glassType: 'Domed Sapphire Crystal'
    }),
    featured: 1,
    bestSeller: 1,
    isNewArrival: 1,
    rating: 5.0,
    reviewCount: 38
  },
  {
    id: 'prod-3',
    name: 'Blackora Emerald Sunburst Monarch',
    slug: 'blackora-emerald-sunburst-monarch',
    tagline: 'Deep emerald radiant dial with fluted bezel & jubilee bracelet',
    description: 'A striking statement of status. The Emerald Sunburst Monarch reflects light across its rich green lacquer dial, complemented by Roman numeral indices and a magnified date cyclops lens.',
    category: 'men',
    price: 4299,
    originalPrice: 6499,
    stock: 30,
    commissionAmount: 300,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop'
    ]),
    specs: JSON.stringify({
      caseDiameter: '40 mm',
      caseThickness: '10.5 mm',
      dialColor: 'Deep Emerald Sunburst',
      movement: 'High-Precision Japanese Quartz',
      strapMaterial: 'Dual-Tone Jubilee Stainless Steel',
      waterResistance: '3 ATM (30 Meters)',
      glassType: 'Hardened Mineral Crystal with Cyclops'
    }),
    featured: 1,
    bestSeller: 0,
    isNewArrival: 1,
    rating: 4.8,
    reviewCount: 29
  },
  {
    id: 'prod-4',
    name: 'Blackora Aurora Diamond Petite (Rose Gold)',
    slug: 'blackora-aurora-diamond-petite-rose-gold',
    tagline: 'Delicate mother of pearl dial framed in sparkling baguette crystals',
    description: 'Designed exclusively for the modern woman of grace. The Aurora Diamond Petite features an iridescent mother-of-pearl dial with diamond-cut crystal hour markers and a slender rose-gold Milanese mesh strap.',
    category: 'women',
    price: 3899,
    originalPrice: 5999,
    stock: 25,
    commissionAmount: 250,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop'
    ]),
    specs: JSON.stringify({
      caseDiameter: '32 mm',
      caseThickness: '7.5 mm',
      dialColor: 'Natural Mother of Pearl',
      movement: 'Swiss-Caliber Slim Quartz',
      strapMaterial: 'Premium Rose Gold Milanese Mesh',
      waterResistance: '3 ATM (30 Meters)',
      glassType: 'Anti-Reflective Mineral Crystal'
    }),
    featured: 1,
    bestSeller: 1,
    isNewArrival: 0,
    rating: 4.9,
    reviewCount: 56
  },
  {
    id: 'prod-5',
    name: 'Blackora Celestial Starlight Velvet Black',
    slug: 'blackora-celestial-starlight-velvet-black',
    tagline: 'Glittering aventurine galaxy dial with midnight ceramic links',
    description: 'Capture the cosmos on your wrist. The Celestial Starlight dazzles with its starry aventurine glass dial that glimmers with every angle of light. Finished with ultra-smooth scratch-proof midnight black ceramic links.',
    category: 'women',
    price: 4499,
    originalPrice: 6999,
    stock: 15,
    commissionAmount: 300,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=1000&auto=format&fit=crop'
    ]),
    specs: JSON.stringify({
      caseDiameter: '34 mm',
      caseThickness: '8 mm',
      dialColor: 'Aventurine Starlight Midnight',
      movement: 'Precision Japanese Quartz',
      strapMaterial: 'High-Tech Gloss Ceramic & Steel',
      waterResistance: '3 ATM (30 Meters)',
      glassType: 'Sapphire Crystal Glass'
    }),
    featured: 1,
    bestSeller: 0,
    isNewArrival: 1,
    rating: 5.0,
    reviewCount: 31
  },
  {
    id: 'prod-6',
    name: 'Blackora Stealth Nocturne All-Black Minimalist',
    slug: 'blackora-stealth-nocturne-all-black-minimalist',
    tagline: 'Ultra-slim matte black profile with stealth luminescent indices',
    description: 'Pure understated luxury. At only 6.8mm thin, the Stealth Nocturne slides seamlessly under any cuff. Features a brushed gunmetal casing, sapphire glass, and a quick-release magnetic clasp strap.',
    category: 'men',
    price: 3699,
    originalPrice: 5499,
    stock: 40,
    commissionAmount: 250,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000&auto=format&fit=crop'
    ]),
    specs: JSON.stringify({
      caseDiameter: '41 mm',
      caseThickness: '6.8 mm',
      dialColor: 'Matte Jet Black',
      movement: 'Miyota Ultra-Slim Quartz',
      strapMaterial: 'Matte PVD Coated Mesh',
      waterResistance: '3 ATM (30 Meters)',
      glassType: 'Sapphire Crystal'
    }),
    featured: 0,
    bestSeller: 1,
    isNewArrival: 0,
    rating: 4.7,
    reviewCount: 64
  }
];

async function seedMySQL() {
  const dbUrl = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/blackora';
  console.log('Connecting to MySQL database:', dbUrl);

  const connection = await mysql.createConnection(dbUrl);

  try {
    // 1. Create Products Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(191) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        tagline TEXT NULL,
        description TEXT NULL,
        category VARCHAR(50) NOT NULL DEFAULT 'men',
        price DECIMAL(10, 2) NOT NULL,
        originalPrice DECIMAL(10, 2) NULL,
        stock INT NOT NULL DEFAULT 0,
        commissionAmount DECIMAL(10, 2) NOT NULL DEFAULT 200.00,
        images LONGTEXT NOT NULL,
        specs LONGTEXT NULL,
        featured BOOLEAN NOT NULL DEFAULT FALSE,
        bestSeller BOOLEAN NOT NULL DEFAULT FALSE,
        isNewArrival BOOLEAN NOT NULL DEFAULT FALSE,
        rating DECIMAL(3, 1) NOT NULL DEFAULT 5.0,
        reviewCount INT NOT NULL DEFAULT 0,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 2. Create Users Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(191) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        passwordHash VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'customer',
        referralCode VARCHAR(50) NOT NULL UNIQUE,
        isSeller BOOLEAN NOT NULL DEFAULT FALSE,
        walletBalance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        pendingBalance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        totalEarned DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 3. Create Orders Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(191) PRIMARY KEY,
        orderNumber VARCHAR(50) NOT NULL UNIQUE,
        userId VARCHAR(191) NULL,
        customerName VARCHAR(255) NOT NULL,
        customerEmail VARCHAR(255) NOT NULL,
        customerPhone VARCHAR(50) NOT NULL,
        city VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        postalCode VARCHAR(20) NULL,
        notes TEXT NULL,
        items LONGTEXT NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        deliveryCharge DECIMAL(10, 2) NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        paymentMethod VARCHAR(50) NOT NULL DEFAULT 'cod',
        paymentStatus VARCHAR(50) NOT NULL DEFAULT 'pending_verification',
        transactionId VARCHAR(255) NULL,
        referralCodeUsed VARCHAR(50) NULL,
        referrerUserId VARCHAR(191) NULL,
        totalCommissionEarned DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        commissionPaid BOOLEAN NOT NULL DEFAULT FALSE,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        statusHistory LONGTEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 4. Create Withdrawals Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS withdrawals (
        id VARCHAR(191) PRIMARY KEY,
        userId VARCHAR(191) NOT NULL,
        userName VARCHAR(255) NOT NULL,
        userEmail VARCHAR(255) NOT NULL,
        userPhone VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        paymentMethod VARCHAR(50) NOT NULL,
        accountTitle VARCHAR(255) NOT NULL,
        accountNumber VARCHAR(100) NOT NULL,
        bankName VARCHAR(100) NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        adminNote TEXT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        processedAt DATETIME NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // 5. Create Settings Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
        storeName VARCHAR(255) NOT NULL DEFAULT 'Blackora',
        storeTagline TEXT NULL,
        currency VARCHAR(10) NOT NULL DEFAULT 'Rs.',
        deliveryFee DECIMAL(10, 2) NOT NULL DEFAULT 250.00,
        freeDeliveryThreshold DECIMAL(10, 2) NOT NULL DEFAULT 5000.00,
        defaultReferralReward DECIMAL(10, 2) NOT NULL DEFAULT 200.00,
        easyPaisaAccountTitle VARCHAR(255) NOT NULL DEFAULT 'Shumaila Kausar',
        easyPaisaAccountNumber VARCHAR(50) NOT NULL DEFAULT '03486611494',
        jazzCashAccountTitle VARCHAR(255) NOT NULL DEFAULT 'Shumaila Kausar',
        jazzCashAccountNumber VARCHAR(50) NOT NULL DEFAULT '03284217256',
        supportPhone VARCHAR(50) NOT NULL DEFAULT '+92 300 1234567',
        supportEmail VARCHAR(255) NOT NULL DEFAULT 'support@blackora.com',
        supportWhatsapp VARCHAR(50) NOT NULL DEFAULT '+92 300 1234567',
        adminUsername VARCHAR(100) NOT NULL DEFAULT 'admin',
        adminPassword VARCHAR(255) NOT NULL DEFAULT 'admin123',
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    console.log('✓ All MySQL tables created/verified!');

    // Insert Initial Products into MySQL
    for (const p of INITIAL_PRODUCTS) {
      await connection.query(`
        INSERT INTO products (id, name, slug, tagline, description, category, price, originalPrice, stock, commissionAmount, images, specs, featured, bestSeller, isNewArrival, rating, reviewCount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), stock=VALUES(stock), commissionAmount=VALUES(commissionAmount);
      `, [
        p.id, p.name, p.slug, p.tagline, p.description, p.category, p.price, p.originalPrice, p.stock, p.commissionAmount, p.images, p.specs, p.featured, p.bestSeller, p.isNewArrival, p.rating, p.reviewCount
      ]);
    }
    console.log(`✓ Inserted/Updated ${INITIAL_PRODUCTS.length} luxury watch products directly into MySQL 'products' table!`);

    // Insert Admin User into MySQL
    await connection.query(`
      INSERT INTO users (id, name, email, passwordHash, phone, role, referralCode, isSeller, walletBalance, pendingBalance, totalEarned)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE passwordHash=VALUES(passwordHash);
    `, [
      'user-admin-1', 'Blackora Admin', 'admin@blackora.com', 'admin123', '03071468568', 'admin', 'BLK-ADMIN01', 1, 0, 0, 0
    ]);

    // Insert Sample Seller into MySQL 
    await connection.query(`
      INSERT INTO users (id, name, email, passwordHash, phone, role, referralCode, isSeller, walletBalance, pendingBalance, totalEarned)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE referralCode=VALUES(referralCode);
    `, [
      'user-seller-1', 'Hamza Khan', 'hamza@example.com', 'password123', '03123456789', 'customer', 'BLK-HAMZA77', 1, 600, 200, 1000
    ]);
    console.log('✓ Inserted Admin and Seller users into MySQL users table!');

    // Insert Default Settings into MySQL
    await connection.query(`
      INSERT INTO settings (id, storeName, storeTagline, currency, deliveryFee, freeDeliveryThreshold, defaultReferralReward, easyPaisaAccountTitle, easyPaisaAccountNumber, jazzCashAccountTitle, jazzCashAccountNumber, supportPhone, supportEmail, supportWhatsapp, adminUsername, adminPassword)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE easyPaisaAccountTitle=VALUES(easyPaisaAccountTitle), easyPaisaAccountNumber=VALUES(easyPaisaAccountNumber), jazzCashAccountTitle=VALUES(jazzCashAccountTitle), jazzCashAccountNumber=VALUES(jazzCashAccountNumber);
    `, [
      'default', 'Blackora', 'Timeless Elegance & Precision Luxury Timepieces', 'Rs.', 250, 5000, 200,
      'Shumaila Kausar', '03486611494', 'Shumaila Kausar', '03284217256',
      '+92 300 1234567', 'support@blackora.com', '+92 300 1234567', 'admin', 'admin123'
    ]);
    console.log('✓ Inserted Store Settings into MySQL settings table!');

  } catch (err) {
    console.error('Error during MySQL seed:', err);
  } finally {
    await connection.end();
  }
}

seedMySQL();
