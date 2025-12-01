import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { email, password } = createUserDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await this.userModel.create({
      email,
      password: hashedPassword,
    });

    const userObject = newUser.toObject();
    const { password: _, ...safeUser } = userObject;

    return safeUser;
  }

  async findByEmailWithPassword(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findByEmailSafe(email: string) {
    const user = await this.userModel
      .findOne({ email })
      .select('-password')
      .lean();
    return user;
  }
}
