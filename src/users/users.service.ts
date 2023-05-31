import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>, 
    
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
    //return 'This action adds a new user';
  }

  findAll() {
    return this.usersRepository.find();
    //return `This action returns all users`;
  }
  find(some:any) {
    return this.usersRepository.find(some);
    //return `This action returns all users`;
  }

  findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id: id },
    });
    //return `This action returns a #${id} user`;
  }

  searchOne(username: string, password: string) {
    return this.usersRepository.findOne({
      where: { username: username, password: password },
    });
    //return `This action returns a #${id} user`;
  }
  
  signin(username: string, password: string) {
    return this.usersRepository.findOne({
      where: { email: username, password: password },
    });
    //return `This action returns a #${id} user`;
  }

  findByUser(username: string): Promise<User | undefined>  {
    return this.usersRepository.findOne({
      where: { username: username },
    });
    //return `This action returns a #${id} user`;
  }

  getUsers() {
    return this.usersRepository.find();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update({ id }, updateUserDto);
    //return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.usersRepository.delete({ id });
    //return `This action removes a #${id} user`;
  }
}

