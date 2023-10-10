import { StorageService } from './../services/storage/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PokemonType } from 'src/enums/pokemon-type.enum';
import { Location } from '@angular/common';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {

  public isFavorite:boolean = false;
  private favoriteList:Array<any> = [];
  public pokemonId:any;
  public pokemonData:any;
  public pokemonType:any = PokemonType;
  public statsData:Array<any> = [
    {
      name: "HP",
      min: 1,
      max: 255,
      with: 0
    },
    {
      name: "Attack",
      min: 5,
      max: 190,
      with: 0
    },
    {
      name: "Defense",
      min: 10,
      max: 230,
      with: 0
    },
    {
      name: "Sp. Atk",
      min: 10,
      max: 194,
      with: 0
    },
    {
      name: "Sp. Def",
      min: 20,
      max: 230,
      with: 0
    },
    {
      name: "Speed",
      min: 5,
      max: 180,
      with: 0
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private storage: StorageService,
    public location: Location
  ) { }

  ngOnInit() {

    this.pokemonId = this.route.snapshot.paramMap.get('id');

    if (this.pokemonId) {

      // Obtém os do pokemon no storage
      this.storage.get("pokemon").then((data:any) => {
        // @ts-ignore
        this.pokemonData = data[this.pokemonId];
      });

      // Obtém a lista dos favoritos no storage
      this.storage.get("favorites").then((data:any) => {
        if (data) {
          this.favoriteList = data;
          // Verifica se o pokemon já foi favoritado
          this.isFavorite = this.favoriteList.map((data:any) => parseInt(data.id)).includes(parseInt(this.pokemonId));
        }
      });

    }

  }

  /**
   * Adiciona o pokemon à lista de favoritos
   */
  addRemoveFavoritePokemon() {

    // Remove a informação de favoritos no storage
    if (this.isFavorite) {
      let pokemonIndex = this.favoriteList.map((data:any) => parseInt(data.id)).indexOf(parseInt(this.pokemonId));
      this.favoriteList.splice(pokemonIndex, 1)

    // Guarda a informação de favoritos no storage
    } else {
      this.favoriteList.push(this.pokemonData);
    }

    this.storage.set("favorites", this.favoriteList);
    this.isFavorite = !this.isFavorite;

  }

}
