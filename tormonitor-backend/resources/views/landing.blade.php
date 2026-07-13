<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tormonitor - Pantau Portofolio Investasi</title>
    <style>
        :root {
            color-scheme: light;
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
            color: #0f172a;
        }

        .container {
            max-width: 1120px;
            margin: 0 auto;
            padding: 48px 24px 80px;
        }

        .hero {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 32px;
            align-items: center;
            background: white;
            border-radius: 24px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
        }

        .badge {
            display: inline-block;
            padding: 8px 12px;
            border-radius: 999px;
            background: #e0e7ff;
            color: #4338ca;
            font-size: 0.9rem;
            font-weight: 600;
            margin-bottom: 16px;
        }

        h1 {
            font-size: 2.4rem;
            line-height: 1.2;
            margin: 0 0 16px;
        }

        p {
            font-size: 1.05rem;
            line-height: 1.7;
            color: #475569;
            margin: 0 0 24px;
        }

        .actions {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .btn {
            text-decoration: none;
            padding: 12px 18px;
            border-radius: 999px;
            font-weight: 600;
            transition: transform 0.2s ease;
        }

        .btn:hover { transform: translateY(-2px); }

        .btn-primary {
            background: #2563eb;
            color: white;
        }

        .btn-secondary {
            background: #f8fafc;
            color: #0f172a;
            border: 1px solid #e2e8f0;
        }

        .panel {
            background: linear-gradient(145deg, #0f172a, #1e293b);
            color: white;
            border-radius: 20px;
            padding: 24px;
        }

        .panel h2 {
            font-size: 1.1rem;
            margin: 0 0 16px;
        }

        .panel ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: grid;
            gap: 12px;
        }

        .panel li {
            padding: 10px 12px;
            border-radius: 12px;
            background: rgba(255,255,255,0.08);
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
            margin-top: 28px;
        }

        .stat {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 16px;
        }

        .stat strong {
            display: block;
            font-size: 1.2rem;
            margin-bottom: 6px;
        }

        @media (max-width: 860px) {
            .hero { grid-template-columns: 1fr; }
            .stats { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <section class="hero">
            <div>
                <span class="badge">Monorepo Investasi Modern</span>
                <h1>Halo christo slat 👋</h1>
                <h1>Catat transaksi, pantau kinerja, dan kelola portofolio dengan lebih cerdas.</h1>
                <p>Tormonitor adalah platform untuk mengelola aset investasi secara terstruktur. Project ini membantu pengguna melihat performa portofolio, mencatat transaksi, dan memahami kondisi investasi secara real-time melalui dashboard yang interaktif.</p>
                <div class="actions">
                    <a href="/login" class="btn btn-primary">Masuk ke Dashboard</a>
                    <a href="/register" class="btn btn-secondary">Daftar Sekarang</a>
                </div>

                <div class="stats">
                    <div class="stat">
                        <strong>Multi-Aset</strong>
                        <span>Kelola berbagai jenis aset dalam satu tempat.</span>
                    </div>
                    <div class="stat">
                        <strong>Real-Time</strong>
                        <span>Pantau pergerakan performa portofolio lebih cepat.</span>
                    </div>
                    <div class="stat">
                        <strong>Terintegrasi</strong>
                        <span>Backend Laravel dan frontend modern siap digunakan.</span>
                    </div>
                </div>
            </div>

            <div class="panel">
                <h2>Fitur utama Tormonitor</h2>
                <ul>
                    <li>• Pencatatan transaksi investasi</li>
                    <li>• Dashboard performa portofolio</li>
                    <li>• Kalkulasi harga rata-rata aset</li>
                    <li>• Visualisasi profit &amp; loss</li>
                    <li>• Autentikasi aman untuk setiap pengguna</li>
                </ul>
            </div>
        </section>
    </div>
</body>
</html>
