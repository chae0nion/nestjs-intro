import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  RequestTimeoutException,
  forwardRef,
} from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { ConfigType } from '@nestjs/config';
import profileConfig from '../config/profile.config';

/**
 * Controller class for '/users' API endpoint
 */
@Injectable()
export class UsersService {
  constructor(
    /**
     * Injecting User repository into UsersService
     * */
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    // Injecting Auth Service
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    // Injecting ConfigService
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser = undefined;

    try {
      // Check if user with email exists
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      // Might want to save these errors with more information in a log file or database
      // You don't need to send this sensitive information to user
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to database',
        },
      );
    }

    /**
     * Handle exceptions if user exists later
     * */
    if (existingUser) {
      throw new BadRequestException(
        'The user already exists, please check your email',
      );
    }

    // Try to create a new user
    // - Handle Exceptions Later
    let newUser = this.usersRepository.create(createUserDto);
    newUser = await this.usersRepository.save(newUser);

    // Create the user
    return newUser;
  }

  /**
   * Public method responsible for handling GET request for '/users' endpoint
   */
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limt: number,
    page: number,
  ) {
    // Testing profileConfiguration
    console.log(this.profileConfiguration);
    console.log(this.profileConfiguration.apiKey);
    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      {
        firstName: 'Alice',
        email: 'alice@doe.com',
      },
    ];
  }

  /**
   * Public method used to find one user using the ID of the user
   */
  public async findOneById(id: number) {
    return await this.usersRepository.findOneBy({
      id,
    });
  }
}
