<template>
  <div class="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 text-slate-900">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div>
        <h1 class="text-2xl font-black tracking-tight uppercase">Gestion des Enseignes</h1>
        <p class="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1">Répertoire technique des salles du réseau</p>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto text-slate-900">
        <table class="min-w-full divide-y divide-slate-100 text-slate-900">
          <thead class="bg-slate-50/50 text-slate-400">
            <tr>
              <th class="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Enseigne</th>
              <th class="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Statut Abonnement</th>
              <th class="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Activité</th>
              <th class="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Redevance</th>
              <th class="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest">Expiration</th>
              <th class="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="gym in gyms" :key="gym.id" class="hover:bg-slate-50/50 transition-all group">
              <td class="px-6 py-4 text-slate-900">
                <div class="flex items-center gap-3">
                  <div :class="['w-10 h-10 rounded-xl flex items-center justify-center text-white', gym.status === 'ACTIVE' ? 'bg-slate-900' : 'bg-rose-500']">
                    <Building2 class="h-5 w-5" />
                  </div>
                  <div>
                    <p class="text-[13px] font-black leading-tight">{{ gym.name }}</p>
                    <p class="text-[10px] font-bold text-slate-400 mt-0.5">{{ gym.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span v-if="isTrial(gym)" class="px-2.5 py-1 bg-amber-50 text-amber-600 text-[9px] font-black rounded-lg border border-amber-100 uppercase tracking-widest">Période d'essai</span>
                <span v-else class="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg border border-emerald-100 uppercase tracking-widest">Abonnement Actif</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div class="flex flex-col">
                    <span class="text-[13px] font-black text-slate-900">{{ gym._count?.members || 0 }}</span>
                    <span class="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Membres</span>
                  </div>
                  <div class="w-px h-6 bg-slate-100"></div>
                  <div class="flex flex-col">
                    <span class="text-[13px] font-black text-slate-900">{{ gym._count?.transactions || 0 }}</span>
                    <span class="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Ventes</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-[13px] font-black text-slate-900">
                  {{ isTrial(gym) ? '0' : (gym.saasFee || 0).toLocaleString() }} <span class="text-[9px] text-slate-400">CFA / mois</span>
                </p>
                <p v-if="isTrial(gym)" class="text-[9px] font-bold text-slate-400 uppercase italic">(Essai gratuit)</p>
              </td>
              <td class="px-6 py-4 text-slate-900">
                <div class="flex flex-col">
                  <span :class="['text-[13px] font-black', getRemainingDays(gym.subscriptionEnd) === 0 ? 'text-rose-600' : 'text-slate-900']">
                    {{ getRemainingDays(gym.subscriptionEnd) }} jours
                  </span>
                  <span class="text-[9px] font-bold text-slate-400 uppercase">Expire le {{ new Date(gym.subscriptionEnd).toLocaleDateString('fr-FR') }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2 text-slate-900">
                  <button 
                    @click="openActivationModal(gym)" 
                    :disabled="!isTrial(gym) && getRemainingDays(gym.subscriptionEnd) > 0"
                    :class="['p-2 rounded-xl transition-all', 
                      !isTrial(gym) && getRemainingDays(gym.subscriptionEnd) > 0 
                      ? 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-50' 
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100']" 
                    :title="!isTrial(gym) && getRemainingDays(gym.subscriptionEnd) > 0 ? 'Abonnement en cours' : 'Activer / Renouveler'"
                  >
                    <Zap class="h-4 w-4" />
                  </button>
                  <button v-if="getRemainingDays(gym.subscriptionEnd) === 0" @click="resetTrial(gym)" class="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-all" title="Réactiver 15 jours d'essai">
                    <RotateCcw class="h-4 w-4" />
                  </button>
                  <button @click="handleDelete(gym.id)" class="p-2 text-slate-300 hover:text-rose-600 transition-all" title="Supprimer">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Activation Modal -->
    <div v-if="isActivationModalOpen" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-slate-900">
      <div class="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
            <Zap class="h-5 w-5" />
          </div>
          <h2 class="text-xl font-black uppercase tracking-tight text-slate-900">Activer Salle</h2>
        </div>
        
        <form @submit.prevent="handleActivate" class="space-y-4">
          <div class="space-y-1.5 text-slate-900">
            <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Tarif Mensuel (CFA)</label>
            <input v-model="activationData.saasFee" type="number" step="1000" class="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-slate-900" />
          </div>
          
          <div class="space-y-1.5 text-slate-900">
            <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Durée de l'abonnement</label>
            <div class="grid grid-cols-2 gap-2">
              <button v-for="opt in durationOptions" :key="opt.value" type="button" 
                      @click="activationData.duration = opt.value"
                      :class="['py-3 rounded-xl text-[10px] font-black uppercase border transition-all', 
                        activationData.duration === opt.value ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200']">
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div class="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 mt-4 text-slate-900">
            <div class="flex justify-between items-center text-slate-900">
              <p class="text-[9px] font-black text-emerald-600 uppercase">Total à facturer</p>
              <p class="text-lg font-black text-emerald-700">{{ (activationData.saasFee * activationData.duration).toLocaleString() }} CFA</p>
            </div>
          </div>

          <div class="pt-4 flex gap-3 text-slate-900">
            <button type="button" @click="isActivationModalOpen = false" class="flex-1 py-3 bg-slate-50 rounded-2xl text-[11px] font-black uppercase text-slate-400 hover:bg-slate-100 transition-all">Annuler</button>
            <button type="submit" class="flex-[2] py-3 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[11px] hover:bg-emerald-600 transition-all shadow-xl">Activer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Building2, Edit, RotateCcw, Trash2, Zap } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { useConfirmStore } from '../stores/confirm';
import { readFetchResult } from '../lib/getApiErrorMessage';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const confirmStore = useConfirmStore();

type Gym = { 
  id: number; 
  name: string; 
  email: string; 
  status: 'ACTIVE' | 'BLOCKED'; 
  saasFee: number; 
  subscriptionEnd: string;
  createdAt: string;
  _count?: {
    members: number;
    transactions: number;
  }
};

const gyms = ref<Gym[]>([]);
const isModalOpen = ref(false);
const isActivationModalOpen = ref(false);
const currentGym = ref<Partial<Gym>>({});

const activationData = ref({
  id: 0,
  saasFee: 15000,
  duration: 1
});

const durationOptions = [
  { label: '1 Mois', value: 1 },
  { label: '3 Mois', value: 3 },
  { label: '6 Mois', value: 6 },
  { label: '12 Mois', value: 12 },
];

const fetchGyms = async () => {
  try {
    const res = await fetch('/api/super/gyms', { headers: { 'Authorization': `Bearer ${authStore.token}` } });
    const result = await readFetchResult<Gym[]>(res, 'Chargement des salles');
    if (!result.ok) {
      gyms.value = [];
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    gyms.value = Array.isArray(result.data) ? result.data : [];
  } catch {
    notificationStore.showNotification(
      'Chargement des salles — impossible de contacter le serveur.',
      'error',
      8000
    );
  }
};

onMounted(fetchGyms);

const openActivationModal = (gym: Gym) => {
  activationData.value = {
    id: gym.id,
    saasFee: gym.saasFee || 15000,
    duration: 1
  };
  isActivationModalOpen.value = true;
};

const handleActivate = async () => {
  try {
    const newEnd = new Date();
    newEnd.setMonth(newEnd.getMonth() + activationData.value.duration);
    
    const res = await fetch(`/api/super/gyms/${activationData.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.token}` },
      body: JSON.stringify({ 
        saasFee: activationData.value.saasFee, 
        subscriptionEnd: newEnd.toISOString(),
        status: 'ACTIVE'
      }),
    });
    const result = await readFetchResult(res, 'Activation de la salle');
    if (!result.ok) {
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    isActivationModalOpen.value = false;
    fetchGyms();
    notificationStore.showNotification('Salle activée avec succès', 'success');
  } catch {
    notificationStore.showNotification('Activation de la salle — erreur réseau.', 'error', 8000);
  }
};

const handleSave = async () => {
  try {
    const res = await fetch(`/api/super/gyms/${currentGym.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.token}` },
      body: JSON.stringify(currentGym.value),
    });
    const result = await readFetchResult(res, 'Mise à jour de la salle');
    if (!result.ok) {
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    isModalOpen.value = false;
    fetchGyms();
    notificationStore.showNotification('Mise à jour réussie', 'success');
  } catch {
    notificationStore.showNotification('Mise à jour de la salle — erreur réseau.', 'error', 8000);
  }
};

const handleDelete = (id: number) => {
  confirmStore.confirm({
    title: 'Supprimer la salle',
    message: 'Attention: Cela supprimera tout le contenu de cette salle.',
    confirmText: 'Supprimer',
    onConfirm: async () => {
      try {
        const res = await fetch(`/api/super/gyms/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authStore.token}` }
        });
        const delResult = await readFetchResult(res, 'Suppression de la salle');
        if (!delResult.ok) {
          notificationStore.showNotification(delResult.message, 'error', 8000);
          return;
        }
        fetchGyms();
        notificationStore.showNotification('Salle supprimée', 'success');
      } catch {
        notificationStore.showNotification('Suppression de la salle — erreur réseau.', 'error', 8000);
      }
    }
  });
};

const resetTrial = (gym: Gym) => {
  const newEnd = new Date();
  newEnd.setDate(newEnd.getDate() + 15);
  confirmStore.confirm({
    title: 'Réactiver l\'essai',
    message: `Offrir 15 jours d'essai à ${gym.name} ?`,
    onConfirm: async () => {
      try {
        const res = await fetch(`/api/super/gyms/${gym.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.token}` },
          body: JSON.stringify({ ...gym, subscriptionEnd: newEnd.toISOString(), status: 'ACTIVE' }),
        });
        const trialResult = await readFetchResult(res, "Réactivation de l'essai");
        if (!trialResult.ok) {
          notificationStore.showNotification(trialResult.message, 'error', 8000);
          return;
        }
        fetchGyms();
        notificationStore.showNotification('Essai de 15 jours activé', 'success');
      } catch {
        notificationStore.showNotification("Réactivation de l'essai — erreur réseau.", 'error', 8000);
      }
    }
  });
};

const getRemainingDays = (dateStr: string) => {
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
};

const isTrial = (gym: any) => {
  if (!gym.subscriptionEnd || !gym.createdAt) return true;
  const trialEnd = new Date(gym.createdAt);
  trialEnd.setDate(trialEnd.getDate() + 15);
  // It's a trial if subscriptionEnd is not further than trialEnd (15 days)
  return new Date(gym.subscriptionEnd) <= trialEnd;
};
</script>
