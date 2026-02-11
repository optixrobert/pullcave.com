# Guida al Deploy su Hostinger Cloud Startup (Node.js)

Questa guida ti aiuterà a pubblicare **PullCave** sul piano Hostinger Cloud Startup utilizzando un database MySQL.

## 1. Preparazione Database (Hostinger hPanel)
1.  Accedi al tuo hPanel Hostinger.
2.  Vai su **Database** -> **Management**.
3.  Crea un nuovo Database MySQL (nome database e username).
4.  Annota la password e i dettagli.

## 2. Configurazione Variabili d'Ambiente
Nel tuo hPanel, vai alla sezione **Node.js** o **Environment Variables** e imposta:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DB_NAME"
AUTH_SECRET="genera_una_stringa_segreta_lunga"
NEXTAUTH_URL="https://il-tuo-dominio.com"
```
*Sostituisci USER, PASSWORD, HOST, DB_NAME con i dati del database creato.*

## 3. Preparazione File e Schema (CRUCIALE)
Il progetto usa SQLite in locale ma deve usare MySQL in produzione.

1.  Apri il file `prisma/schema.prisma`.
2.  Cambia `provider = "sqlite"` in `provider = "mysql"`.
    *(Nota: Se provi a fare la build locale dopo questa modifica senza un DB MySQL, fallirà. Fai questa modifica solo per i file da caricare).*
3.  Salva il file.

## 4. Upload dei File
Carica i file sul server (tramite File Manager o FTP) nella cartella `public_html` (o sottocartella desiderata).
Carica TUTTO il progetto eccetto le cartelle pesanti:
- `package.json`
- `package-lock.json`
- `server.js` (Entry point personalizzato)
- `next.config.ts`
- `prisma/` (Con schema modificato a MySQL)
- `public/`
- `app/`, `components/`, `lib/`, ecc. (Tutto il codice sorgente)

**NON caricare:**
- `node_modules`
- `.next` (La build la faremo sul server per sicurezza, oppure carica `.next` se sai gestire le architetture diverse)
- `.git`

## 5. Installazione e Build sul Server
1.  Accedi al terminale del server (o usa la sezione Node.js di hPanel).
2.  Assicurati di essere nella root del progetto.
3.  Installa le dipendenze:
    ```bash
    npm install
    ```
4.  Genera il client Prisma (per MySQL):
    ```bash
    npx prisma generate
    ```
5.  Esegui la build di produzione:
    ```bash
    npm run build
    ```
6.  Applica le migrazioni al database:
    ```bash
    npx prisma migrate deploy
    ```

## 6. Configurazione Node.js (hPanel)
1.  Vai alla sezione **Node.js** del tuo dominio.
2.  **Application Startup File**: Inserisci `server.js`.
3.  Salva e avvia l'applicazione.

## Note Importanti
- **Immagini**: Le immagini caricate in `public/` funzioneranno.
- **Errori comuni**: Se vedi errori di database, controlla che `DATABASE_URL` sia corretto e che tu abbia eseguito `prisma migrate deploy`.
