import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {

  private apiUrl = "https://pokeapi.co/api/v2/";

  constructor(private http: HttpClient) { }

  /**
  * Obtém os dados de todos os pokemon de acordo com sua página
  * @param offset
  * @param limit
  * @returns
  */
  getPokemon(offset: number = 0, limit: number = 40) {

    return new Promise((resolve, reject) => {

      let url = this.apiUrl + `pokemon?offset=${offset}&limit=${limit}`;

      // Obtém a lista de pokemon da página
      this.http.get(url).subscribe((response: any) => {

        let pagesQty = Math.ceil(response.count / limit);
        let currentPage = (offset+limit)/limit;

        let pokemonList:any = {
          count: response.count,
          qtyPerPage: limit,
          pagesQty: pagesQty,
          currentPage: currentPage,
          currentOffset: offset,
          nextOffset: offset+limit,
          previousOffset: offset - offset+limit,
          pokemonData: [],
          hasMorePages: currentPage < pagesQty
        };

        let promises: Promise<any>[] = [];

        // obtém os dados de cada pokemon da lista
        response?.results.forEach((pokemon: any) => {

          promises.push(new Promise((resolve, reject) => {

            this.http.get(pokemon.url).subscribe((response: any) => {
              resolve(response);

            },(error) => {
              reject(error);
            });

          }));

        });

        // Espera até que todos os dados sejam carregados
        Promise.all(promises)
        .then((results) => {

          // Organiza o array com resultados
          results.forEach((data:any) => {

            let stats:Array<any> = data.stats.map((res:any) => res.base_stat);
            let types:Array<any> = data.types.map((res:any) => res.type.name);
            let gameIndices:any = {};
            let order:any = "";

            if (data.id.toString().length < pokemonList.count.toString().length) {

              for (let index = 0; index < pokemonList.count.toString().length - data.id.toString().length; index++) {
                order += "0";
              }

            }

            order += data.id;

            // Organiza os indicies do pokemon
            data.game_indices.forEach((indexData:any) => {
              if (!gameIndices?.[indexData.game_index]) gameIndices[indexData.game_index] = [];
              gameIndices[indexData.game_index].push(indexData.version.name);
            });

            pokemonList.pokemonData.push({
              id: data.id,
              order: order,
              name: data.name,
              height: data.height,
              weight: data.weight,
              baseExperience: data.base_experience,
              stats: stats,
              types: types,
              gameIndices: gameIndices,
              abilities: data.abilities,
              photo: data.sprites.other["official-artwork"].front_default,
              icon: data.sprites.front_default
            })
          })

          resolve(pokemonList); // Resolve a Promise com a resposta da requisição
        })
        .catch((error) => {
          reject(error);
        });

      }, (error) => {
        reject(error); // Rejeita a Promise em caso de erro
      });

    });

  }

}
