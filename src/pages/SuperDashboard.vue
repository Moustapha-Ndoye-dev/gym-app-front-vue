<template>
  <div class="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-700 text-slate-900">
    <div class="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl"></div>
      <div class="relative z-10 space-y-1 text-center md:text-left text-white">
        <h1 class="text-xl font-black uppercase tracking-tight">Vue d'ensemble <span class="text-indigo-500">SaaS</span></h1>
        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">État de santé global de la plateforme</p>
      </div>
      <div class="flex items-center gap-3">
        <button @click="fetchStats" class="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all mr-2 text-slate-400">
          <RefreshCw :class="['h-4 w-4', loading ? 'animate-spin' : '']" />
        </button>
        <div class="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
          <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          <span class="text-[9px] font-black uppercase text-slate-300">Système Opérationnel</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-900">
      <div class="lg:col-span-2 space-y-6 text-slate-900">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-slate-900">
          <div v-for="s in statCards" :key="s.label" class="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-4 text-slate-900">
            <div :class="['p-3 rounded-2xl', s.bg, s.color]"><component :is="s.icon" class="h-5 w-5" /></div>
            <div class="text-slate-900">
              <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ s.label }}</p>
              <p class="text-lg font-black text-slate-900 leading-none">{{ loading ? '...' : s.value }}</p>
              <p v-if="s.sub" class="text-[8px] font-bold text-slate-400 uppercase mt-1 opacity-70">{{ s.sub }}</p>
              <p v-if="s.trend" class="text-[8px] font-black text-emerald-500 uppercase mt-1">Projection {{ s.trend }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col text-slate-900 min-h-[400px]">
          <div class="flex justify-between items-center mb-8 text-slate-900">
            <div>
              <h3 class="text-xs font-black uppercase text-slate-900 tracking-widest">Évolution des Revenus</h3>
              <div class="flex items-center gap-2 mt-2">
                <button 
                  v-for="p in ['monthly', 'semestriel', 'annuel']" 
                  :key="p"
                  @click="setPeriod(p)"
                  :class="['px-3 py-1 text-[8px] font-black uppercase rounded-lg border transition-all', 
                    selectedPeriod === p ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200']"
                >
                  {{ p }}
                </button>
              </div>
            </div>
            <span class="px-3 py-1 text-[9px] font-black text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100">Live Data</span>
          </div>
          
          <div class="flex-1 w-full text-slate-900 relative">
            <!-- Tooltip -->
            <div v-if="hoveredPoint" 
                 class="absolute z-20 bg-slate-900 text-white px-3 py-2 rounded-xl text-[10px] font-black pointer-events-none shadow-xl border border-white/10"
                 :style="{ left: `${(hoveredPoint.x / 600) * 100}%`, top: `${(hoveredPoint.y / 240) * 100}%`, transform: 'translate(-50%, -120%)' }">
              <p class="text-indigo-400 uppercase text-[8px]">{{ hoveredPoint.name }}</p>
              <p>{{ hoveredPoint.value.toLocaleString() }} CFA</p>
            </div>

            <!-- Custom SVG Area Chart for Vue -->
            <svg class="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.2" />
                  <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0" />
                </linearGradient>
              </defs>
              <!-- Grid Lines -->
              <line v-for="i in 4" :key="i" x1="0" :y1="i * 60" x2="600" :y2="i * 60" stroke="#f1f5f9" stroke-width="1" />
              
              <!-- Area Path -->
              <path :d="chartAreaPath" fill="url(#grad)" />
              <!-- Line Path -->
              <path :d="chartLinePath" fill="none" stroke="#6366f1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
              
              <!-- Data Points -->
              <circle v-for="(p, i) in chartPoints" :key="i" 
                      :cx="p.x" :cy="p.y" r="6" 
                      fill="white" stroke="#6366f1" stroke-width="3" 
                      class="cursor-pointer hover:r-8 transition-all"
                      @mouseenter="hoveredPoint = p"
                      @mouseleave="hoveredPoint = null" />
            </svg>
            
            <!-- X-Axis Labels -->
            <div class="flex justify-between mt-4 px-2">
              <span v-for="h in stats.revenueHistory" :key="h.name" class="text-[10px] font-black text-slate-400 uppercase">{{ h.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4 text-slate-900">
        <div class="bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm h-full text-slate-900">
          <h3 class="text-xs font-black uppercase text-slate-900 tracking-widest mb-6 flex items-center gap-2">
            <Zap class="h-4 w-4 text-indigo-500" /> Raccourcis
          </h3>
          <div class="space-y-2 text-slate-900">
            <button v-for="link in shortcuts" :key="link.path" @click="router.push(link.path)" class="w-full p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all text-left flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <div class="p-2.5 bg-slate-900 rounded-xl text-white group-hover:bg-indigo-600 transition-colors"><component :is="link.icon" class="h-4 w-4" /></div>
                <div>
                  <p class="text-[12px] font-black text-slate-900 leading-none">{{ link.title }}</p>
                  <p class="text-[9px] font-bold text-slate-400 mt-1">{{ link.desc }}</p>
                </div>
              </div>
              <ArrowRight class="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Building2, Users, TrendingUp, ShieldCheck, ArrowRight, Zap, RefreshCw } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { readFetchResult } from '../lib/getApiErrorMessage';

const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const stats = ref({ 
  totalGyms: 0, 
  payingGymsCount: 0,
  trialGymsCount: 0,
  newGymsThisMonth: 0,
  conversionRate: 0,
  expiringSoonCount: 0,
  totalMembers: 0, 
  saasRevenue: 0, 
  revenueHistory: [] as any[] 
});
const loading = ref(true);
const selectedPeriod = ref('monthly');
const hoveredPoint = ref<any>(null);

const fetchStats = async () => {
  loading.value = true;
  try {
    const res = await fetch(`/api/super/stats?period=${selectedPeriod.value}`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    const result = await readFetchResult<{ stats: typeof stats.value }>(res, 'Chargement des statistiques super');
    if (!result.ok) {
      notificationStore.showNotification(result.message, 'error', 8000);
    } else if (result.data?.stats) {
      stats.value = result.data.stats;
    }
  } catch {
    notificationStore.showNotification(
      'Statistiques super — impossible de contacter le serveur.',
      'error',
      8000
    );
  } finally {
    loading.value = false;
  }
};

const setPeriod = (p: string) => {
  selectedPeriod.value = p;
  fetchStats();
};

onMounted(fetchStats);

const statCards = computed(() => [
  { label: 'Revenu Récurrent (MRR)', value: `${stats.value.saasRevenue.toLocaleString()} CFA`, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: TrendingUp, trend: selectedPeriod.value },
  { label: 'Salles Actives (Payantes)', value: stats.value.payingGymsCount, color: 'text-indigo-600', bg: 'bg-indigo-50', icon: ShieldCheck, sub: `${stats.value.totalGyms} au total` },
  { label: 'Taux de Conversion', value: `${stats.value.conversionRate}%`, color: 'text-purple-600', bg: 'bg-purple-50', icon: Zap, sub: 'Trial vers Payant' },
  { label: 'Nouvelles Salles (Mois)', value: `+${stats.value.newGymsThisMonth}`, color: 'text-blue-600', bg: 'bg-blue-50', icon: Building2, sub: 'Croissance mensuelle' },
  { label: 'Expirations (30j)', value: stats.value.expiringSoonCount, color: 'text-rose-600', bg: 'bg-rose-50', icon: RefreshCw, sub: 'Renouvellements à prévoir' },
]);

// SVG Chart Logic
const chartPoints = computed(() => {
  if (!stats.value.revenueHistory.length) return [];
  const max = Math.max(...stats.value.revenueHistory.map(h => h.revenue), 50000);
  const width = 600;
  const height = 240;
  const step = width / (stats.value.revenueHistory.length - 1);
  
  return stats.value.revenueHistory.map((h, i) => ({
    x: i * step,
    y: height - (h.revenue / max * height * 0.8) - 20,
    value: h.revenue,
    name: h.name
  }));
});

const chartLinePath = computed(() => {
  const points = chartPoints.value;
  if (points.length < 2) return '';
  return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
});

const chartAreaPath = computed(() => {
  const points = chartPoints.value;
  if (points.length < 2) return '';
  const height = 240;
  const line = chartLinePath.value;
  return `${line} L ${points[points.length-1].x} ${height} L ${points[0].x} ${height} Z`;
});

const shortcuts = [
  { title: 'Salles', path: '/super/gyms', desc: 'Gestion technique', icon: Building2 },
  { title: 'Abonnements', path: '/super/subscriptions', desc: 'Finance & Accès', icon: TrendingUp },
  { title: 'Sécurité Root', path: '/super/admins', desc: 'Comptes maîtres', icon: ShieldCheck },
];
</script>
