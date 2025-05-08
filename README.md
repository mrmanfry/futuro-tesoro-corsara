# Futuro Tesoro

Futuro Tesoro è una piattaforma per creare regali finanziari digitali per bambini, amici e parenti, con raccolta fondi e proiezione di crescita.

## Stack Tecnologico

- **Framework**: Next.js 14 con App Router
- **Linguaggio**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (basato su Radix UI)
- **Gestione Form**: React Hook Form con Zod
- **Gestione Stato**: Zustand
- **Autenticazione**: Supabase Auth
- **Database**: Supabase
- **Testing**: Jest e Cypress

## Requisiti

- Node.js >= 18
- npm >= 9

## Avvio locale

```bash
npm install
npm run dev
```

## Build di produzione

```bash
npm run build
npm start
```

## Deploy su Vercel

1. Collega la repo GitHub a Vercel.
2. Imposta le variabili d'ambiente come in `.env.example`.
3. Vercel userà automaticamente `npm run build` e `npm start`.

## Installazione

1. Clona il repository:

```bash
git clone https://github.com/your-username/futuro-tesoro.git
cd futuro-tesoro
```

2. Crea un file `.env.local` nella root del progetto con le seguenti variabili:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Script Disponibili

- `pnpm dev`: Avvia il server di sviluppo
- `
