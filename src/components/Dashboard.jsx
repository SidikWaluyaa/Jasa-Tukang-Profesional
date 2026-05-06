import React, { useEffect, useState } from 'react';
import { fetchData, processStats } from '../utils/dataFetcher';
import { motion } from 'framer-motion';
import {
  Users, BarChart2, AlertTriangle, Activity,
  Database, RefreshCw, Zap, TrendingUp, ShieldCheck, Lightbulb,
  Sun, Moon
} from 'lucide-react';

import KpiCard from './KpiCard';
import DataTable from './DataTable';
import ValidationCard from './ValidationCard';

/* ─── Question configs ────────────────────────────────────────── */
const FILTER_KEY = '3.Apakah Anda pernah membutuhkan jasa tenaga profesional (tukang, teknisi, dll):';

const DEMO_QUESTIONS = [
  {
    id: 'd1',
    key: '1.Usia:',
    title: 'Distribusi Usia Responden',
    desc: 'Kolom B · Segmen: YA',
    insight: { text: 'Menunjukkan rentang usia responden yang aktif membutuhkan jasa tukang.', type: '' }
  },
  {
    id: 'd2',
    key: '2. Jenis Responden:',
    title: 'Kategori Responden',
    desc: 'Kolom C · Segmen: YA',
    insight: { text: 'Profil tipe responden — individu atau institusi/bisnis.', type: '' }
  },
  {
    id: 'd3',
    key: 'Bagaimana biasanya Anda mencari tukang atau tenaga profesional',
    title: 'Metode Pencarian Tukang (Kolom F)',
    desc: 'Kolom F · "Bagaimana biasanya Anda mencari tukang atau tenaga profesional?" · Segmen: YA',
    insight: { text: 'Rekomendasi dari orang terdekat mendominasi sebagai saluran utama — peluang besar untuk platform word-of-mouth digital.', type: '' }
  },
];


const NEED_QUESTIONS = [
  { id: 'q1', key: '3.Apakah Anda pernah membutuhkan jasa tenaga profesional (tukang, teknisi, dll):', title: 'Pengalaman Menggunakan Jasa', desc: 'Kolom D · Semua responden', insight: { text: 'Baseline metrik — berapa persen responden yang pernah membutuhkan jasa profesional.', type: 'amber' } },
];

const VALIDATION_QUESTIONS = [
  {
    id: 'v1',
    key: '4. Seberapa sering Anda kesulitan mencari tukang',
    title: 'Kolom E · Frekuensi Kesulitan Mencari Tukang',
    desc: 'Kolom E · Segmen: YA',
    columnQuestion: 'Seberapa sering Anda kesulitan mencari tukang / jasa profesional?',
    weights: { 'SANGAT SERING': 4, 'KADANG-KADANG': 3, 'JARANG': 2, 'TIDAK PERNAH': 1 },
    accent: 'var(--emerald-500)',
    insight: 'Skor validasi tinggi mengindikasikan bahwa kesulitan mencari tukang adalah masalah nyata yang dirasakan mayoritas responden.',
  },
  {
    id: 'v2',
    key: '6. Apakah Anda pernah mendapatkan tukang/ tenaga profesional yang hasil kerjanya kurang memuaskan?',
    title: 'Kolom G · Ketidakpuasan Hasil Kerja Tukang',
    desc: 'Kolom G · Segmen: YA',
    columnQuestion: 'Apakah Anda pernah mendapatkan tukang / tenaga profesional yang hasil kerjanya kurang memuaskan?',
    weights: { 'YA, SERING': 3, 'PERNAH': 2, 'TIDAK PERNAH': 1 },
    accent: 'var(--violet-500)',
    insight: 'Mengukur seberapa luas pengalaman buruk dengan kualitas kerja tukang di antara responden yang aktif menggunakan jasa.',
  },
];

const PAIN_QUESTIONS = [
  {
    id: 'p1',
    key: 'Apa masalah yang pernah Anda alami ketika menggunakan jasa tukang / tenaga profesional?',
    columnQuestion: 'Apa masalah yang pernah Anda alami ketika menggunakan jasa tukang / tenaga profesional?',
    title: 'Kolom H · Masalah yang Pernah Dialami',
    desc: 'Multi-select · Satu responden dapat memilih lebih dari satu masalah',
    insight: { text: 'Data multi-pilihan — total respons melebihi jumlah responden karena setiap orang bisa mengalami lebih dari satu masalah.', type: 'cyan' },
    accent: 'var(--cyan-500)',
  },
  {
    id: 'p2',
    key: '9.Dampak apa yang dirasakan jika hasil dari pekerjaan tukan tidak memuaskan : ',
    columnQuestion: 'Dampak apa yang dirasakan jika hasil dari pekerjaan tukang tidak memuaskan?',
    title: 'Kolom J · Konsekuensi Hasil Tidak Memuaskan',
    desc: '9. Dampak apa yang dirasakan jika hasil dari pekerjaan tukang tidak memuaskan? · Segmen: YA',
    insight: { text: 'Mengidentifikasi kerugian nyata (finansial maupun waktu) yang dialami responden akibat kualitas kerja yang buruk.', type: 'cyan' },
    accent: 'var(--rose-500)',
  },
];

const PAIN_VALIDATION = [
  {
    id: 'pv1',
    key: '8. Seberapa mengganggu masalah tersebut bagi Anda?',
    columnQuestion: 'Seberapa mengganggu masalah tersebut bagi Anda?',
    title: 'Kolom I · Tingkat Gangguan Masalah (Pain Level)',
    desc: 'Kolom I · Segmen: YA · Skala 1–5',
    weights: {
      '1 SANGAT MENGGANGGU': 5,
      '1': 5,
      '2': 4,
      '3': 3,
      '4': 2,
      '5 TIDAK MENGGANGGU': 1,
      '5': 1
    },
    accent: 'var(--cyan-500)',
    insight: 'Skala 1 (Sangat Mengganggu, bobot 5) hingga 5 (Tidak Mengganggu, bobot 1). Skor tinggi menunjukkan masalah yang sangat dirasakan.',
  },
];

const SOLUTION_QUESTIONS = [
  {
    id: 's1',
    key: '11. Apa yang biasanya Anda lakukan jika sulit menemukan tenaga profesional? ',
    columnQuestion: 'Apa yang biasanya Anda lakukan jika sulit menemukan tenaga profesional?',
    title: 'Kolom K · Solusi Saat Ini (Existing Solution)',
    desc: 'Analisis perilaku responden dalam mencari solusi alternatif.',
    insight: { text: 'Mayoritas responden mengandalkan rekomendasi personal (teman/keluarga), menunjukkan pentingnya aspek kepercayaan (trust) dalam mencari jasa tukang.', type: 'indigo' },
    accent: 'var(--indigo-500)',
  },
  {
    id: 's2',
    key: '12. Menurut Anda, seberapa efektif cara tersebut?  ',
    columnQuestion: 'Menurut Anda, seberapa efektif cara tersebut?',
    title: 'Kolom L · Efektivitas Solusi',
    desc: 'Kolom L · Segmen: YA · Skala Efektivitas 1–4',
    weights: {
      'SANGAT EFEKTIF': 4,
      'CUKUP EFEKTIF': 3,
      'KURANG EFEKTIF': 2,
      'TIDAK EFEKTIF': 1
    },
    insight: { text: 'Efektivitas solusi tradisional menjadi baseline untuk mengukur value proposition dari platform digital yang akan dibangun.', type: 'indigo' },
    accent: 'var(--amber-500)',
  },
];

const INSIGHT_QUESTIONS = [
  {
    id: 'i1',
    key: '13.Dalam memilih jasa/tukang, faktor apa yang paling Anda pertimbangkan?',
    columnQuestion: 'Faktor apa yang paling Anda pertimbangkan dalam memilih jasa/tukang?',
    title: 'Kolom M · Faktor Pertimbangan Utama',
    desc: 'Analisis prioritas responden saat memilih penyedia jasa.',
    insight: { text: 'Kualitas hasil kerja adalah faktor absolut yang paling dipertimbangkan (77%), jauh melampaui faktor harga (16%). Ini menunjukkan orientasi pasar pada kualitas (Quality-Driven).', type: 'emerald' },
    accent: 'var(--emerald-500)',
    isMulti: true,
  },
];

/* ─── Loading Skeleton ─────────────────────────────────────────── */
const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-logo" />
    <p className="loading-text">Mengambil data dari Google Sheets…</p>
    <div className="loading-subs">
      {[80, 100, 60].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: 14, width: `${w}%`, margin: '0 auto' }} />
      ))}
    </div>
  </div>
);

/* ─── Section wrapper ──────────────────────────────────────────── */
const Section = ({ icon: Icon, title, subtitle, badge, color = '#6366f1', bg = '#eef2ff', children }) => (
  <section className="section">
    <div className="section-header">
      <div className="section-icon" style={{ background: bg, color }}>
        <Icon size={18} />
      </div>
      <div className="section-title-group">
        <div className="section-title">{title}</div>
        {subtitle && <div className="section-subtitle">{subtitle}</div>}
      </div>
      {badge && (
        <span className="section-badge" style={{ background: bg, color }}>
          {badge}
        </span>
      )}
    </div>
    {children}
  </section>
);

/* ─── Main Dashboard ───────────────────────────────────────────── */
const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await fetchData();
      setData(raw);
      setLastUpdated(new Date().toLocaleTimeString('id-ID'));
    } catch (e) {
      setError('Gagal memuat data. Pastikan Google Sheets sudah dipublikasikan secara publik.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingScreen />;

  if (error) return (
    <div className="app-shell">
      <div className="page-container">
        <div className="error-card">
          <AlertTriangle size={40} color="var(--rose-500)" />
          <h3>Gagal Memuat Data</h3>
          <p>{error}</p>
          <button
            onClick={load}
            style={{ marginTop: 'var(--sp-4)', padding: 'var(--sp-2) var(--sp-5)', background: 'var(--indigo-500)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );

  /* ── Derived data ──────────────────────────────────────────── */
  const filteredData = data.filter(row => {
    const ans = row[Object.keys(row).find(k => k.trim().toLowerCase().includes('pernah membutuhkan jasa')) || ''];
    return ans && ans.trim().toUpperCase() === 'YA';
  });

  const totalAll = data.filter(r => Object.values(r).some(v => v && v.trim())).length;
  const totalYa = filteredData.length;
  const totalTidak = totalAll - totalYa;
  const pctYa = totalAll > 0 ? Math.round((totalYa / totalAll) * 100) : 0;

  /* ── KPI helpers ───────────────────────────────────────────── */
  const needStats = processStats(data, NEED_QUESTIONS[0].key, { multiSelect: false });
  const yaCount = needStats.find(s => s.label === 'YA')?.count || totalYa;

  // Calculate v1 Score
  const v1Stats = processStats(filteredData, VALIDATION_QUESTIONS[0].key, { multiSelect: false });
  const seringCount = (v1Stats.find(s => s.label === 'SANGAT SERING')?.count || 0) + (v1Stats.find(s => s.label === 'KADANG-KADANG')?.count || 0);
  const seringPct = totalYa > 0 ? Math.round((seringCount / totalYa) * 100) : 0;

  const calculateValScore = (stats, weights) => {
    if (!stats.length) return 0;
    const maxW = Math.max(...Object.values(weights));
    let r = 0;
    let n = 0;
    stats.forEach(s => {
      const w = weights[s.label] || 0;
      r += s.count * w;
      n += s.count;
    });
    return n > 0 ? (r / (n * maxW)) * 100 : 0;
  };

  const v1Score = calculateValScore(v1Stats, VALIDATION_QUESTIONS[0].weights);
  const v2Stats = processStats(filteredData, VALIDATION_QUESTIONS[1].key, { multiSelect: false });
  const v2Score = calculateValScore(v2Stats, VALIDATION_QUESTIONS[1].weights);
  const overallValScore = Math.round((v1Score + v2Score) / 2);

  return (
    <div className="app-shell">
      {/* ... navigation ... */}
      <nav className="top-nav">
        <div className="top-nav-inner">
          <div className="nav-brand">
            <div className="nav-logo">
              <BarChart2 size={16} color="#fff" />
            </div>
            <div>
              <div className="nav-title">JasaTukang Analytics</div>
              <div className="nav-subtitle">Riset Pasar · F2022-3</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <button className="theme-toggle" onClick={toggleTheme} title={`Ganti ke mode ${theme === 'dark' ? 'terang' : 'gelap'}`}>
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              <span>{theme === 'dark' ? 'Terang' : 'Gelap'}</span>
            </button>
            {lastUpdated && (
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {lastUpdated}
              </span>
            )}
            <button
              onClick={load}
              title="Refresh"
              className="nav-btn"
            >
              <RefreshCw size={14} className={loading ? 'spin' : ''} />
            </button>
          </div>
        </div>
      </nav>

      <div className="page-container">
        {/* ─ Page Header ─ */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="page-header-top">
            <div>
              <h1 className="page-title">
                Laporan Riset Pasar<br />
                <span>Jasa Tukang & Tenaga Profesional</span>
              </h1>
              <p className="page-desc">
                Analisis survei berbasis Google Sheets · Semua segmen difilter berdasarkan kebutuhan jasa aktual responden.
              </p>
            </div>
          </div>
          <div className="page-meta">
            <span className="meta-chip"><Database size={10} /> Google Sheets · Real-time CSV</span>
            <span className="meta-chip"><Users size={10} /> {totalAll} Total Responden</span>
            <span className="meta-chip"><Zap size={10} /> {totalYa} Responden Aktif (YA)</span>
          </div>
        </motion.div>

        {/* ─ KPI Summary ─ */}
        <div className="kpi-grid">
          <KpiCard index={0} value={totalAll} label="Total Responden" sub="Seluruh pengisi survei" icon={Users} color="indigo" />
          <KpiCard index={1} value={`${pctYa}%`} label="Pernah Butuh Jasa" sub={`${totalYa} dari ${totalAll} responden`} icon={TrendingUp} color="emerald" />
          <KpiCard index={2} value={`${seringPct}%`} label="Kesulitan Cari Tukang" sub="Sering + Sangat Sering" icon={AlertTriangle} color="amber" />
          <KpiCard index={3} value={`${overallValScore}%`} label="Validasi Masalah" sub="Rata-rata Skor (E+G)/2" icon={ShieldCheck} color="violet" />
        </div>

        {/* ─ SECTION 1: Need Analysis ─ */}
        <Section icon={BarChart2} title="Analisis Kebutuhan Jasa" subtitle="Kolom D · Baseline keseluruhan responden" badge="Semua Responden" color="var(--indigo-600)" bg="var(--indigo-50)">
          <div className="card-grid">
            {NEED_QUESTIONS.map(q => {
              const stats = processStats(data, q.key, { multiSelect: false });
              if (!stats.length) return null;
              return (
                <div key={q.id} className="col-12" style={{ marginBottom: 'var(--sp-4)' }}>
                  <DataTable title={q.title} description={q.desc} insight={q.insight} stats={stats} accentColor="var(--indigo-500)" />
                </div>
              );
            })}
          </div>
        </Section>

        {/* ─ SECTION 2: Demografi ─ */}
        <Section icon={Users} title="Demografi Responden" subtitle="Profil responden yang menjawab YA pada kebutuhan jasa" badge="Segmen: YA" color="var(--indigo-600)" bg="var(--indigo-50)">
          {DEMO_QUESTIONS.map(q => {
            const stats = processStats(filteredData, q.key, { multiSelect: false });
            if (!stats.length) return null;
            return (
              <div key={q.id} className="card-grid" style={{ marginBottom: 'var(--sp-4)' }}>
                <div className="col-12">
                  <DataTable title={q.title} description={q.desc} insight={q.insight} stats={stats} accentColor="var(--indigo-500)" />
                </div>
              </div>
            );
          })}
        </Section>

        {/* ─ SECTION 3: Validasi Masalah ─ */}
        <Section icon={AlertTriangle} title="Validasi Masalah" subtitle="Weighted score (R/SM×100%) untuk mengukur urgensi masalah" badge="Segmen: YA" color="var(--emerald-600)" bg="var(--emerald-50)">
          {VALIDATION_QUESTIONS.map(q => {
            const stats = processStats(filteredData, q.key, { multiSelect: false });
            if (!stats.length) return null;
            return (
              <div key={q.id} style={{ marginBottom: 'var(--sp-6)' }}>
                {q.insight && (
                  <div className="insight-box emerald" style={{ marginBottom: 'var(--sp-4)' }}>
                    <p>💡 {q.insight}</p>
                  </div>
                )}
                <ValidationCard
                  title={q.title}
                  description={q.columnQuestion || q.desc}
                  stats={stats}
                  weightMap={q.weights}
                  accentColor={q.accent}
                />
              </div>
            );
          })}
        </Section>

        {/* ─ SECTION 4: DAMPAK (PAIN) ─ */}
        <Section icon={Activity} title="Dampak (PAIN)" subtitle="Analisis masalah dan konsekuensi nyata yang dirasakan responden" badge="Segmen: YA" color="var(--cyan-600)" bg="var(--cyan-50)">

          {/* H1 & J1 — Data tables */}
          {PAIN_QUESTIONS.map(q => {
            // Kolom H is multi-select (multiple problems per respondent), Kolom J is single-select
            const isMulti = q.id === 'p1';
            const stats = processStats(filteredData, q.key, {
              multiSelect: isMulti,
              customDenominator: isMulti ? totalAll : null
            });
            if (!stats.length) return null;
            return (
              <div key={q.id} className="card-grid" style={{ marginBottom: 'var(--sp-4)' }}>
                <div className="col-12">
                  <DataTable title={q.title} description={q.columnQuestion} insight={q.insight} stats={stats} accentColor={q.accent} />
                </div>
              </div>
            );
          })}

          {/* I1 — Validation */}
          {PAIN_VALIDATION.map(q => {
            const stats = processStats(filteredData, q.key, { multiSelect: false });
            if (!stats.length) return null;
            return (
              <div key={q.id} style={{ marginBottom: 'var(--sp-4)' }}>
                {q.insight && (
                  <div className="insight-box cyan" style={{ marginBottom: 'var(--sp-4)' }}>
                    <p>💡 {q.insight}</p>
                  </div>
                )}
                <ValidationCard
                  title={q.title}
                  description={q.columnQuestion || q.desc}
                  stats={stats}
                  weightMap={q.weights}
                  accentColor={q.accent}
                />
              </div>
            );
          })}
        </Section>
        {/* ─ SECTION 5: EXISTING SOLUTION ─ */}
        <Section icon={Database} title="Existing Solution" subtitle="Analisis alternatif dan efektivitas solusi yang saat ini digunakan" badge="Segmen: YA" color="var(--indigo-600)" bg="var(--indigo-50)">
          {SOLUTION_QUESTIONS.map(q => {
            const stats = processStats(filteredData, q.key, { multiSelect: false });
            if (!stats.length) return null;
            return (
              <div key={q.id} className="card-grid" style={{ marginBottom: 'var(--sp-4)' }}>
                <div className="col-12">
                  {q.weights ? (
                    <ValidationCard
                      title={q.title}
                      description={q.columnQuestion || q.desc}
                      stats={stats}
                      weightMap={q.weights}
                      accentColor={q.accent}
                    />
                  ) : (
                    <DataTable title={q.title} description={q.columnQuestion} insight={q.insight} stats={stats} accentColor={q.accent} />
                  )}
                </div>
              </div>
            );
          })}
        </Section>
        {/* ─ SECTION 6: INSIGHT & PREFERENCES ─ */}
        <Section icon={Lightbulb} title="Insight & Preferences" subtitle="Analisis faktor penentu dan preferensi responden dalam memilih jasa" badge="Segmen: YA" color="var(--emerald-600)" bg="var(--emerald-50)">
          {INSIGHT_QUESTIONS.map(q => {
            const stats = processStats(filteredData, q.key, {
              multiSelect: q.isMulti,
              customDenominator: q.isMulti ? totalAll : null
            });
            if (!stats.length) return null;
            return (
              <div key={q.id} className="card-grid" style={{ marginBottom: 'var(--sp-4)' }}>
                <div className="col-12">
                  <DataTable title={q.title} description={q.columnQuestion} insight={q.insight} stats={stats} accentColor={q.accent} />
                </div>
              </div>
            );
          })}
        </Section>

        {/* ─ Footer ─ */}
        <footer className="page-footer">
          <span className="footer-text">© 2026 JasaTukang Data Analytics · Powered by Google Sheets + React</span>
          <span className="footer-text">{lastUpdated && `Data terakhir diperbarui: ${lastUpdated}`}</span>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
