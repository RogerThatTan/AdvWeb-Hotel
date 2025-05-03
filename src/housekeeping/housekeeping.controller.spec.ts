import { Test, TestingModule } from '@nestjs/testing';
import { HousekeepingController } from './housekeeping.controller';

describe('HousekeepingController', () => {
  let controller: HousekeepingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HousekeepingController],
    }).compile();

    controller = module.get<HousekeepingController>(HousekeepingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
