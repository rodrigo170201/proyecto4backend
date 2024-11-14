/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class AlbumDto {
  @IsNotEmpty()
  @IsString()
  readonly titulo: string; // Título del álbum

  @IsNotEmpty()
  @IsInt()
  readonly artistaId: number; // ID del artista que creó el álbum
}
