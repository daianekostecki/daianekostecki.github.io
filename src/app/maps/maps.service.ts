import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MapsService {
    constructor(
        private readonly http: HttpClient
    ) { }

    //
    // Método responsável por retornar as agências proximas ao usuario
    //
    public consultarAgencias(form: any): Observable<any> {
        const param = this.montarGetUrl(form);
        return this.getLocais(param).pipe(map(data => data));
    }

    getLocais(param) {
        return this.http.get('https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json' + param);
    }

    //
    // Método responsável para chamar a API que retorna as informações da agência selecionada
    //
    public obterDetalhes(form: any): Observable<any> {
        const param = this.montarGetUrl(form);
        console.log(param);
        return this.getDetalhes(param).pipe(map(data => data));
    }

    getDetalhes(param) {
        return this.http.get('https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json' + param);
    }


    //
    // Método responsável por Montar a URL para o get
    //
    montarGetUrl(formulario: any) {
        let form = [];
        formulario.value ? form = formulario.getRawValue() : form = formulario;
        let url = '?';
        for (const key in form) {
            if (form[key] && key !== 'constructor') {
                if (form[key].constructor === Array
                ) {
                    if (form[key].length > 0) {
                        form[key].forEach(valor => {
                            url = url + key + '=' + encodeURIComponent(valor) + '&';
                        });
                    }
                } else {
                    url = url + key + '=' + encodeURIComponent(form[key]) + '&';
                }
            }
        }
        return url.substr(0, (url.length - 1));
    }
}
