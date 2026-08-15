/**
 * Variables de entorno para desarrollo local.
 *
 * Angular resuelve este archivo (o environment.prod.ts, segun la
 * configuracion de "fileReplacements" en angular.json) en tiempo de build.
 * Centralizar apiUrl aqui evita tener la URL del backend hardcodeada
 * dentro de cada servicio HTTP.
 */

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
};
