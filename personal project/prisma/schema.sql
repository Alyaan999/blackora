-- Blackora MySQL Database Schema
CREATE DATABASE IF NOT EXISTS `blackora` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `blackora`;

-- Table: products
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `tagline` TEXT NULL,
  `description` TEXT NULL,
  `category` ENUM('men', 'women', 'unisex') NOT NULL DEFAULT 'men',
  `price` DECIMAL(10, 2) NOT NULL,
  `originalPrice` DECIMAL(10, 2) NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `commissionAmount` DECIMAL(10, 2) NOT NULL DEFAULT 200.00,
  `images` LONGTEXT NOT NULL,
  `specs` LONGTEXT NULL,
  `featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `bestSeller` BOOLEAN NOT NULL DEFAULT FALSE,
  `isNewArrival` BOOLEAN NOT NULL DEFAULT FALSE,
  `rating` DECIMAL(3, 1) NOT NULL DEFAULT 5.0,
  `reviewCount` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: users
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `passwordHash` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `role` ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  `referralCode` VARCHAR(50) NOT NULL UNIQUE,
  `isSeller` BOOLEAN NOT NULL DEFAULT FALSE,
  `walletBalance` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `pendingBalance` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `totalEarned` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `orderNumber` VARCHAR(50) NOT NULL UNIQUE,
  `userId` VARCHAR(191) NULL,
  `customerName` VARCHAR(255) NOT NULL,
  `customerEmail` VARCHAR(255) NOT NULL,
  `customerPhone` VARCHAR(50) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `address` TEXT NOT NULL,
  `postalCode` VARCHAR(20) NULL,
  `notes` TEXT NULL,
  `items` LONGTEXT NOT NULL,
  `subtotal` DECIMAL(10, 2) NOT NULL,
  `deliveryCharge` DECIMAL(10, 2) NOT NULL,
  `total` DECIMAL(10, 2) NOT NULL,
  `paymentMethod` ENUM('cod', 'easypaisa', 'jazzcash') NOT NULL DEFAULT 'cod',
  `paymentStatus` ENUM('pending_verification', 'approved', 'paid', 'rejected') NOT NULL DEFAULT 'pending_verification',
  `transactionId` VARCHAR(255) NULL,
  `referralCodeUsed` VARCHAR(50) NULL,
  `referrerUserId` VARCHAR(191) NULL,
  `totalCommissionEarned` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `commissionPaid` BOOLEAN NOT NULL DEFAULT FALSE,
  `status` ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  `statusHistory` LONGTEXT NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: withdrawals
CREATE TABLE IF NOT EXISTS `withdrawals` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(191) NOT NULL,
  `userName` VARCHAR(255) NOT NULL,
  `userEmail` VARCHAR(255) NOT NULL,
  `userPhone` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `paymentMethod` ENUM('easypaisa', 'jazzcash', 'bank_transfer') NOT NULL,
  `accountTitle` VARCHAR(255) NOT NULL,
  `accountNumber` VARCHAR(100) NOT NULL,
  `bankName` VARCHAR(100) NULL,
  `status` ENUM('pending', 'processing', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `adminNote` TEXT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `processedAt` DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: settings
CREATE TABLE IF NOT EXISTS `settings` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY DEFAULT 'default',
  `storeName` VARCHAR(255) NOT NULL DEFAULT 'Blackora',
  `storeTagline` TEXT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'Rs.',
  `deliveryFee` DECIMAL(10, 2) NOT NULL DEFAULT 250.00,
  `freeDeliveryThreshold` DECIMAL(10, 2) NOT NULL DEFAULT 5000.00,
  `defaultReferralReward` DECIMAL(10, 2) NOT NULL DEFAULT 200.00,
  `easyPaisaAccountTitle` VARCHAR(255) NOT NULL DEFAULT 'Shumaila Kausar',
  `easyPaisaAccountNumber` VARCHAR(50) NOT NULL DEFAULT '03486611494',
  `jazzCashAccountTitle` VARCHAR(255) NOT NULL DEFAULT 'Shumaila Kausar',
  `jazzCashAccountNumber` VARCHAR(50) NOT NULL DEFAULT '03284217256',
  `supportPhone` VARCHAR(50) NOT NULL DEFAULT '+92 300 1234567',
  `supportEmail` VARCHAR(255) NOT NULL DEFAULT 'support@blackora.com',
  `supportWhatsapp` VARCHAR(50) NOT NULL DEFAULT '+92 300 1234567',
  `adminUsername` VARCHAR(100) NOT NULL DEFAULT 'admin',
  `adminPassword` VARCHAR(255) NOT NULL DEFAULT 'admin123',
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: support_messages
CREATE TABLE IF NOT EXISTS `support_messages` (
  `id` VARCHAR(191) NOT NULL PRIMARY KEY,
  `userId` VARCHAR(191) NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  `adminReply` TEXT NULL,
  `repliedAt` DATETIME NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

