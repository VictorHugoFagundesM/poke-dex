import { StorageService } from './../services/storage/storage.service';
import { PokeApiService } from '../services/api/poke-api.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { PokemonType } from 'src/enums/pokemon-type.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public pokemonList:any = [];
  public isLoading:boolean = false;
  public pokemonType:any = PokemonType;


  constructor(
    private pokeApiService: PokeApiService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private storage: StorageService
  ) {}

  ngOnInit() {
    this.getPokemonList();
  }

  /**
   * Carrega os proximos dados de pokemon
   */
  getNextPage() {
    this.pokemonList.hasMorePages = null
    this.getPokemonList(this.pokemonList.nextOffset, true);
  }

  /**
   * Obtém a lista de pokemon
   * @param nextOffset
   * @param nextPage
   */
  async getPokemonList(nextOffset = 0, nextPage = false) {

    const loading = await this.loadingCtrl.create({});

    loading.present();

    this.pokeApiService.getPokemon(nextOffset).then((reponse:any) => {

      let newPokemonData = [];

      // Concatena os novos pokemons à lista ja existente
      if (nextPage) {
        newPokemonData = this.pokemonList.pokemonData.concat(reponse.pokemonData);
      }

      this.pokemonList = reponse;

      if (nextPage) {
        this.pokemonList.pokemonData = newPokemonData;
      }

      this.storage.set("pokemon", this.pokemonList.pokemonData);

      loading.dismiss();

    }).catch((err:any) => {
      loading.dismiss();
      console.error("Ocorreu um problema ao carregar os pokemon: " + err.error)
    });

  }

  navigateurl(data:any) {
    this.router.navigate(["info", {id: data.id}]);
  }

}
