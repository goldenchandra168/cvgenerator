# AutoApply.AI

🤖 AI Job Match & Portfolio Customizer CLI + Web

Aplikasi pencari kerja yang membantu membuat resume, surat lamaran, dan persiapan wawancara secara otomatis menggunakan AI.

## Fitur

- Generate resume yang dioptimalkan ATS
- Buat surat lamaran personal otomatis
- Persiapkan daftar pertanyaan wawancya singkat dan akurat
- Dukungan CLI untuk cepat pakai

## Cara Pakai

### Next.js (Web)

```bash
npm install
cp .env.example .env
# Ganti dengan API key anda
npm run dev
```

Buka http://localhost:3000

### CLI

```bash
# Install dependencies
npm install

# Pakai
npx autoapply apply --url "https://linkedin.com/jobs/xxx" --resume "./resume.pdf"
```

## API Keys yang Diperlukan

- ANTHROPIC_API_KEY: Dapatkan di https://www.anthropic.com
- JINA_API_KEY: Dapatkan di https://jina.ai

## Monetisasi

- Gratis: 1 lamaran / hari
- Premium: Unlimited + ekspor PDF + sync Google Drive

## Lisensi

MIT