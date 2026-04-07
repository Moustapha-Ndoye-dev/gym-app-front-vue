<template>
  <div class="space-y-4 sm:space-y-5 text-slate-900">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight">Abonnements</h1>
        <p class="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Gérez les formules d'abonnement.</p>
      </div>
      <button
        @click="openAddModal"
        class="bg-indigo-600 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all text-[11px] font-bold w-full sm:w-auto"
      >
        <Plus class="h-3.5 w-3.5 mr-1.5" />
        Nouvel Abonnement
      </button>
    </div>

    <!-- Mobile View (Cards) -->
    <div class="lg:hidden space-y-2.5">
      <div
        v-if="subscriptions.length === 0"
        class="bg-white p-8 rounded-xl shadow-sm border border-slate-200/60 text-center"
      >
        <CreditCard class="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <p class="text-[13px] font-bold leading-tight">Aucun abonnement trouvé</p>
        <p class="text-[11px] text-slate-500 mt-1">Commencez par ajouter votre premier abonnement.</p>
      </div>
      <div v-else v-for="sub in subscriptions" :key="sub.id" class="bg-white p-3 rounded-xl shadow-sm border border-slate-200/60 flex flex-col gap-2.5">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm shrink-0">
              <CreditCard class="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <div class="text-[13px] font-bold leading-tight mb-0.5">{{ sub.name }}</div>
              <div class="text-[11px] font-medium text-slate-500 line-clamp-1">{{ sub.features }}</div>
              <div v-if="sub.activities?.length" class="flex flex-wrap gap-1 mt-1.5">
                <span v-for="a in sub.activities" :key="a.id" class="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">{{ a.name }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-2.5 border-t border-slate-100 mt-1">
          <div>
            <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Prix</div>
            <div class="text-[13px] font-extrabold text-emerald-600">{{ sub.price.toLocaleString() }} FCFA</div>
          </div>
        </div>
        <div class="flex gap-2 pt-2.5 border-t border-slate-100 mt-1">
          <button @click="openEditModal(sub)" class="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-bold hover:bg-indigo-100 transition-colors border border-indigo-100">
            <Edit class="h-3.5 w-3.5" /> Modifier
          </button>
          <button @click="handleDelete(sub.id)" class="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold hover:bg-red-100 transition-colors border border-red-100">
            <Trash2 class="h-3.5 w-3.5" /> Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop View (Table) -->
    <div class="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100">
          <thead class="bg-slate-50/80">
            <tr>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Abonnement</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Prix</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Activités</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Description</th>
              <th class="px-4 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100/80">
            <tr v-if="subscriptions.length === 0">
              <td colspan="5" class="px-4 py-12 text-center">
                <CreditCard class="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p class="text-[13px] font-bold leading-tight">Aucun abonnement trouvé</p>
                <p class="text-[11px] text-slate-500 mt-1">Commencez par ajouter votre premier abonnement.</p>
              </td>
            </tr>
            <tr v-else v-for="sub in subscriptions" :key="sub.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-2.5 shadow-sm">
                    <CreditCard class="h-4 w-4 text-indigo-500" />
                  </div>
                  <div class="text-[12px] font-bold">{{ sub.name }}</div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="text-[12px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                  {{ sub.price.toLocaleString() }} FCFA
                </span>
              </td>
              <td class="px-4 py-3">
                <div v-if="sub.activities?.length" class="flex flex-wrap gap-1 max-w-[200px]">
                  <span v-for="a in sub.activities" :key="a.id" class="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100 whitespace-nowrap">{{ a.name }}</span>
                </div>
                <span v-else class="text-[10px] text-slate-400">—</span>
              </td>
              <td class="px-4 py-3">
                <div class="text-[10px] font-medium text-slate-500 line-clamp-1 max-w-xs">{{ sub.features || '-' }}</div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right text-[11px] font-medium">
                <button @click="openEditModal(sub)" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors mr-1">
                  <Edit class="h-3.5 w-3.5" />
                </button>
                <button @click="handleDelete(sub.id)" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 z-50 text-slate-900">
      <div class="bg-white rounded-2xl p-5 max-w-md w-full shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <h2 class="text-lg font-extrabold mb-4 tracking-tight">{{ currentSub.id ? 'Modifier' : 'Ajouter' }} un abonnement</h2>
        <form @submit.prevent="handleSave" class="space-y-3">
          <div v-if="formError" role="alert" class="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-[11px] font-semibold text-rose-800 leading-snug">
            {{ formError }}
          </div>
          <div>
            <label for="subscription-name" class="block text-[11px] font-bold text-slate-700 mb-1">Nom de l'abonnement</label>
            <input id="subscription-name" v-model="currentSub.name" type="text" required :minlength="STRING_LIMITS.labelName.min" :maxlength="STRING_LIMITS.labelName.max" class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium transition-all outline-none" placeholder="Ex: Pass Premium" />
          </div>
          <div>
            <label for="subscription-price" class="block text-[11px] font-bold text-slate-700 mb-1">Prix (FCFA)</label>
            <input id="subscription-price" v-model.number="currentSub.price" type="number" step="0.01" required min="0" class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium transition-all outline-none" />
          </div>
          <div>
            <label for="subscription-features" class="block text-[11px] font-bold text-slate-700 mb-1">Description (Optionnel)</label>
            <textarea id="subscription-features" v-model="currentSub.features" :maxlength="STRING_LIMITS.description.max" class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium transition-all outline-none resize-none h-24" placeholder="Détails de l'abonnement..."></textarea>
          </div>

          <div>
            <p class="block text-[11px] font-bold text-slate-700 mb-1">Activités incluses <span class="text-slate-400 font-medium normal-case">(optionnel)</span></p>
            <p class="text-[10px] text-slate-500 mb-2">Ces disciplines apparaîtront sur la fiche des adhérents ayant cette formule.</p>
            <div v-if="activitiesList.length === 0" class="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-[10px] font-semibold text-amber-900">
              Aucune activité enregistrée. Créez-en dans le menu « Activités » avant de lier un abonnement.
            </div>
            <div v-else class="max-h-36 overflow-y-auto rounded-lg border border-slate-200/80 bg-slate-50/80 p-2 space-y-2">
              <label
                v-for="a in activitiesList"
                :key="a.id"
                class="flex items-center gap-2 text-[11px] font-medium text-slate-800 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  :checked="(currentSub.activityIds || []).includes(a.id)"
                  @change="toggleActivity(a.id)"
                />
                <span>{{ a.name }}</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end space-x-2 mt-6 pt-3 border-t border-slate-100">
            <button type="button" @click="isModalOpen = false; formError = ''" class="px-3 py-2 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-colors">Annuler</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[11px] font-bold shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus, Edit, Trash2, CreditCard } from 'lucide-vue-next';
import { useConfirmStore } from '../stores/confirm';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { readFetchResult } from '../lib/getApiErrorMessage';
import { STRING_LIMITS } from '../lib/stringLimits';

const authStore = useAuthStore();

type ActivityLite = { id: number; name: string };

type Subscription = {
  id: number;
  name: string;
  features: string | null;
  price: number;
  activities?: ActivityLite[];
  activityIds?: number[];
};

const subscriptions = ref<Subscription[]>([]);
const activitiesList = ref<ActivityLite[]>([]);
const isModalOpen = ref(false);
const formError = ref('');
const currentSub = ref<Partial<Subscription>>({});
const confirmStore = useConfirmStore();
const notificationStore = useNotificationStore();

const fetchActivities = async () => {
  try {
    const res = await fetch('/api/activities', {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const result = await readFetchResult<ActivityLite[]>(res, 'Chargement des activités');
    activitiesList.value = result.ok && Array.isArray(result.data) ? result.data : [];
  } catch {
    activitiesList.value = [];
  }
};

const fetchData = async () => {
  try {
    const res = await fetch('/api/subscriptions', { headers: { 'Authorization': `Bearer ${authStore.token}` } });
    const result = await readFetchResult<Subscription[]>(res, 'Chargement des abonnements');
    if (!result.ok) {
      subscriptions.value = [];
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    subscriptions.value = Array.isArray(result.data) ? result.data : [];
  } catch {
    notificationStore.showNotification(
      'Chargement des abonnements — impossible de contacter le serveur.',
      'error',
      8000
    );
  }
};

onMounted(() => {
  fetchData();
  fetchActivities();
});

const toggleActivity = (id: number) => {
  const cur = currentSub.value.activityIds ?? [];
  if (cur.includes(id)) {
    currentSub.value.activityIds = cur.filter((x) => x !== id);
  } else {
    currentSub.value.activityIds = [...cur, id];
  }
};

const openAddModal = () => {
  formError.value = '';
  currentSub.value = { name: '', features: '', price: 0, activityIds: [] };
  isModalOpen.value = true;
};

const openEditModal = (sub: Subscription) => {
  formError.value = '';
  currentSub.value = {
    ...sub,
    features: sub.features ?? '',
    activityIds: sub.activities?.map((a) => a.id) ?? [],
  };
  isModalOpen.value = true;
};

const handleSave = async () => {
  const method = currentSub.value.id ? 'PUT' : 'POST';
  const url = currentSub.value.id ? `/api/subscriptions/${currentSub.value.id}` : '/api/subscriptions';
  
  try {
    const name = currentSub.value.name?.trim() ?? '';
    const features = currentSub.value.features?.trim() ?? '';
    const priceNum = Number(currentSub.value.price ?? 0);
    const price = Number.isFinite(priceNum) ? priceNum : 0;

    if (name.length < STRING_LIMITS.labelName.min) {
      formError.value = "Indiquez un nom d'abonnement (au moins 2 caractères).";
      notificationStore.showNotification(formError.value, 'error', 8000);
      return;
    }
    if (name.length > STRING_LIMITS.labelName.max) {
      formError.value = `Le nom ne peut pas dépasser ${STRING_LIMITS.labelName.max} caractères.`;
      notificationStore.showNotification(formError.value, 'error', 8000);
      return;
    }
    if (features.length > STRING_LIMITS.description.max) {
      formError.value = `La description ne peut pas dépasser ${STRING_LIMITS.description.max} caractères.`;
      notificationStore.showNotification(formError.value, 'error', 8000);
      return;
    }
    if (price <= 0) {
      formError.value = 'Indiquez un prix valide supérieur à 0.';
      notificationStore.showNotification(formError.value, 'error', 8000);
      return;
    }

    const ids = currentSub.value.activityIds ?? [];
    const payload = {
      name,
      price,
      features,
      activityIds: ids,
    };
    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(payload),
    });
    const result = await readFetchResult(res, "Enregistrement de l'abonnement");
    if (!result.ok) {
      formError.value = result.message;
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    formError.value = '';
    isModalOpen.value = false;
    fetchData();
    notificationStore.showNotification('Abonnement enregistré', 'success');
  } catch {
    const msg = "Enregistrement de l'abonnement — erreur réseau.";
    formError.value = msg;
    notificationStore.showNotification(msg, 'error', 8000);
  }
};

const handleDelete = (id: number) => {
  confirmStore.confirm({
    title: 'Supprimer l\'abonnement',
    message: 'Êtes-vous sûr de vouloir supprimer cet abonnement ?',
    confirmText: 'Supprimer',
    onConfirm: async () => {
      try {
        const res = await fetch(`/api/subscriptions/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authStore.token}` }
        });
        const delResult = await readFetchResult(res, "Suppression de l'abonnement");
        if (!delResult.ok) {
          notificationStore.showNotification(delResult.message, 'error', 8000);
          return;
        }
        fetchData();
        notificationStore.showNotification('Abonnement supprimé', 'success');
      } catch {
        notificationStore.showNotification(
          "Suppression de l'abonnement — erreur réseau.",
          'error',
          8000
        );
      }
    }
  });
};
</script>
