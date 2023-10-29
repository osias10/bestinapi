import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import CreateUserDto from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthenticationService {

	constructor(private readonly usersService: UsersService) {}

	// public async register(registrationData: RegisterDto)
	// public hashedPassword = await bcrypt.hash(registratio

	public async getAuthenticatedUser(email: string, plainTextPassword: string) {
		try {
		  const user = await this.usersService.getByEmail(email);
		  console.log(plainTextPassword);
			let hashpw: string = await bcrypt.hash(plainTextPassword,10);
		  console.log(hashpw);
		  await this.verifyPassword(plainTextPassword, user.password);
			await this.verifyStatus(user.status);
			await this.verifyExpired(user.expire_date);
		  user.password = undefined;
		  return user;
		} catch (error) {
      console.log(error)
			throw error
      throw new HttpException('잘못된 인증 정보입니다.', HttpStatus.BAD_REQUEST);
    }
	}
	  
	private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
		const isPasswordMatching = await bcrypt.compare(
		  plainTextPassword,
		  hashedPassword
		);
		
		if (!isPasswordMatching) {
		  throw new HttpException('잘못된 pw 정보입니다.', HttpStatus.BAD_REQUEST);
		}
	}

	private async verifyExpired(expireDate: Date) {
		let now = new Date();
		if (now > expireDate) {
			throw new HttpException('만료된 계정입니다..', HttpStatus.BAD_REQUEST);
		}
	}

	private async verifyStatus(status: number) {
		if (status != 1) {
			throw new HttpException('활성화 되지 않은 계정입니다.', HttpStatus.BAD_REQUEST);
		}
	}
	
	async register(userData: CreateUserDto) {
		const hashedPassword = await bcrypt.hash(userData.password, 10);

		try {
      const createdUser = await this.usersService.createUser({
        ...userData,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      
      return createdUser;
		} catch (error) {
			console.log(error)
			throw new HttpException(
        '알 수 없는 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
		}
    const newUser = await this.usersService.createUser(userData);
    return newUser;
  }

}