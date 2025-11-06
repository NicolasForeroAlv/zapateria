# Zapatería App - Proyecto adaptado

## Integrantes
Johan Garzon - Nicolas Forero

## Dependencias principales
- Node.js, npm
- express
- typescript
- nodemon (opcional)
- bootstrap (frontend)

## Rutas del backend
- GET `/api/products` - Lista de productos.
- GET `/api/cart` - Contenido del carrito.
- POST `/api/cart/add` - Agregar producto al carrito. Body: `{ id, quantity }`
- POST `/api/cart/remove` - Remover cantidad. Body: `{ id, quantity }`
- GET `/api/cart/total` - Devuelve `{ total }` con el total del carrito.

## Funcionamiento del carrito
- El frontend (public/index.html) obtiene productos desde `/api/products`.
- Al agregar un producto, se envía `POST /api/cart/add` con id y cantidad.
- Los datos del carrito se guardan temporalmente en `src/data/data.json` usando `fs.promises`.

## Pruebas (ideas - 10 pruebas sugeridas)
1. Agregar producto con cantidad válida -> 200 OK y carrito actualizado.
2. Agregar producto con cantidad 0 o negativa -> 400 Bad Request.
3. Agregar producto con id inexistente -> 400 Bad Request.
4. Remover producto con cantidad válida -> 200 OK.
5. Remover más cantidad de la que existe -> se elimina del carrito.
6. Obtener `/api/cart` devuelve JSON con lista.
7. Obtener `/api/cart/total` calcula correctamente el total.
8. Frontend filtra productos por nombre.
9. Frontend filtra por rango de precios.
10. Toast aparece al agregar producto.

## Seguridad / Autenticación (5 medidas sugeridas)
1. Validación y saneamiento de entrada en el servidor.
2. Implementar autenticación (JWT) para rutas del carrito.
3. Limitar la tasa de peticiones (rate limiting).
4. Usar HTTPS en producción.
5. Validar y sanitizar datos escritos en `data.json`.
## Autenticación JWT
Se añadió un endpoint POST `/api/auth/login` que retorna un JWT para PETICIONES autenticadas. Para probar rutas del carrito, obtén un token y envíalo en el header `Authorization: Bearer <token>`.

## Tests automatizados
Se añadieron pruebas con Jest + Supertest en `__tests__/cart.test.ts`. Ejecutar `npm test` después de instalar las dependencias.
