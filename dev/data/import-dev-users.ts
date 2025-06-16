/**
 * Script to import development users into MongoDB
 * Run this script from your project root directory
 * 
 * Usage: npx tsx import-dev-users.ts
 */

import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../../server/models/User.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importUsers() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.NUXT_MONGODB_URI || 'mongodb://localhost:27017/nuxtclimbwithme';

    await mongoose.connect(mongoUri, {
      dbName: 'development'
    });
    console.log('Connected to MongoDB');

    // Read the users data
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'dev-users.json'), 'utf8'));

    console.log(`Found ${usersData.length} users to import`);

    // Clear existing dev users (optional - be careful with this in production!)
    await User.deleteMany({ authId: { $regex: /^auth0\|user\d+$/ } });
    console.log('Cleared existing dev users');

    // Insert new users
    const result = await User.insertMany(usersData);
    console.log(`Successfully imported ${result.length} users`);

    // Display summary
    const summary = usersData.reduce((acc: Record<string, number>, user: any) => {
      user.climbingExperience.disciplines.forEach((discipline: any) => {
        acc[discipline.name] = (acc[discipline.name] || 0) + 1;
      });
      return acc;
    }, {});

    console.log('\nClimbing disciplines summary:');
    Object.entries(summary).forEach(([discipline, count]) => {
      console.log(`  ${discipline}: ${count} users`);
    });

    console.log('\nUsers imported successfully!');

  } catch (error) {
    console.error('Error importing users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the import
importUsers().catch(console.error);
