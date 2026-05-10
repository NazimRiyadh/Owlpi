import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load config
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/api_monitoring_system';

// Import actual models if possible, or define full schemas
// To be safe and independent of relative path issues in seed scripts, I will define the schemas here accurately.

const ClientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, collection: 'clients' });

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, collection: 'users' });

const ApiKeySchema = new mongoose.Schema({
  keyId: { type: String, required: true, unique: true },
  keyValue: { type: String, required: true, unique: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true }
}, { timestamps: true, collection: 'api_keys' });

const Client = mongoose.model('Client', ClientSchema);
const User = mongoose.model('User', UserSchema);
const ApiKey = mongoose.model('ApiKey', ApiKeySchema);

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data to avoid conflicts
    await Client.deleteMany({});
    await User.deleteMany({});
    await ApiKey.deleteMany({});
    console.log('Cleared existing collections');

    // 1. Create a Super Admin
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const superAdmin = await User.create({
      username: 'root_admin',
      email: 'admin@owlpi.app',
      password: hashedAdminPassword,
      role: 'super_admin',
      isActive: true
    });
    console.log('Created Super Admin: root_admin');

    // 2. Create a Test Client
    const client = await Client.create({
      name: 'Owlpi Test Labs',
      slug: 'owlpi-test-labs',
      email: 'labs@owlpi.app',
      createdBy: superAdmin._id,
      isActive: true
    });
    console.log('Created Client: Owlpi Test Labs');

    // 3. Create a Client Admin
    const hashedUserPassword = await bcrypt.hash('user123', 10);
    const clientAdmin = await User.create({
      username: 'test_user',
      email: 'test@owlpi.app',
      password: hashedUserPassword,
      role: 'client_admin',
      clientId: client._id,
      isActive: true
    });
    console.log('Created Client Admin: test_user');

    // 4. Create an API Key
    const keyValue = 'apim_' + crypto.randomBytes(24).toString('hex');
    const keyId = crypto.randomBytes(8).toString('hex');
    
    await ApiKey.create({
      keyId: keyId,
      keyValue: keyValue,
      clientId: client._id,
      name: 'Default Development Key',
      createdBy: clientAdmin._id,
      isActive: true
    });

    console.log('\n' + '='.repeat(50));
    console.log('🚀 SEEDING SUCCESSFUL');
    console.log('='.repeat(50));
    console.log('Super Admin: root_admin / admin123');
    console.log('Client Admin: test_user / user123');
    console.log('Organization: Owlpi Test Labs');
    console.log('API KEY: ' + keyValue);
    console.log('='.repeat(50) + '\n');

    await mongoose.disconnect();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
