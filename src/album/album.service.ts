/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './album.model';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
  ) {}

  findAll(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  findById(id: number): Promise<Album | null> {
    return this.albumRepository.findOneBy({ id });
  }

  async findByArtistaId(artistaId: number): Promise<Album[]> {
    return this.albumRepository.find({ where: { artista: { id: artistaId } } });
  }

  createAlbum(album: Album): Promise<Album> {
    return this.albumRepository.save(album);
  }

  async updateAlbum(album: Album): Promise<Album> {
    await this.albumRepository.update(album.id, album);
    return album;
  }

  async deleteAlbum(id: number): Promise<void> {
    await this.albumRepository.delete(id);
  }
}
