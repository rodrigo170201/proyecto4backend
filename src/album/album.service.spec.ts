/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';

describe('AlbumService', () => {
  let service: AlbumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlbumService],
    }).compile();

    service = module.get<AlbumService>(AlbumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Aquí puedes agregar más pruebas unitarias para AlbumService,
  // como métodos para verificar la creación, búsqueda, actualización y eliminación de álbumes.
});
