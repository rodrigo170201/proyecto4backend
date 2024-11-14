/* eslint-disable prettier/prettier */
import { Album } from 'src/album/album.model';
import { Genero } from 'src/genero/genero.model';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Artista {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @ManyToOne(() => Genero, (genero) => genero.artistas)
    genero: Genero; // Género al que pertenece el artista

    @OneToMany(() => Album, (album) => album.artista)
    albums: Album[]; // Lista de álbumes que tiene el artista
}
