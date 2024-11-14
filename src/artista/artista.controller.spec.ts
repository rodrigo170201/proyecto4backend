/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ArtistaController } from './artista.controller';
import { ArtistaService } from './artista.service';

describe('ArtistaController', () => {
  let controller: ArtistaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArtistaController],
      providers: [ArtistaService],
    }).compile();

    controller = module.get<ArtistaController>(ArtistaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
