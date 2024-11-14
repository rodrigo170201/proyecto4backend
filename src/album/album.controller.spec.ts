/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';

describe('AlbumController', () => {
  let controller: AlbumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumController],
      providers: [AlbumService],
    }).compile();

    controller = module.get<AlbumController>(AlbumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Aquí puedes agregar pruebas unitarias para cada endpoint de AlbumController,
  // como listar, obtener, crear, actualizar y eliminar álbumes.
});
