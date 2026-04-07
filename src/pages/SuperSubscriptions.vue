<template>
  <div class="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20 text-slate-900">
    
    <!-- SECTION 2: SUIVI DES ACTIVATIONS PAGINÉE -->
    <section class="space-y-4 text-slate-900">
      <div class="px-2 text-slate-900">
        <h2 class="text-lg font-black uppercase tracking-tight text-slate-900">Suivi des Activations</h2>
        <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest leading-none mt-1 text-slate-900">Gestion financière des salles</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-slate-900">
        <div class="overflow-x-auto text-slate-900">
          <table class="min-w-full divide-y divide-slate-100 text-slate-900">
            <thead class="bg-slate-50/50 text-slate-900">
              <tr>
                <th class="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Enseigne</th>
                <th class="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Échéance</th>
                <th class="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Redevance</th>
                <th class="px-6 py-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">État</th>
                <th class="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 text-slate-900">
              <tr v-for="gym in currentGyms" :key="gym.id" class="hover:bg-slate-50/50 transition-all text-slate-900">
                <td class="px-6 py-4 text-slate-900">
                  <div class="flex items-center gap-3 text-slate-900">
                    <div :class="['w-8 h-8 rounded-lg flex items-center justify-center text-white', gym.status === 'ACTIVE' ? 'bg-slate-900' : 'bg-rose-500']">
                      <Building2 class="h-4 w-4" />
                    </div>
                    <div class="min-w-0 text-slate-900">
                      <p class="text-[12px] font-bold text-slate-900 leading-tight truncate text-slate-900">{{ gym.name }}</p>
                      <p class="text-[9px] font-medium text-slate-400 truncate text-slate-900">{{ gym.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-900">
                  <div class="flex flex-col text-slate-900">
                    <span :class="['text-[11px] font-black', isExpired(gym.subscriptionEnd) ? 'text-rose-600' : 'text-slate-900']">
                      {{ new Date(gym.subscriptionEnd).toLocaleDateString('fr-FR') }}
                    </span>
                    <span v-if="isTrial(gym)" class="text-[8px] font-black text-amber-600 uppercase tracking-widest">En Essai</span>
                    <span v-else class="text-[8px] font-bold text-slate-400 uppercase">{{ isExpired(gym.subscriptionEnd) ? 'Expiré' : 'Valide' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-900">
                  <div class="flex items-center gap-2 group text-slate-900">
                    <span :class="['text-[11px] font-black px-2 py-1 rounded-lg', isTrial(gym) ? 'text-slate-400 bg-slate-50' : 'text-slate-700 bg-slate-100']">
                      {{ isTrial(gym) ? '0' : (gym.saasFee || 0).toLocaleString() }} CFA
                    </span>
                    <button v-if="!isTrial(gym)" @click="openPriceModal(gym)" class="p-1 hover:bg-slate-200 rounded text-slate-400">
                      <Tag class="h-3 w-3 text-slate-900" />
                    </button>
                  </div>
                </td>
                <td class="px-6 py-4 text-center text-slate-900">
                  <span :class="['px-2 py-0.5 rounded text-[8px] font-black border uppercase tracking-tighter', gym.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100']">
                    {{ gym.status === 'ACTIVE' ? 'Actif' : 'Bloqué' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right text-slate-900">
                  <div class="flex justify-end gap-1.5 text-slate-900">
                    <button @click="openPriceModal(gym)" class="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Modifier Redevance">
                      <DollarSign class="h-3.5 w-3.5 text-slate-900" />
                    </button>
                    <button v-if="isExpired(gym.subscriptionEnd) || gym.status === 'BLOCKED'" @click="openDurationModal(gym)" class="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all" title="Activer (🔑 Choice)">
                      <Key class="h-3.5 w-3.5 text-slate-900" />
                    </button>
                    <button @click="toggleBlockGym(gym)" :class="['p-2 rounded-xl transition-all', gym.status === 'ACTIVE' ? 'bg-rose-50 text-rose-400 hover:bg-rose-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200']" :title="gym.status === 'ACTIVE' ? 'Bloquer (🚫)' : 'Débloquer'">
                      <Ban class="h-3.5 w-3.5 text-slate-900" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="p-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-slate-900">
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Page {{ currentPage }} / {{ totalPages }}</span>
          <div class="flex gap-2 text-slate-900">
            <button :disabled="currentPage === 1" @click="currentPage--" class="p-1.5 bg-white border border-slate-200 rounded-lg disabled:opacity-30 text-slate-900"><ChevronLeft class="h-3.5 w-3.5 text-slate-900" /></button>
            <button :disabled="currentPage === totalPages" @click="currentPage++" class="p-1.5 bg-white border border-slate-200 rounded-lg disabled:opacity-30 text-slate-900"><ChevronRight class="h-3.5 w-3.5 text-slate-900" /></button>
          </div>
        </div>
      </div>
    </section>

    <!-- MODAL DURÉE ACTIVATION -->
    <div v-if="isDurationModalOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div class="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200 border border-slate-100">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-3 bg-emerald-50 rounded-2xl text-emerald-600"><Key class="h-6 w-6" /></div>
          <div>
            <h2 class="text-xl font-black uppercase tracking-tight text-slate-900">Activer l'accès</h2>
            <p class="text-[10px] font-bold text-slate-400 uppercase">Choisir la durée pour {{ currentGym.name }}</p>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-3 mb-8">
          <button v-for="d in durations" :key="d.val" @click="handleActivateWithDuration(d.val)" class="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-3xl border border-slate-100 transition-all group">
            <span class="text-[13px] font-black">{{ d.label }}</span>
            <span class="text-[8px] font-bold uppercase opacity-50 group-hover:opacity-100">{{ d.desc }}</span>
          </button>
        </div>

        <button @click="isDurationModalOpen = false" class="w-full py-3 text-[11px] font-black uppercase text-slate-400 hover:text-rose-600 transition-colors tracking-widest">Annuler</button>
      </div>
    </div>

    <!-- MODAL PRIX REDEVANCE -->
    <div v-if="isPriceModalOpen" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-slate-900">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200 text-slate-900">
        <h2 class="text-lg font-black mb-5 uppercase tracking-tight text-slate-900">Modifier Redevance</h2>
        <form @submit.prevent="handleUpdatePrice" class="space-y-4 text-slate-900">
          <div class="space-y-1 text-slate-900">
            <label class="text-[10px] font-bold text-slate-400 uppercase ml-1 text-slate-900 text-slate-900">Nouveau Tarif Mensuel (CFA)</label>
            <div class="relative text-slate-900">
              <DollarSign class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 text-slate-900" />
              <input v-model.number="currentGym.saasFee" required type="number" class="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all text-slate-900" />
            </div>
          </div>
          <button type="submit" class="w-full py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] hover:bg-indigo-600 transition-all shadow-xl text-slate-900">Appliquer le tarif</button>
          <button type="button" @click="isPriceModalOpen = false" class="w-full py-2 text-[10px] font-bold text-slate-400 uppercase text-slate-900 text-slate-900">Annuler</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { Key, Ban, Building2, ChevronLeft, ChevronRight, DollarSign, Tag } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { useConfirmStore } from '../stores/confirm';
import { readFetchResult } from '../lib/getApiErrorMessage';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const confirmStore = useConfirmStore();

type SuperSub = { id: number; name: string; price: number; features: string; };
type Gym = { id: number; name: string; email: string; status: 'ACTIVE' | 'BLOCKED'; saasFee: number; subscriptionEnd: string; };

const subs = ref<SuperSub[]>([]);
const gyms = ref<Gym[]>([]);
const isPriceModalOpen = ref(false);
const isDurationModalOpen = ref(false);
const currentGym = ref<Partial<Gym>>({});
const loading = ref(true);

const currentPage = ref(1);
const itemsPerPage = 8;

const durations = [
  { label: '1 Mois', val: 1, desc: 'Standard' },
  { label: '3 Mois', val: 3, desc: 'Trimestriel' },
  { label: '6 Mois', val: 6, desc: 'Semestriel' },
  { label: '12 Mois', val: 12, desc: 'Annuel' },
];

const fetchData = async () => {
  loading.value = true;
  try {
    const [sRes, gRes] = await Promise.all([
      fetch('/api/super/subscriptions', { headers: { 'Authorization': `Bearer ${authStore.token}` } }),
      fetch('/api/super/gyms', { headers: { 'Authorization': `Bearer ${authStore.token}` } })
    ]);
    const sOut = await readFetchResult<SuperSub[]>(sRes, 'Chargement des abonnements super');
    const gOut = await readFetchResult<Gym[]>(gRes, 'Chargement des salles');
    if (!sOut.ok) {
      subs.value = [];
      notificationStore.showNotification(sOut.message, 'error', 8000);
    } else {
      subs.value = Array.isArray(sOut.data) ? sOut.data : [];
    }
    if (!gOut.ok) {
      gyms.value = [];
      notificationStore.showNotification(gOut.message, 'error', 8000);
    } else {
      gyms.value = Array.isArray(gOut.data) ? gOut.data : [];
    }
  } catch {
    notificationStore.showNotification(
      'Chargement des données super — impossible de contacter le serveur.',
      'error',
      8000
    );
  }
  finally { loading.value = false; }
};

onMounted(fetchData);

const currentGyms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return gyms.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(gyms.value.length / itemsPerPage));

const openPriceModal = (gym: Gym) => {
  currentGym.value = { ...gym };
  isPriceModalOpen.value = true;
};

const openDurationModal = (gym: Gym) => {
  currentGym.value = { ...gym };
  isDurationModalOpen.value = true;
};

const handleUpdatePrice = async () => {
  try {
    const res = await fetch(`/api/super/gyms/${currentGym.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.token}` },
      body: JSON.stringify({ saasFee: currentGym.value.saasFee }),
    });
    const result = await readFetchResult(res, 'Mise à jour de la redevance');
    if (!result.ok) {
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    isPriceModalOpen.value = false;
    fetchData();
    notificationStore.showNotification('Prix mis à jour', 'success');
  } catch {
    notificationStore.showNotification('Mise à jour de la redevance — erreur réseau.', 'error', 8000);
  }
};

const handleActivateWithDuration = async (months: number) => {
  if (!currentGym.value.id) return;
  const newEnd = new Date();
  newEnd.setMonth(newEnd.getMonth() + months);
  
  try {
    const res = await fetch(`/api/super/gyms/${currentGym.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.token}` },
      body: JSON.stringify({ subscriptionEnd: newEnd.toISOString(), status: 'ACTIVE' }),
    });
    const result = await readFetchResult(res, "Activation de l'abonnement salle");
    if (!result.ok) {
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    isDurationModalOpen.value = false;
    fetchData();
    notificationStore.showNotification(`Activé pour ${months} mois`, 'success');
  } catch {
    notificationStore.showNotification("Activation de l'abonnement — erreur réseau.", 'error', 8000);
  }
};

const toggleBlockGym = (gym: Gym) => {
  const isBlocking = gym.status === 'ACTIVE';
  confirmStore.confirm({
    title: isBlocking ? 'Bloquer' : 'Débloquer',
    message: `Changer le statut de ${gym.name} ?`,
    confirmText: isBlocking ? 'Bloquer (🚫)' : 'Autoriser',
    onConfirm: async () => {
      try {
        const res = await fetch(`/api/super/gyms/${gym.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.token}` },
          body: JSON.stringify({ ...gym, status: isBlocking ? 'BLOCKED' : 'ACTIVE' }),
        });
        const stResult = await readFetchResult(res, 'Mise à jour du statut de la salle');
        if (!stResult.ok) {
          notificationStore.showNotification(stResult.message, 'error', 8000);
          return;
        }
        fetchData();
        notificationStore.showNotification('Statut mis à jour', 'success');
      } catch {
        notificationStore.showNotification('Mise à jour du statut — erreur réseau.', 'error', 8000);
      }
    }
  });
};

const isExpired = (dateStr: string) => new Date(dateStr) < new Date();

const isTrial = (gym: any) => {
  if (!gym.subscriptionEnd || !gym.createdAt) return true;
  const trialEnd = new Date(gym.createdAt);
  trialEnd.setDate(trialEnd.getDate() + 15);
  return new Date(gym.subscriptionEnd) <= trialEnd;
};

watch(gyms, () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = totalPages.value;
  }
});
</script>
