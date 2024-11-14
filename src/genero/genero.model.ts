/* eslint-disable prettier/prettier */
import { Artista } from 'src/artista/artista.model';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Genero {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @OneToMany(() => Artista, (artista) => artista.genero)
    artistas: Artista[]; // Lista de artistas que pertenecen a este género
}
