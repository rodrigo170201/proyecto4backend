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
import { FileInterceptor } from '@nestjs/platform-express';

import { unlink } from 'fs';
import { promisify } from 'util';
import { GeneroService } from './genero.service';
import { Genero } from './genero.model';
import { GeneroDto } from './dto/genero.dto';
import { GeneroUpdateDto } from './dto/genero-update.dto';

const unlinkAsync = promisify(unlink);

@Controller('generos')
export class GeneroController {
  constructor(private generoService: GeneroService) {}

  @Get()
  list(): Promise<Genero[]> {
    return this.generoService.findAll();
  }

  @Get(':id')
  async get(@Param('id') id: number): Promise<Genero | null> {
    const generoDB = await this.generoService.findById(id);
    if (!generoDB) {
      throw new NotFoundException();
    }
    return generoDB;
  }

  @Get(':id/detail')
  async getDetail(@Param('id') id: number): Promise<Genero | null> {
    const generoDetail = await this.generoService.findById(id);
    if (!generoDetail) {
      throw new NotFoundException();
    }
    return generoDetail;
  }

  @Post()
  create(@Body() generoDto: GeneroDto): Promise<Genero> {
    const genero: Genero = {
      id: 0,
      nombre: generoDto.nombre,
      artistas: [],
    };
    return this.generoService.createGenero(genero);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() generoDto: GeneroDto,
  ): Promise<Genero> {
    const generoDB = await this.generoService.findById(id);
    if (!generoDB) {
      throw new NotFoundException();
    }
    const updatedGenero: Genero = {
      ...generoDB,
      nombre: generoDto.nombre,
    };
    return this.generoService.updateGenero(updatedGenero);
  }

  @Patch(':id')
  async partialUpdate(
    @Param('id') id: number,
    @Body() generoUpdateDto: GeneroUpdateDto,
  ): Promise<Genero> {
    const generoDB = await this.generoService.findById(id);
    if (!generoDB) {
      throw new NotFoundException();
    }
    const partialUpdatedGenero: Genero = {
      ...generoDB,
      nombre: generoUpdateDto.nombre ?? generoDB.nombre,
    };
    return this.generoService.updateGenero(partialUpdatedGenero);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    const generoDB = await this.generoService.findById(id);
    if (!generoDB) {
      throw new NotFoundException();
    }
    return this.generoService.deleteGenero(id);
  }

  @Post(':id/fotogenero')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFoto(
    @Param('id') id: number,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const generoDB = await this.generoService.findById(id);
    if (!generoDB) {
      await unlinkAsync(image.path);
      throw new NotFoundException();
    }
    return {
      filename: image.filename,
      path: image.path,
    };
  }
}
