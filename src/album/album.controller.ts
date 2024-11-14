/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Album } from './album.model';
import { AlbumDto } from './dto/album.dto';
import { AlbumUpdateDto } from './dto/album-update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { unlink } from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(unlink);

@Controller('albums')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  list(): Promise<Album[]> {
    return this.albumService.findAll();
  }

  @Get(':id')
  async get(@Param('id') id: number): Promise<Album | null> {
    const albumDB = await this.albumService.findById(id);
    if (!albumDB) {
      throw new NotFoundException();
    }
    return albumDB;
  }

  @Get('artista/:id')
  async getAlbumsByArtistaId(@Param('id') artistaId: number): Promise<Album[]> {
    const albums = await this.albumService.findByArtistaId(artistaId);
    if (!albums || albums.length === 0) {
      throw new NotFoundException(
        `No se encontraron álbumes para el artista con id ${artistaId}`,
      );
    }
    return albums;
  }

  @Post()
  async create(@Body() albumDto: AlbumDto): Promise<Album> {
    const album = new Album();
    album.titulo = albumDto.titulo;
    album.artista = { id: albumDto.artistaId } as any;
    album.canciones = [];

    return this.albumService.createAlbum(album);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() albumDto: AlbumDto,
  ): Promise<Album> {
    const albumDB = await this.albumService.findById(id);
    if (!albumDB) {
      throw new NotFoundException();
    }
    albumDB.titulo = albumDto.titulo;
    albumDB.artista = { id: albumDto.artistaId } as any;

    return this.albumService.updateAlbum(albumDB);
  }

  @Patch(':id')
  async partialUpdate(
    @Param('id') id: number,
    @Body() albumUpdateDto: AlbumUpdateDto,
  ): Promise<Album> {
    const albumDB = await this.albumService.findById(id);
    if (!albumDB) {
      throw new NotFoundException();
    }

    if (albumUpdateDto.titulo !== undefined) {
      albumDB.titulo = albumUpdateDto.titulo;
    }
    if (albumUpdateDto.artistaId !== undefined) {
      albumDB.artista = { id: albumUpdateDto.artistaId } as any;
    }

    return this.albumService.updateAlbum(albumDB);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    const albumDB = await this.albumService.findById(id);
    if (!albumDB) {
      throw new NotFoundException();
    }
    return this.albumService.deleteAlbum(id);
  }

  @Post(':id/fotoalbum')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFoto(
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const albumDB = await this.albumService.findById(id);
    if (!albumDB) {
      await unlinkAsync(image.path);
      throw new NotFoundException();
    }
    return {
      filename: image.filename,
      path: image.path,
    };
  }
}
