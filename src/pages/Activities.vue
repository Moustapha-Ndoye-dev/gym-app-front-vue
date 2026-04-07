<template>
  <div class="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 text-slate-900 font-sans">
    <!-- Header Compact -->
    <div class="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100 text-white">
          <Activity class="h-5 w-5" />
        </div>
        <div>
          <h1 class="text-base font-black uppercase tracking-tight leading-none">Activités</h1>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Catalogue des disciplines</p>
        </div>
      </div>
      <button 
        @click="openAddModal"
        class="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl shadow-md transition-all font-black uppercase tracking-widest text-[9px] flex items-center gap-2"
      >
        <Plus class="h-3.5 w-3.5" /> Nouvelle
      </button>
    </div>

    <!-- Main Grid Container -->
    <div class="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
      <div class="p-4 border-b border-slate-50 bg-slate-50/30">
        <div class="relative w-full max-w-xs group">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-600" />
          <input v-model="searchTerm" @input="currentPage = 1" type="text" placeholder="Filtrer..." class="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all" />
        </div>
      </div>

      <div v-if="loading" class="p-20 text-center">
        <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>

      <div v-else class="p-6">
        <div v-if="filtered.length === 0" class="py-20 text-center space-y-4 px-4">
          <Dumbbell class="h-16 w-16 text-slate-200 mx-auto" />
          <p class="text-sm font-black uppercase tracking-widest text-slate-500">
            {{ activities.length === 0 ? 'Aucune activité pour le moment' : 'Aucun résultat pour ce filtre' }}
          </p>
          <p class="text-[11px] font-bold text-slate-400 max-w-sm mx-auto leading-relaxed">
            <template v-if="activities.length === 0">Ajoutez votre première discipline avec le bouton « Nouvelle ».</template>
            <template v-else>Modifiez ou effacez le texte de recherche pour voir toute la liste.</template>
          </p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div v-for="activity in paginated" :key="activity.id" class="group bg-slate-50 border border-slate-100 p-4 rounded-2xl hover:bg-white hover:shadow-xl hover:border-indigo-200 transition-all duration-300 border-l-4 border-l-indigo-500 flex flex-col justify-between min-h-[170px]">
            <div class="space-y-3">
              <div class="flex justify-between items-start gap-3">
                <h3 class="flex-1 text-[13px] font-black text-slate-900 leading-tight group-hover:text-indigo-600 break-words">
                  {{ activity.name }}
                </h3>
                <div class="flex gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                  <button @click="openEditModal(activity)" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit class="h-3.5 w-3.5" /></button>
                  <button @click="handleDelete(activity)" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 class="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <p class="text-[10px] font-bold text-slate-400 leading-relaxed break-words">
                {{ activity.description || 'Aucune description disponible.' }}
              </p>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <span class="text-[8px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-md">Opérationnel</span>
              <ChevronRight class="h-3 w-3 text-slate-300 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex justify-center gap-1 mt-8">
          <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="['w-7 h-7 rounded-lg text-[9px] font-black transition-all', currentPage === page ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100']">
            {{ page }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal CRUD -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300 text-slate-900 font-sans">
        <div class="bg-white rounded-[2rem] p-8 max-w-xs w-full shadow-2xl relative">
          <h2 class="text-base font-black uppercase mb-6 tracking-tight">{{ currentActivity.id ? 'Modifier' : 'Nouvelle' }}</h2>
          <form @submit.prevent="handleSave" class="space-y-4">
            <div v-if="activityFormError" role="alert" class="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-[11px] font-semibold text-rose-800 leading-snug">
              {{ activityFormError }}
            </div>
            <input v-model="currentActivity.name" required :minlength="STRING_LIMITS.labelName.min" :maxlength="STRING_LIMITS.labelName.max" placeholder="Nom de l'activité" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-bold outline-none focus:border-indigo-600 transition-all" />
            <textarea v-model="currentActivity.description" :maxlength="STRING_LIMITS.description.max" placeholder="Description" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-bold outline-none resize-none h-24"></textarea>
            <div class="flex gap-2 pt-2">
              <button type="button" @click="isModalOpen = false; activityFormError = ''" class="flex-1 py-2 text-[10px] font-black uppercase text-slate-400">Annuler</button>
              <button type="submit" class="flex-[2] py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 shadow-lg transition-all">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Plus, Edit, Trash2, Dumbbell, Search, Activity, ChevronRight } from 'lucide-vue-next';
import { useConfirmStore } from '../stores/confirm';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { readFetchResult } from '../lib/getApiErrorMessage';
import { STRING_LIMITS } from '../lib/stringLimits';

const authStore = useAuthStore();
const confirmStore = useConfirmStore();
const notificationStore = useNotificationStore();

type ActivityType = { id: number; name: string; description: string | null; };

const activities = ref<ActivityType[]>([]);
const loading = ref(true);
const activityFormError = ref('');
const isModalOpen = ref(false);
const currentActivity = ref<Partial<ActivityType>>({});
const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 8;

const fetchActivities = async () => {
  loading.value = true;
  try {
    const res = await fetch('/api/activities', { headers: { 'Authorization': `Bearer ${authStore.token}` } });
    const result = await readFetchResult<ActivityType[]>(res, 'Chargement des activités');
    if (!result.ok) {
      activities.value = [];
      notificationStore.showNotification(result.message, 'error', 8000);
    } else {
      activities.value = Array.isArray(result.data) ? result.data : [];
    }
  } catch {
    notificationStore.showNotification(
      'Chargement des activités — impossible de contacter le serveur.',
      'error',
      8000
    );
  } finally { loading.value = false; }
};

onMounted(fetchActivities);

const filtered = computed(() => activities.value.filter(a => a.name.toLowerCase().includes(searchTerm.value.toLowerCase())));
const totalPages = computed(() => Math.ceil(filtered.value.length / itemsPerPage));
const paginated = computed(() => filtered.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage));

const openAddModal = () => {
  activityFormError.value = '';
  currentActivity.value = { name: '', description: '' };
  isModalOpen.value = true;
};
const openEditModal = (a: ActivityType) => {
  activityFormError.value = '';
  currentActivity.value = {
    ...a,
    description: a.description ?? '',
  };
  isModalOpen.value = true;
};

const handleSave = async () => {
  const name = currentActivity.value.name?.trim() ?? '';
  const description = currentActivity.value.description?.trim() ?? '';
  if (name.length < STRING_LIMITS.labelName.min) {
    activityFormError.value =
      "Indiquez le nom de l'activité (au moins 2 caractères).";
    notificationStore.showNotification(activityFormError.value, 'error', 8000);
    return;
  }
  if (name.length > STRING_LIMITS.labelName.max) {
    activityFormError.value = `Le nom ne peut pas dépasser ${STRING_LIMITS.labelName.max} caractères.`;
    notificationStore.showNotification(activityFormError.value, 'error', 8000);
    return;
  }
  if (description.length > STRING_LIMITS.description.max) {
    activityFormError.value = `La description ne peut pas dépasser ${STRING_LIMITS.description.max} caractères.`;
    notificationStore.showNotification(activityFormError.value, 'error', 8000);
    return;
  }
  try {
    const method = currentActivity.value.id ? 'PUT' : 'POST';
    const url = currentActivity.value.id ? `/api/activities/${currentActivity.value.id}` : '/api/activities';
    const payload = {
      name,
      description,
    };
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.token}` },
      body: JSON.stringify(payload),
    });
    const result = await readFetchResult(res, "Enregistrement de l'activité");
    if (!result.ok) {
      activityFormError.value = result.message;
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    activityFormError.value = '';
    isModalOpen.value = false;
    fetchActivities();
    notificationStore.showNotification('Activité enregistrée', 'success');
  } catch {
    const msg = "Enregistrement de l'activité — erreur réseau.";
    activityFormError.value = msg;
    notificationStore.showNotification(msg, 'error', 8000);
  }
};

const handleDelete = (a: ActivityType) => {
  confirmStore.confirm({
    title: 'Supprimer',
    message: "Supprimer cette activité ?",
    onConfirm: async () => {
      try {
        const res = await fetch(`/api/activities/${a.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authStore.token}` },
        });
        const delResult = await readFetchResult(res, "Suppression de l'activité");
        if (!delResult.ok) {
          notificationStore.showNotification(delResult.message, 'error', 8000);
          return;
        }
        fetchActivities();
        notificationStore.showNotification('Activité supprimée', 'success');
      } catch {
        notificationStore.showNotification(
          "Suppression de l'activité — erreur réseau.",
          'error',
          8000
        );
      }
    },
  });
};
</script>
