import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import * as httpMock from 'node-mocks-http';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should can say hello', () => {
    const response = controller.sayHello('Muhammad', 'Husein');
    expect(response).toBe('Hello Muhammad Husein');
  });

  it('should can view template', () => {
    const response = httpMock.createResponse();
    controller.viewHello('Husein', response);

    expect(response._getRenderView()).toBe('index.html');
    expect(response._getRenderData()).toEqual({
      title: 'Template Engine',
      name: 'Husein',
    });
  });
});
