import 'reflect-metadata';
import 'dotenv/config';

import dataSource from '../data-source';
import { User } from '../Auth/entities/user.entity';
import * as bcrypt from 'bcryptjs';

async function seedAdmin() {
  try {
    await dataSource.initialize();

    const userRepository = dataSource.getRepository(User);

    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@gmail.com' },
    });

    if (existingAdmin) {
      console.log('✅ Admin already exists.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const admin = userRepository.create({
      fullName: 'System Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
      phone: '',
      subject: '',
      qualification: '',
      rollNumber: '',
      className: '',
      section: '',
    });

    await userRepository.save(admin);

    console.log('✅ Admin created successfully!');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedAdmin();