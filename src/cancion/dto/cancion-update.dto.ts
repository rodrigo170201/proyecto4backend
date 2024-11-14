/* eslint-disable prettier/prettier */
import { IsString, IsInt, IsOptional } from 'class-validator';

export class CancionUpdateDto {
  @IsOptional()
  @IsString()
  readonly titulo?: string;

  @IsOptional()
  @IsInt()
  readonly albumId?: number; // ID opcional del álbum en caso de actualización parcial
}
