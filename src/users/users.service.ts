import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  /**
   * Busca un usuario por su correo electrónico.
   * passwordHash no se selecciona porque la entidad tiene select: false.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
    });
  }

  /**
   * Busca un usuario por correo incluyendo su hash.
   * Se utiliza únicamente durante la validación del login.
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  /**
   * Busca un usuario por su identificador.
   * Se utiliza para GET /auth/me.
   */
  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  /**
   * Crea un usuario con el hash de su contraseña.
   */
  async create(
    email: string,
    passwordHash: string,
  ): Promise<User> {
    const user = this.usersRepository.create({
      email,
      passwordHash,
    });

    return this.usersRepository.save(user);
  }
}