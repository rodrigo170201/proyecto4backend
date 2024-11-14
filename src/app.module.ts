/* eslint-disable prettier/prettier */
import { Module, HttpException, HttpStatus } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlbumController } from './album/album.controller';
import { ArtistaController } from './artista/artista.controller';
import { CancionController } from './cancion/cancion.controller';
import { GeneroController } from './genero/genero.controller';
import { AlbumService } from './album/album.service';
import { ArtistaService } from './artista/artista.service';
import { CancionService } from './cancion/cancion.service';
import { GeneroService } from './genero/genero.service';

import { Album } from './album/album.model';
import { Artista } from './artista/artista.model';
import { Cancion } from './cancion/cancion.model';
import { Genero } from './genero/genero.model';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, callback) => {
          let folder = './uploads';
          if (req.url.includes('fotoartista')) folder = './artistasfotos';
          else if (req.url.includes('fotocancion')) folder = './cancionfotos';
          else if (req.url.includes('fotoalbum')) folder = './albumfotos';
          else if (req.url.includes('cancionmp3')) folder = './cancionesmp3';

          if (!existsSync(folder)) {
            mkdirSync(folder, { recursive: true });
          }

          callback(null, folder);
        },
        filename: (req, file, callback) => {
          const idSuffix = req.params.id;
          const extension = file.originalname.split('.').pop().toLowerCase();
          const allowedExtensions = ['jpeg', 'jpg', 'png', 'jfif', 'mp3'];

          if (!allowedExtensions.includes(extension)) {
            return callback(
              new HttpException(
                'Only jpeg, jpg, png, jfif, and mp3 files are allowed',
                HttpStatus.BAD_REQUEST,
              ),
              null,
            );
          }

          const filename = `${idSuffix}.${extension}`;
          callback(null, filename);
        },
      }),
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'artistasfotos'),
      serveRoot: '/uploads/artistasfotos',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'cancionfotos'),
      serveRoot: '/uploads/cancionfotos',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'albumfotos'),
      serveRoot: '/uploads/albumfotos',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'cancionesmp3'),
      serveRoot: '/uploads/cancionesmp3',
    }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'spotify',
      entities: [Album, Artista, Cancion, Genero],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Album, Artista, Cancion, Genero]),
  ],
  controllers: [
    AppController,
    AlbumController,
    ArtistaController,
    CancionController,
    GeneroController,
  ],
  providers: [
    AppService,
    AlbumService,
    ArtistaService,
    CancionService,
    GeneroService,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
