import { PokeApiService } from './../api/poke-api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public pokemonList:any = [];

  constructor(
    private pokeApiService: PokeApiService
  ) { }

  ngOnInit() {

    this.pokeApiService.getAllPokemon().then((reponse:any) => {
      this.pokemonList = reponse;

    }).catch((err:any) => {
      console.error("Ocorreu um problema ao carregar os pokemon: " + err.error)
    });

  }

  /**
   * Função responsável por atualizar a lista de pokemon
   */
  updatePokemonList() {

    this.pokeApiService.getAllPokemon().then((reponse:any) => {
      debugger

    }).catch((err:any) => {
      console.error("Ocorreu um problema ao carregar os pokemon: " + err.error)
    });

  }

  /**
   * Navega até a próxima página
   */
  getNextPage() {

  }

  /**
   * Navega à página anterior
   */
  getlastPage() {

  }

}
