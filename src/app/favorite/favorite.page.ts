import { StorageService } from './../services/storage/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
})
export class FavoritePage implements OnInit {

  public favoriteList:Array<any> = [];

  constructor(
    private storage: StorageService,
    public location: Location,
    public router: Router
  ) { }

  ngOnInit() {

    // Obtém a lista dos favoritos no storage
    this.storage.get("favorites").then((data:any) => {
      if (data) {
        this.favoriteList = data;
      }
    });

  }

  /**
   * Remove um pokemon da lista de favoritos
   */
  removeFavoritePokemon(pokemonId:number) {
    let pokemonIndex = this.favoriteList.map((data:any) => parseInt(data.id)).indexOf(pokemonId);
    this.favoriteList.splice(pokemonIndex, 1)
    this.storage.set("favorites", this.favoriteList);
  }

  navigateurl() {

  }

}
