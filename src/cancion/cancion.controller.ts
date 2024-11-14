/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CancionService } from './cancion.service';
import { Cancion } from './cancion.model';
import { CancionDto } from './dto/cancion.dto';
//import { CancionUpdateDto } from './dto/cancion-update.dto';
import { Artista } from '../artista/artista.model';
import { unlink } from 'fs';
import { promisify } from 'util';
import { FileInterceptor } from '@nestjs/platform-express';

const unlinkAsync = promisify(unlink);

@Controller('canciones')
export class CancionController {
  constructor(private cancionService: CancionService) {}

  @Get()
  list(): Promise<Cancion[]> {
    return this.cancionService.findAll();
  }

  @Get(':id')
  async get(@Param('id') id: number): Promise<Cancion | null> {
    const cancionDB = await this.cancionService.findById(id);
    if (!cancionDB) {
      throw new NotFoundException();
    }
    return cancionDB;
  }

  @Get('album/:id')
  async getByAlbumId(@Param('id') albumId: number): Promise<Cancion[]> {
    const canciones = await this.cancionService.findByAlbumId(albumId);
    if (!canciones.length) {
      throw new NotFoundException(
        `No songs found for album with ID ${albumId}`,
      );
    }
    return canciones;
  }

  @Post()
  create(@Body() cancionDto: CancionDto): Promise<Cancion> {
    return this.cancionService.createCancion({
      titulo: cancionDto.titulo,
      album: {
        id: cancionDto.albumId,
        titulo: '',
        artista: new Artista(),
        canciones: [],
      },
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() cancionDto: CancionDto,
  ): Promise<Cancion> {
    const cancion = await this.cancionService.findById(id);
    if (!cancion) {
      throw new NotFoundException();
    }
    return this.cancionService.updateCancion(id, {
      titulo: cancionDto.titulo,
      album: {
        id: cancionDto.albumId,
        titulo: '',
        artista: new Artista(),
        canciones: [],
      },
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    const cancionDB = await this.cancionService.findById(id);
    if (!cancionDB) {
      throw new NotFoundException();
    }
    return this.cancionService.deleteCancion(id);
  }

  @Post(':id/fotocancion')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFoto(
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const cancionDB = await this.cancionService.findById(id);
    if (!cancionDB) {
      await unlinkAsync(image.path);
      throw new NotFoundException();
    }
    return {
      filename: image.filename,
      path: image.path,
    };
  }

  @Post(':id/mp3cancion')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMp3(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const cancionDB = await this.cancionService.findById(id);
    if (!cancionDB) {
      await unlinkAsync(file.path);
      throw new NotFoundException();
    }

    // Devuelve los detalles del archivo .mp3 subido
    return {
      filename: file.filename,
      path: file.path,
    };
  }
}
