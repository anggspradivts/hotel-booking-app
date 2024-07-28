// src/types/leaflet-control-geocoder.d.ts
declare module 'leaflet-control-geocoder' {
  import * as L from 'leaflet';

  namespace L.Control {
    class Geocoder {
      constructor(options: {
        query: string;
        placeholder: string;
        defaultMarkGeocode: boolean;
        geocoder: any;
      });
    }

    function geocoder(options: {
      query: string;
      placeholder: string;
      defaultMarkGeocode: boolean;
      geocoder: any;
    }): Geocoder;
  }
}