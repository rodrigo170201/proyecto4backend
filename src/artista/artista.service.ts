/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Artista } from "./artista.model";
import { Repository } from "typeorm";

@Injectable()
export class ArtistaService {
    constructor(
        @InjectRepository(Artista)
        private artistaRepository: Repository<Artista>,
    ) { }

    findAll(): Promise<Artista[]> {
        return this.artistaRepository.find();
    }

    findById(id: number): Promise<Artista | null> {
        return this.artistaRepository.findOneBy({ id });
    }

    createArtista(artista: Artista): Promise<Artista> {
        return this.artistaRepository.save(artista);
    }

    async updateArtista(artista: Artista): Promise<Artista> {
        await this.artistaRepository.update(artista.id, artista);
        return artista;
    }

    async deleteArtista(id: number): Promise<void> {
        await this.artistaRepository.delete(id);
    }
}
