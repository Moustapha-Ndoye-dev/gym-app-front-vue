<template>
  <div class="space-y-5 sm:space-y-6">
    <div
      v-if="errorMessage"
      class="rounded-2xl border border-red-200/70 bg-red-50 px-4 py-3 text-[11px] font-bold text-red-700 sm:text-[12px]"
    >
      {{ errorMessage }}
    </div>
    <section class="grid gap-4 xl:grid-cols-[1.6fr_0.9fr]">
      <div class="relative overflow-hidden rounded-[28px] bg-slate-950 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.95)]">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.28),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.16),transparent_24%)]"></div>
        <div class="relative grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.34em] text-cyan-300/80">Tableau de bord</p>
            <h1 class="mt-3 max-w-xl text-2xl font-black tracking-tight sm:text-3xl">
              Bonjour, {{ authStore.user?.username }}.
            </h1>
            <p class="mt-3 max-w-lg text-[12px] font-medium leading-relaxed text-slate-300 sm:text-[13px]">
              Voici un aperçu simple de l'activité du jour, des revenus et des nouveaux adhérents.
            </p>
            <div class="mt-6 flex flex-wrap gap-3">
              <div class="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 backdrop-blur">
                <p class="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Statut</p>
                <p class="mt-1 text-sm font-bold text-emerald-300">Ouvert</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 backdrop-blur">
                <p class="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">Période</p>
                <p class="mt-1 text-sm font-bold text-amber-200">Aujourd'hui</p>
              </div>
            </div>
          </div>

          <div class="grid gap-3 self-start sm:grid-cols-2 lg:grid-cols-1">
            <div class="rounded-[24px] border border-white/10 bg-white/6 p-4 backdrop-blur">
              <p class="text-[10px] font-black uppercase tracking-[0.24em] text-white/40">Revenu du jour</p>
              <p class="mt-3 text-3xl font-black tracking-tight">{{ stats.dailyRevenue }} <span class="text-sm text-white/55">FCFA</span></p>
              <p class="mt-2 text-[11px] font-bold text-emerald-300">Tendance {{ trends.revenue }}</p>
            </div>
            <div class="rounded-[24px] border border-white/10 bg-white/6 p-4 backdrop-blur">
              <p class="text-[10px] font-black uppercase tracking-[0.24em] text-white/40">Adhérents</p>
              <p class="mt-3 text-3xl font-black tracking-tight">{{ stats.members }}</p>
              <p class="mt-2 text-[11px] font-bold text-cyan-300">Évolution {{ trends.members }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-[28px] border border-slate-300/70 bg-[#fbf7ef] p-4 sm:p-5 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.4)]">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Résumé</p>
            <h2 class="mt-1 text-lg font-black tracking-tight text-slate-950">Indicateurs clés</h2>
          </div>
          <div class="rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Aujourd'hui
          </div>
        </div>
        <div class="mt-4 space-y-3">
          <div
            v-for="(stat, index) in statCards"
            :key="index"
            class="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3"
          >
            <div class="flex items-center gap-3">
              <div :class="cn('flex h-10 w-10 items-center justify-center rounded-2xl border', stat.bg, stat.border)">
                <component :is="stat.icon" :class="cn('h-4 w-4', stat.color)" />
              </div>
              <div>
                <p class="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{{ stat.title }}</p>
                <p class="mt-1 text-sm font-bold text-slate-900">{{ stat.value }}</p>
              </div>
            </div>
            <div class="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">
              {{ stat.trend }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-4 xl:grid-cols-[1.35fr_0.9fr]">
      <div class="rounded-[28px] border border-slate-300/70 bg-white p-4 sm:p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)]">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">Revenus</p>
            <h2 class="mt-1 text-lg font-black tracking-tight text-slate-950">Revenus hebdomadaires</h2>
          </div>
          <select class="rounded-full border border-slate-300 bg-[#f8f5ee] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 outline-none focus:ring-2 focus:ring-slate-900/5">
            <option>Cette semaine</option>
            <option>Semaine dernière</option>
          </select>
        </div>
        <div class="mt-6 h-[220px] sm:h-[260px] w-full flex items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-[#fcfaf5] px-2">
          <div v-if="loading" class="text-[11px] sm:text-[12px] text-slate-500 font-medium">
            Chargement...
          </div>
          <div v-else-if="hasRevenueData" class="w-full h-full">
            <Line :data="chartData" :options="chartOptions" />
          </div>
          <p v-else class="text-[11px] sm:text-[12px] text-slate-500 font-medium text-center">
            Aucune donnée de revenus disponible pour le moment.
          </p>
        </div>
      </div>

      <div class="rounded-[28px] bg-slate-950 p-4 sm:p-5 text-white shadow-[0_25px_70px_-45px_rgba(15,23,42,1)]">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.28em] text-white/35">Nouveaux adhérents</p>
            <h2 class="mt-1 text-lg font-black tracking-tight">Derniers adhérents</h2>
          </div>
          <button @click="$router.push('/members')" class="rounded-full border border-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300 transition hover:border-cyan-300/50 hover:text-cyan-200">
            Voir tout
          </button>
        </div>

        <div class="mt-5 space-y-3">
          <div v-if="loading" class="text-[11px] sm:text-[12px] font-medium text-white/55">
            Chargement...
          </div>
          <div
            v-else-if="recentMembers.length === 0"
            class="rounded-[24px] border border-dashed border-white/10 bg-white/4 px-4 py-10 text-center text-[11px] sm:text-[12px] font-medium text-white/55"
          >
            Aucun adhérent récent pour le moment.
          </div>
          <div
            v-else
            v-for="member in recentMembers"
            :key="member.id"
            @click="$router.push('/members')"
            class="cursor-pointer rounded-[24px] border border-white/10 bg-white/4 p-4 transition-all hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/7"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center">
                <div v-if="member.photo" class="mr-3 h-10 w-10 overflow-hidden rounded-2xl border border-white/10 shadow-sm">
                  <img :src="member.photo" alt="Portrait adhérent" class="w-full h-full object-cover" />
                </div>
                <div v-else class="mr-3 flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-[11px] font-black uppercase text-cyan-300">
                  {{ (member.firstName || member.first_name || '?').charAt(0) }}{{ (member.lastName || member.last_name || '?').charAt(0) }}
                </div>
                <div>
                  <p class="text-[12px] font-bold text-white">{{ member.firstName || member.first_name }} {{ member.lastName || member.last_name }}</p>
                  <p class="mt-1 text-[10px] font-medium text-white/55">
                    {{ member.subscriptionName || 'Membre' }} • {{ formatDate(member.registrationDate || member.registration_date) }}
                  </p>
                </div>
              </div>
              <div class="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-emerald-300">
                Actif
              </div>
            </div>
          </div>
        </div>
        <button @click="$router.push('/members')" class="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-[11px] sm:text-[12px] font-black uppercase tracking-[0.2em] text-slate-950 transition hover:bg-cyan-300">
          Nouveau membre
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { Users, Ticket, TrendingUp, Activity as ActivityIcon } from 'lucide-vue-next';
import { cn } from '../lib/utils';
import { readFetchResult } from '../lib/getApiErrorMessage';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, Filler } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, Filler);

const authStore = useAuthStore();

const stats = ref({
  members: 0,
  activeSubscriptions: 0,
  ticketsSold: 0,
  dailyRevenue: 0,
});

const loading = ref(true);
const errorMessage = ref<string | null>(null);
const trends = ref({
  members: '—',
  subscriptions: '—',
  tickets: '—',
  revenue: '—',
});

const recentMembers = ref<any[]>([]);
const hasRevenueData = ref(false);

const statCards = computed(() => [
  { title: 'Adhérents', value: stats.value.members, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', trend: trends.value.members },
  { title: 'Abonnements', value: stats.value.activeSubscriptions, icon: ActivityIcon, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', trend: trends.value.subscriptions },
  { title: 'Tickets', value: stats.value.ticketsSold, icon: Ticket, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', trend: trends.value.tickets },
  { title: 'Revenus', value: `${stats.value.dailyRevenue} FCFA`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', trend: trends.value.revenue },
]);

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const d = new Date(dateString);
  return Number.isNaN(d.getTime()) ? '-' : d.toLocaleDateString('fr-FR');
};

const chartData = ref({
  labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  datasets: [
    {
      label: 'Revenus (FCFA)',
      backgroundColor: (context: any) => {
        const chart = context.chart;
        const {ctx, chartArea} = chart;
        if (!chartArea) return null;
        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        gradient.addColorStop(0, 'rgba(79, 70, 229, 0)');
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0.3)');
        return gradient;
      },
      borderColor: '#4F46E5',
      pointBackgroundColor: '#4F46E5',
      data: [] as number[],
      fill: true,
      tension: 0.4,
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      backgroundColor: '#fff',
      titleColor: '#0F172A',
      bodyColor: '#64748B',
      borderColor: '#E2E8F0',
      borderWidth: 1,
      padding: 8,
      bodyFont: { weight: 'bold' as const },
    },
  },
  scales: {
    y: {
      grid: { display: true, drawBorder: false, color: '#F1F5F9' },
      ticks: {
        callback: (value: any) => value + 'FCFA',
        font: { size: 10, weight: 600 },
        color: '#64748B',
      },
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 10, weight: 600 }, color: '#64748B' },
    },
  },
};

onMounted(async () => {
  loading.value = true;
  errorMessage.value = null;

  try {
    const headers = { Authorization: `Bearer ${authStore.token}` };
    const statsRes = await fetch('/api/stats', { headers });
    const statsResult = await readFetchResult<{
      members: { value: number; trend: string };
      subscriptions: { value: number; trend: string };
      tickets: { value: number; trend: string };
      revenue: { value: number; trend: string };
      recentMembers?: unknown[];
    }>(statsRes, 'Chargement du tableau de bord');

    if (!statsResult.ok) {
      errorMessage.value = statsResult.message;
    } else {
      const statsData = statsResult.data;
      stats.value = {
        members: statsData.members.value,
        activeSubscriptions: statsData.subscriptions.value,
        ticketsSold: statsData.tickets.value,
        dailyRevenue: statsData.revenue.value,
      };
      trends.value = {
        members: statsData.members.trend,
        subscriptions: statsData.subscriptions.trend,
        tickets: statsData.tickets.trend,
        revenue: statsData.revenue.trend,
      };
      recentMembers.value = (statsData.recentMembers || []) as any[];
    }

    const txRes = await fetch('/api/transactions', { headers });
    const txResult = await readFetchResult<
      { type: string; date: string; amount: number }[]
    >(txRes, 'Chargement des transactions pour le graphique');

    if (txResult.ok && Array.isArray(txResult.data)) {
      const transactions = txResult.data;
      const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      const revenueByDay: Record<string, number> = labels.reduce((acc, l) => ({ ...acc, [l]: 0 }), {});

      const now = new Date();
      const startOf7Days = new Date();
      startOf7Days.setDate(now.getDate() - 6);

      transactions
        .filter(t => t.type === 'income' && new Date(t.date) >= startOf7Days)
        .forEach(t => {
          const label = labels[ (new Date(t.date).getDay() + 6) % 7 ]; // Align with Mon-Sun
          if (label in revenueByDay) revenueByDay[label] += t.amount;
        });

      const values = labels.map(l => revenueByDay[l]);
      chartData.value = {
        ...chartData.value,
        datasets: [{ ...chartData.value.datasets[0], data: values }]
      };
      hasRevenueData.value = values.some(v => v > 0);
    } else if (!txResult.ok && !errorMessage.value) {
      errorMessage.value = txResult.message;
    }
  } catch {
    errorMessage.value =
      'Tableau de bord — impossible de contacter le serveur ou données invalides.';
  } finally {
    loading.value = false;
  }
});
</script>
