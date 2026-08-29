import { db } from './index.js';
import { users, shops } from './schema.js';
import { hashPassword } from '../utils/hash.js';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding default users into PostgreSQL database...');

  const passwordHash = await hashPassword('password123');

  const defaultUsers = [
    {
      name: 'Demo Customer',
      email: 'customer@docprint.io',
      passwordHash,
      role: 'CUSTOMER' as const,
      phone: '+91 98765 43210',
    },
    {
      name: 'Demo Shop Owner',
      email: 'shopowner@docprint.io',
      passwordHash,
      role: 'SHOP_OWNER' as const,
      phone: '+91 98765 43211',
    },
    {
      name: 'Demo Delivery Partner',
      email: 'delivery@docprint.io',
      passwordHash,
      role: 'DELIVERY_PARTNER' as const,
      phone: '+91 98765 43212',
    },
    {
      name: 'Demo Admin',
      email: 'admin@docprint.io',
      passwordHash,
      role: 'ADMIN' as const,
      phone: '+91 98765 43213',
    },
  ];

  for (const user of defaultUsers) {
    const existing = await db.query.users.findFirst({
      where: eq(users.email, user.email),
    });

    if (!existing) {
      await db.insert(users).values(user);
      console.log(`Created user: ${user.email} (${user.role})`);
    } else {
      // Update password hash if needed
      await db.update(users).set({ passwordHash: user.passwordHash }).where(eq(users.email, user.email));
      console.log(`User already exists, updated password: ${user.email}`);
    }
  }

  // Create a default shop for shop owner if not exists
  const owner = await db.query.users.findFirst({ where: eq(users.email, 'shopowner@docprint.io') });
  if (owner) {
    const existingShop = await db.query.shops.findFirst({ where: eq(shops.ownerId, owner.id) });
    if (!existingShop) {
      await db.insert(shops).values({
        ownerId: owner.id,
        name: 'NITK Central Print Express',
        description: 'High-speed cloud printing & lamination center near NITK Main Gate',
        address: 'Main Gate Commercial Complex, NITK Surathkal',
        city: 'Mangaluru',
        state: 'Karnataka',
        postalCode: '575025',
        latitude: '13.0108',
        longitude: '74.7943',
        phone: '+91 98765 43211',
        email: 'shopowner@docprint.io',
        isOpen: true,
      });
      console.log('Created default shop: NITK Central Print Express');
    }
  }

  console.log('✅ Seeding completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
