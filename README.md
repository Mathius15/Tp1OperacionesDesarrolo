# Flora y Fauna de Tandil

Catálogo de especies y hábitats naturales de Tandil: alta, edición, borrado,
búsqueda con filtros.

- **Back:** NestJS + TypeScript + PostgreSQL (TypeORM) → carpeta `back/`
- **Front:** Angular (componentes standalone + signals) → carpeta `front/`

---

## Cómo lo corro

Son **dos aplicaciones separadas** y, por ahora, **una sola base de datos**.
Cada carpeta tiene su propio `package.json` y sus propias dependencias.

### 1. La base de datos

Necesitás un PostgreSQL andando con una base llamada `tandildb`:

```bash
docker run -d --name tandil-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=tandildb \
  -p 5434:5432 postgres:16-alpine
```

### 2. El back

```bash
cd back
npm install
cp .env.example .env      # solo si querés cambiar los valores
npm run start:dev         # http://localhost:3000
```

### 3. El front

En otra terminal:

```bash
cd front
npm install
npm start                 # http://localhost:4200
```

La primera vez que arranca el back, TypeORM crea las tablas y se cargan datos
de ejemplo (4 hábitats y 9 especies), así que la página no arranca vacía.

> **Nota:** el `.env` del back tiene `DB_PORT=5434` porque en esta máquina ya
> hay otros PostgreSQL locales ocupando el 5432 y el 5433.

---

## Estructura

```
.
├── back/                     # API (NestJS)
│   └── src/
│       ├── main.ts           # arranque, CORS y validación global
│       ├── app.module.ts     # módulo raíz: config + base + módulos
│       ├── habitats/         # módulo de hábitats
│       │   ├── habitat.entity.ts       # la tabla "habitats"
│       │   ├── dto.ts                  # qué se espera en cada request
│       │   ├── habitats.controller.ts  # rutas HTTP
│       │   ├── habitats.service.ts     # lógica + acceso a la base
│       │   └── habitats.module.ts
│       ├── especies/         # módulo de especies (misma estructura)
│       └── database/
│           └── seed.service.ts         # carga de datos de ejemplo
│
├── front/                    # SPA (Angular)
│   └── src/app/
│       ├── app.ts / app.html # componente raíz: carga los hábitats
│       ├── config/api.ts     # URL de la API
│       ├── models/modelos.ts # interfaces de TypeScript
│       ├── services/         # un service por recurso + manejo de errores
│       └── components/
│           ├── habitats/     # componente de hábitats
│           ├── especies/     # componente de especies
│           └── toast.ts      # avisos al usuario
│
└── .gitignore
```

---

## Endpoints

### Hábitats

| Método | Ruta | Qué hace |
|--------|------|----------|
| `GET` | `/habitats` | lista todos, con cuántas especies tiene cada uno |
| `GET` | `/habitats/1` | uno por id |
| `POST` | `/habitats` | crea uno |
| `PATCH` | `/habitats/1` | modifica uno |
| `DELETE` | `/habitats/1` | borra uno (solo si no tiene especies) |

### Especies

| Método | Ruta | Qué hace |
|--------|------|----------|
| `GET` | `/especies` | lista, con filtros y paginación |
| `GET` | `/especies/1` | una por id |
| `POST` | `/especies` | crea una |
| `PATCH` | `/especies/1` | modifica una |
| `DELETE` | `/especies/1` | borra una |

**Filtros de `GET /especies`** (opcionales, se pueden combinar):

```
?nombre=om        coincidencia parcial, no importa mayúsculas
?tipo=flora       "flora" o "fauna"
?habitatId=1      filtra por hábitat
?endemica=true    solo las endémicas
?page=1&limit=10  paginación (limit máximo 50)
```

### Ejemplos

```bash
# Listar hábitats
curl http://localhost:3000/habitats

# Crear un hábitat
curl -X POST http://localhost:3000/habitats \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Barranca del Perdriel"}'

# Crear una especie
curl -X POST http://localhost:3000/especies \
  -H 'Content-Type: application/json' \
  -d '{"nombre":"Araña de tela","tipo":"fauna","habitatId":1,"endemica":true}'

# Solo las faunas endémicas
curl 'http://localhost:3000/especies?tipo=fauna&endemica=true'
```

---

## Scripts

**back/**

| Comando | Qué hace |
|---------|----------|
| `npm run start:dev` | arranca con recarga automática |
| `npm run build` | compila TypeScript a `dist/` |
| `npm run start:prod` | corre lo compilado |
| `npm run lint` | ESLint con autofix |
| `npm run format` | Prettier |
| `npm test` | Jest (todavía no hay tests escritos) |

**front/**

| Comando | Qué hace |
|---------|----------|
| `npm start` | servidor de desarrollo en el 4200 |
| `npm run build` | compila para producción en `dist/front` |
| `npm test` | tests con Karma + Jasmine |

---

## Cosas para saber

- **Validación:** cada DTO declara sus reglas con `class-validator` y un
  `ValidationPipe` global las aplica solo. Si algo falla, la API responde `400`
  con `{ "message": "..." }` (o un array de mensajes si falla más de una regla).
- **Errores:** `NotFoundException` → 404, `ConflictException` → 409.
  Borrar un hábitat con especies da 409 en vez de borrar todo.
- **Consultas siempre parametrizadas:** el `QueryBuilder` de TypeORM manda los
  valores aparte (`$1`, `$2`), nunca pegados en el texto. No hay inyección SQL.
- **Tablas:** las entidades (`*.entity.ts`) son la fuente de verdad. Con
  `DB_SYNC=true` TypeORM crea/actualiza las tablas solo, que está bien para
  desarrollo. **En producción eso se desactiva y lo que manda son las
  migraciones** (`typeorm migration:generate`), que todavía no están escritas.
- **CORS:** el front corre en el 4200 y la API en el 3000, así que la API tiene
  `enableCors()` para que el navegador los deje hablarse.
- **La URL de la API** está en `front/src/app/config/api.ts`. Hoy es fija; el
  paso natural siguiente es usar los *environments* de Angular
  (`fileReplacements` con `ng serve --configuration production`).