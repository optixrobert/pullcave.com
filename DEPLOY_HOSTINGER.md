# Guida al Deploy su Hostinger Cloud Startup + Supabase

Questa guida ti aiuterà a pubblicare **PullCave** sul piano Hostinger Cloud Startup utilizzando **Supabase** (PostgreSQL) come database.

## 1. Configurazione Supabase (Database)
1.  Accedi alla tua dashboard Supabase -> Project Settings -> Database.
2.  Copia la stringa di connessione (Connection String) -> **Transaction Pooler (Port 6543)**.
    *   Questa sarà la tua `DATABASE_URL`.
    *   Esempio: `postgres://postgres.xxx:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
3.  Copia la stringa di connessione -> **Session (Port 5432)**.
    *   Questa sarà la tua `DIRECT_URL` (necessaria per le migrazioni).
    *   Esempio: `postgres://postgres.xxx:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`

## 2. Configurazione Variabili d'Ambiente (Hostinger)
Nel tuo hPanel, vai alla sezione **Node.js** o **Environment Variables** e imposta:

```env
DATABASE_URL="postgres://postgres.xxx:PASSWORD@...:6543/postgres?pgbouncer=true"
DIRECT_URL="postgres://postgres.xxx:PASSWORD@...:5432/postgres"
AUTH_SECRET="genera_una_stringa_segreta_lunga"
NEXTAUTH_URL="https://il-tuo-dominio.com"
NEXT_PUBLIC_SUPABASE_URL="https://bkfmwhglmcrnuvwyfrnr.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_publishable_..."
```

## 3. Preparazione File e Schema
Il progetto è già configurato per usare PostgreSQL (`prisma/schema.prisma` ha `provider = "postgresql"`).

## 4. Upload dei File
Carica i file sul server (tramite File Manager o FTP) nella cartella `public_html` (o sottocartella desiderata).
Carica TUTTO il progetto eccetto le cartelle pesanti:
- `package.json`
- `package-lock.json`
- `server.js` (Entry point personalizzato)
- `next.config.ts`
- `prisma/`
- `public/`
- `app/`, `components/`, `lib/`, ecc. (Tutto il codice sorgente)

**NON caricare:**
- `node_modules`
- `.next`
- `.git`

## 5. Installazione e Build sul Server
1.  Accedi al terminale del server (o usa la sezione Node.js di hPanel).
2.  Assicurati di essere nella root del progetto.
3.  Installa le dipendenze:
    ```bash
    npm install
    ```
4.  Genera il client Prisma:
    ```bash
    npx prisma generate
    ```
5.  Esegui la build di produzione:
    ```bash
    npm run build
    ```
6.  Applica le migrazioni al database Supabase:
    ```bash
    npx prisma migrate deploy
    ```
    *(Nota: Questo creerà le tabelle nel database Supabase remoto)*

## 6. Configurazione Node.js (hPanel)
1.  Vai alla sezione **Node.js** del tuo dominio.
2.  **Application Startup File**: Inserisci `server.js`.
3.  Salva e avvia l'applicazione.
