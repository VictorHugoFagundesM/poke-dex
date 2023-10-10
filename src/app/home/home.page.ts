import { StorageService } from './../services/storage/storage.service';
import { PokeApiService } from '../services/api/poke-api.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  public filteredList:any = [];
  public isLoading:boolean = false;
  public pokemonType:any = PokemonType;
  public searchValue:string = "";
  private storageData:any = {};

	@ViewChild("searchInput") searchInput: ElementRef;

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

      if (nextPage) {
        newPokemonData = this.pokemonList.pokemonData.concat(reponse.pokemonData);
      }

      this.pokemonList = reponse;

      // Concatena os novos pokemons à lista ja existente
      if (nextPage) {
        this.pokemonList.pokemonData = newPokemonData;
      }

      this.saveDataInStorage(reponse.pokemonData);
      loading.dismiss();

    }).catch((err:any) => {
      loading.dismiss();
      console.error("Ocorreu um problema ao carregar os pokemon: " + err.error)
    });

  }

  /**
   * Pesquisa pelo pokemon na API
   */
  async searchPokemon() {

    this.searchValue = this.searchInput.nativeElement.value;
    this.filteredList = [];

    if (this.searchValue) {

      const loading = await this.loadingCtrl.create({});
      this.isLoading = true;
      loading.present();

      this.pokeApiService.searchPokemon(this.searchValue).then((data:any) => {

        this.filteredList.push(data);

        this.saveDataInStorage([data]);

        loading.dismiss();
        this.isLoading = false;

      }).catch((err:any) => {
        loading.dismiss();
        this.isLoading = false;
      });

    }

  }

  /**
   * Guarda no Storage as informações dos pokemon
   */
  saveDataInStorage(pokemonData:Array<any>) {

    for (let index = 0; index < pokemonData.length; index++) {
      let id = pokemonData[index].id;
      this.storageData[id] = pokemonData[index];
    }

    this.storage.set("pokemon", this.storageData);

  }

  /**
   * Navega à página de informações do pokemon
   * @param data
   */
  navigateurl(data:any) {
    this.router.navigate(["info", {id: data.id}]);
  }

}
