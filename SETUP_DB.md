# Setup Database su Server Finale

Poiché il server finale richiede un database robusto (non SQLite), ecco come configurare **PostgreSQL** utilizzando Docker.

## 1. Requisiti sul Server
Assicurati che Docker e Docker Compose siano installati sul server `v026zq-vmcisnola`.

## 2. Avviare il Database
Copia il file `docker-compose.yml` sul server ed esegui:

```bash
docker compose up -d
```

Questo avvierà un'istanza di PostgreSQL sulla porta 5432.

## 3. Configurazione Progetto

### A. Modifica `prisma/schema.prisma`
Cambia il provider da `sqlite` a `postgresql`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### B. Aggiorna `.env` (sul server)
Imposta la variabile `DATABASE_URL` con le credenziali definite nel `docker-compose.yml`:

```env
DATABASE_URL="postgresql://pullcave_user:pullcave_secure_password@localhost:5432/pullcave_db?schema=public"
```

## 4. Applicare le Migrazioni
Una volta connesso al nuovo DB, esegui le migrazioni per creare le tabelle:

```bash
npx prisma migrate deploy
```

## Note Importanti
- **Sicurezza**: Cambia la password `pullcave_secure_password` nel file `docker-compose.yml` e nel `.env` prima di andare in produzione.
- **Backup**: Il volume `postgres_data` contiene i tuoi dati. Assicurati di farne il backup regolarmente.
