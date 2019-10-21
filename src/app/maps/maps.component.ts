import { Component, OnInit, OnDestroy } from '@angular/core';
import { GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { MapsService } from './maps.service';


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html'
})
export class MapsComponent implements OnInit, OnDestroy {
  lat: number;
  lng: number;
  geocoder: any;
  exibirInf = false;
  dadosAgencia: any;
  marker: any;
  geoCoder: google.maps.Geocoder;

  constructor(
    private mapsWrapper: GoogleMapsAPIWrapper,
    private mapsAPILoader: MapsAPILoader,
    private mapsService: MapsService,
  ) {
    this.mapsWrapper = mapsWrapper;
    this.mapsAPILoader = mapsAPILoader;
    this.mapsAPILoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }

  //
  // Método responsável por iniciar componente
  //
  async ngOnInit() {
    await this.mapsWrapper.createMap(document.getElementById('map'), {
      zoom: 15
    });
    this.posicaoUsuario();
  }

  ngOnDestroy() {
    this.lat = null;
    this.lng = null;
  }


  //
  // Método responsável por localizar a posição do usuario
  //
  posicaoUsuario() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.mapsWrapper.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });

        this.setarPosicao(position);
      });
    }
  }

  //
  // Método responsável por setar a localizar a posição do usuario
  //
  setarPosicao(position) {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;

    this.localizarAgencias();
  }

  //
  // Método responsável por localizar as agencias em um raio de 1.5Km
  //
  localizarAgencias() {
    let form: any;
    form = {
      radius: 1500,
      keyword: 'itau',
      location: this.lat + ',' + this.lng,
      key: 'AIzaSyDTEWvy9TvHSyIhOTtfpTaJKQQJ6KjeH6A'
    };

    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: this.lat, lng: this.lng },
      zoom: 14
    });


    let marker = new google.maps.Marker({
      position: { lat: this.lat, lng: this.lng },
      map,
      icon: '../assets/img/posicao.png'
    });

    this.mapsService.consultarAgencias(form).subscribe(data => {
      data.results.forEach(loc => {
        const place = loc;
        marker = new google.maps.Marker({
          position: { lat: loc.geometry.location.lat, lng: loc.geometry.location.lng },
          map,
          icon: '../assets/img/locais.png'
        });
        google.maps.event.addListener(marker, 'click', () => {
          this.obterDetalhes(place.place_id);
        });
      });
    });
  }

  //
  // Método responsável por obter os detalhes da agencia selecionada
  //
  obterDetalhes(id) {
    const form = {
      place_id: id,
      key: 'AIzaSyDTEWvy9TvHSyIhOTtfpTaJKQQJ6KjeH6A'
    };
    if (form) {
      this.mapsService.obterDetalhes(form).subscribe(inf => {
        this.dadosAgencia = {
          endereco: inf.result.formatted_address,
          telefone: inf.result.formatted_phone_number,
          horarioFuncionamento: inf.result.opening_hours.weekday_text
        };
        this.exibirInf = true;
      });
    }
  }
}


