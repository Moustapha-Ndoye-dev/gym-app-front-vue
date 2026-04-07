<template>
  <div class="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 text-slate-900">
    <!-- Unified Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-slate-900">
      <div class="flex items-center gap-4 text-slate-900">
        <div class="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-rose-500 shadow-lg shadow-rose-100">
          <ShieldCheck class="h-6 w-6" />
        </div>
        <div class="text-slate-900">
          <h1 class="text-xl font-black tracking-tight uppercase">Utilisateurs Système</h1>
          <p class="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1 opacity-60">Gestion des privilèges Root</p>
        </div>
      </div>
      <button @click="openAddModal" class="px-5 py-2.5 bg-slate-900 hover:bg-rose-600 text-white rounded-xl shadow-lg transition-all font-black uppercase tracking-widest text-[10px] flex items-center gap-2">
        <UserPlus class="h-3.5 w-3.5" /> Nouvel Admin Root
      </button>
    </div>

    <div class="grid grid-cols-1 gap-6 text-slate-900">
      <!-- Admins List -->
      <div class="text-slate-900">
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-slate-900">
          <div class="p-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center text-slate-900">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrateurs Actifs</span>
            <button @click="fetchAdmins" class="p-1.5 hover:bg-white rounded-lg text-slate-300 transition-all text-slate-900"><RefreshCw :class="['h-3.5 w-3.5', loading ? 'animate-spin' : '']" /></button>
          </div>
          
          <div v-if="loading" class="p-20 text-center text-slate-900">
            <div class="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          <div v-else class="divide-y divide-slate-50 text-slate-900">
            <div v-for="admin in admins" :key="admin.id" class="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group text-slate-900">
              <div class="flex items-center gap-4 text-slate-900">
                <div class="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center font-black text-rose-500 border border-slate-800 uppercase shadow-lg">
                  {{ admin.username.charAt(0) }}
                </div>
                <div class="text-slate-900">
                  <div class="flex items-center gap-2">
                    <p class="text-[14px] font-black leading-none text-slate-900">{{ admin.username }}</p>
                    <span v-if="admin.username === 'superadmin'" class="px-1.5 py-0.5 bg-rose-500 text-white text-[7px] font-black rounded uppercase tracking-tighter">Principal</span>
                  </div>
                  <p class="text-[11px] font-bold text-indigo-600 mt-1">{{ admin.email }}</p>
                  <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Accès Root • Créé le {{ new Date(admin.createdAt).toLocaleDateString('fr-FR') }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3 text-slate-900">
                <div class="hidden md:flex flex-col items-end">
                  <span class="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded-lg border border-emerald-100 uppercase tracking-widest shadow-sm">Privilèges Totaux</span>
                </div>
                <button v-if="admin.username !== 'superadmin'" @click="handleDelete(admin.id)" class="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100" title="Révoquer l'accès">
                  <Trash2 class="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200 text-slate-900">
      <div class="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200 relative overflow-hidden text-slate-900">
        <h2 class="text-lg font-black mb-6 uppercase tracking-tight text-slate-900">Nouvel Admin Root</h2>
        <form @submit.prevent="handleCreate" class="space-y-4 text-slate-900">
          <div v-if="formError" role="alert" class="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-[11px] font-semibold text-rose-800 leading-snug">
            {{ formError }}
          </div>
          <div class="space-y-1.5 text-slate-900">
            <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Identifiant</label>
            <input v-model="newAdmin.username" required type="text" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-4 focus:ring-rose-500/10 outline-none transition-all text-slate-900 text-sm" />
          </div>
          <div class="space-y-1.5 text-slate-900">
            <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Email</label>
            <input v-model="newAdmin.email" required type="email" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-4 focus:ring-rose-500/10 outline-none transition-all text-slate-900 text-sm" />
          </div>
          <div class="space-y-1.5 text-slate-900">
            <label class="text-[10px] font-bold text-slate-400 uppercase ml-1">Mot de passe</label>
            <input v-model="newAdmin.password" required type="password" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-4 focus:ring-rose-500/10 outline-none transition-all text-slate-900 text-sm" />
          </div>
          <div class="pt-4 flex flex-col gap-2 text-slate-900">
            <button type="submit" class="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] hover:bg-indigo-600 transition-all shadow-xl tracking-widest text-slate-900">Créer l'accès Root</button>
            <button type="button" @click="isModalOpen = false; formError = ''" class="w-full py-2 text-[10px] font-bold text-slate-400 uppercase hover:text-slate-600 transition-colors text-slate-900">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ShieldCheck, UserPlus, Trash2, Key, RefreshCw } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { useConfirmStore } from '../stores/confirm';
import { readFetchResult } from '../lib/getApiErrorMessage';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const confirmStore = useConfirmStore();

const admins = ref<any[]>([]);
const loading = ref(true);
const isModalOpen = ref(false);
const formError = ref('');
const newAdmin = ref({ username: '', password: '', email: '' });

const fetchAdmins = async () => {
  loading.value = true;
  try {
    const res = await fetch('/api/super/admins', { headers: { 'Authorization': `Bearer ${authStore.token}` } });
    const result = await readFetchResult<unknown[]>(res, 'Chargement des super-admins');
    if (!result.ok) {
      admins.value = [];
      notificationStore.showNotification(result.message, 'error', 8000);
    } else {
      admins.value = Array.isArray(result.data) ? result.data : [];
    }
  } catch {
    notificationStore.showNotification(
      'Chargement des super-admins — impossible de contacter le serveur.',
      'error',
      8000
    );
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAdmins);

const openAddModal = () => {
  formError.value = '';
  newAdmin.value = { username: '', password: '', email: '' }; // Force reset
  isModalOpen.value = true;
};

const handleCreate = async () => {
  try {
    const res = await fetch('/api/super/admins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.token}` },
      body: JSON.stringify(newAdmin.value),
    });
    const result = await readFetchResult(res, 'Création du super-admin');
    if (!result.ok) {
      formError.value = result.message;
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    formError.value = '';
    isModalOpen.value = false;
    newAdmin.value = { username: '', password: '', email: '' };
    fetchAdmins();
    notificationStore.showNotification('SuperAdmin créé', 'success');
  } catch {
    const msg = 'Création du super-admin — erreur réseau.';
    formError.value = msg;
    notificationStore.showNotification(msg, 'error', 8000);
  }
};

const handleDelete = (id: number) => {
  confirmStore.confirm({
    title: 'Révoquer l\'accès',
    message: 'Supprimer ce compte SuperAdmin ?',
    onConfirm: async () => {
      try {
        const res = await fetch(`/api/super/admins/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authStore.token}` }
        });
        const delResult = await readFetchResult(res, 'Révocation du super-admin');
        if (!delResult.ok) {
          notificationStore.showNotification(delResult.message, 'error', 8000);
          return;
        }
        fetchAdmins();
        notificationStore.showNotification('Accès révoqué', 'success');
      } catch {
        notificationStore.showNotification('Révocation — erreur réseau.', 'error', 8000);
      }
    }
  });
};
</script>
