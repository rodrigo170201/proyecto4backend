/* eslint-disable prettier/prettier */
import { IsString, IsInt, IsOptional } from 'class-validator';

export class AlbumUpdateDto {
  @IsOptional()
  @IsString()
  readonly titulo?: string; // Título del álbum (opcional para actualización parcial)

  @IsOptional()
  @IsInt()
  readonly artistaId?: number; // ID del artista (opcional para actualización parcial)
}
