// // // src/types/leaflet-control-geocoder.d.ts
// // declare module 'leaflet-control-geocoder' {
// //   import * as L from 'leaflet';

// //   namespace L.Control {
// //     class Geocoder {
// //       constructor(options: {
// //         query: string;
// //         placeholder: string;
// //         defaultMarkGeocode: boolean;
// //         geocoder: any;
// //       });
// //     }

// //     function geocoder(options: {
// //       query: string;
// //       placeholder: string;
// //       defaultMarkGeocode: boolean;
// //       geocoder: any;
// //     }): Geocoder;
// //   }
// // }

// declare module 'leaflet-control-geocoder' {
//   const Geocoder: {
//     nominatim: () => any;
//     [key: string]: any; // Add this to handle other possible geocoders like `bing` or `mapbox`
//   };
//   export default Geocoder;
// }

// declare module 'leaflet' {
//   namespace Control {
//     let Geocoder: {
//       nominatim: () => any;
//       [key: string]: any; // To account for other geocoders like 'bing', 'mapbox', etc.
//     };
//   }
// }