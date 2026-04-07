<template>
  <div class="space-y-4 sm:space-y-5 animate-in fade-in duration-500 text-slate-900">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-slate-900">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight">Utilisateurs</h1>
        <p class="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Gérez les accès au système.</p>
      </div>
      <button
        @click="openAddModal"
        class="bg-indigo-600 text-white px-3 py-2 rounded-lg flex items-center justify-center shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all text-[11px] font-bold w-full sm:w-auto"
      >
        <Plus class="h-3.5 w-3.5 mr-1.5" />
        Nouvel Utilisateur
      </button>
    </div>

    <!-- Mobile View (Cards) -->
    <div class="lg:hidden space-y-2.5 text-slate-900">
      <div
        v-if="users.length === 0"
        class="bg-white p-8 rounded-xl shadow-sm border border-slate-200/60 text-center"
      >
        <UserIcon class="h-10 w-10 text-slate-300 mx-auto mb-3" />
        <p class="text-[13px] font-bold text-slate-900 leading-tight">Aucun utilisateur trouvé</p>
        <p class="text-[11px] text-slate-500 mt-1">Cliquez sur « Nouvel Utilisateur » pour commencer.</p>
      </div>
      <div v-else v-for="user in users" :key="user.id" class="bg-white p-3 rounded-xl shadow-sm border border-slate-200/60 flex flex-col gap-2.5 text-slate-900">
        <div class="flex justify-between items-start text-slate-900">
          <div class="flex items-center gap-2.5 text-slate-900">
            <div class="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-sm shrink-0">
              <UserIcon class="h-4 w-4 text-indigo-500" />
            </div>
            <div class="text-slate-900">
              <div class="text-[13px] font-bold text-slate-900 leading-tight mb-0.5">{{ user.username }}</div>
              
            </div>
          </div>
          <span :class="['px-2 py-0.5 inline-flex text-[9px] font-bold rounded border items-center shrink-0', user.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : user.role === 'controller' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100']">
            <Shield v-if="user.role === 'admin'" class="h-3 w-3 mr-1" />
            {{ user.role === 'admin' ? 'Admin' : user.role === 'controller' ? 'Contrôleur' : 'Caissier' }}
          </span>
        </div>
        <div class="pt-2.5 border-t border-slate-100 mt-1 text-slate-900">
          <div class="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Créé le</div>
          <div class="text-[11px] font-bold text-slate-700">{{ formatDate(user.createdAt) }}</div>
        </div>
        <div class="flex gap-2 pt-2.5 border-t border-slate-100 mt-1">
          <button @click="openEditModal(user)" class="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[11px] font-bold hover:bg-indigo-100 transition-colors border border-indigo-100">
            <Edit class="h-3.5 w-3.5" /> Modifier
          </button>
          <button 
            @click="handleDelete(user.id)" 
            :disabled="user.username === 'admin'"
            :class="['flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors border', user.username === 'admin' ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100']"
          >
            <Trash2 class="h-3.5 w-3.5" /> Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Desktop View (Table) -->
    <div class="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden text-slate-900">
      <div class="overflow-x-auto text-slate-900">
        <table class="min-w-full divide-y divide-slate-100 text-slate-900">
          <thead class="bg-slate-50/80 text-slate-900">
            <tr>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Utilisateur</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Rôle</th>
              <th class="px-4 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Date de création</th>
              <th class="px-4 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-100/80 text-slate-900">
            <tr v-if="users.length === 0" class="text-slate-900">
              <td colspan="4" class="px-4 py-12 text-center text-slate-900">
                <UserIcon class="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p class="text-[13px] font-bold text-slate-900 leading-tight">Aucun utilisateur trouvé</p>
                <p class="text-[11px] text-slate-500 mt-1">Utilisez le bouton en haut pour ajouter un utilisateur.</p>
              </td>
            </tr>
            <tr v-else v-for="user in users" :key="user.id" class="hover:bg-slate-50/50 transition-colors group text-slate-900">
              <td class="px-4 py-3 whitespace-nowrap text-slate-900">
                <div class="flex items-center text-slate-900">
                  <div class="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mr-2.5 shadow-sm">
                    <UserIcon class="h-4 w-4 text-indigo-500" />
                  </div>
                  <div class="text-slate-900">
                    <div class="text-[12px] font-bold text-slate-900">{{ user.username }}</div>
                    
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-slate-900">
                <span :class="['px-2 py-1 inline-flex text-[9px] font-bold rounded-md border items-center', user.role === 'admin' ? 'bg-purple-50 text-purple-600 border-purple-100' : user.role === 'controller' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100']">
                  <Shield v-if="user.role === 'admin'" class="h-3 w-3 mr-1" />
                  {{ user.role === 'admin' ? 'Administrateur' : user.role === 'controller' ? 'Contrôleur' : 'Caissier' }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-[11px] font-bold text-slate-700">
                {{ formatDate(user.createdAt) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-right text-[11px] font-medium">
                <button @click="openEditModal(user)" class="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors mr-1">
                  <Edit class="h-3.5 w-3.5" />
                </button>
                <button @click="handleDelete(user.id)" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" :disabled="user.username === 'admin'">
                  <Trash2 :class="['h-3.5 w-3.5', user.username === 'admin' ? 'opacity-50 cursor-not-allowed' : '']" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 z-50 text-slate-900">
      <div class="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl border border-slate-100">
        <h2 class="text-lg font-extrabold text-slate-900 mb-4 tracking-tight">{{ currentUser.id ? 'Modifier' : 'Ajouter' }} un utilisateur</h2>
        <form @submit.prevent="handleSave" class="space-y-3">
          <div
            v-if="formError"
            role="alert"
            class="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-[11px] font-semibold leading-snug text-rose-800"
          >
            {{ formError }}
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Nom d'utilisateur</label>
            <input
              v-model="currentUser.username"
              type="text"
              required
              :minlength="STRING_LIMITS.username.min"
              :maxlength="STRING_LIMITS.username.max"
              autocomplete="username"
              class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none"
              :disabled="currentUser.username === 'admin'"
              @input="formError = ''"
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Mot de passe {{ currentUser.id ? '(laisser vide pour ne pas changer)' : '' }}</label>
            <input
              v-model="password"
              type="password"
              :required="!currentUser.id"
              :maxlength="STRING_LIMITS.password.max"
              autocomplete="new-password"
              class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none"
              @input="formError = ''"
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-slate-700 mb-1">Rôle</label>
            <select v-model="currentUser.role" required class="block w-full px-2.5 py-2 bg-slate-50 border border-slate-200/60 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-[11px] font-medium text-slate-900 transition-all outline-none" :disabled="currentUser.username === 'admin'">
              <option value="cashier">Caissier</option>
              <option value="controller">Contrôleur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          <div class="flex justify-end space-x-2 mt-6 pt-3 border-t border-slate-100">
            <button type="button" @click="closeModal" class="px-3 py-2 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-colors">Annuler</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-[11px] font-bold shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-all">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Plus, Edit, Trash2, Shield, User as UserIcon } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { useConfirmStore } from '../stores/confirm';
import { readFetchResult } from '../lib/getApiErrorMessage';
import { STRING_LIMITS } from '../lib/stringLimits';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const confirmStore = useConfirmStore();

type User = {
  id: number;
  username: string;
  role: string;
  createdAt: string;
  gymId?: number;
};

const users = ref<User[]>([]);

const isModalOpen = ref(false);
const currentUser = ref<Partial<User>>({ role: 'cashier' });
const password = ref('');
const formError = ref('');

const closeModal = () => {
  formError.value = '';
  isModalOpen.value = false;
};

const fetchUsers = async () => {
  try {
    const res = await fetch('/api/users', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    const result = await readFetchResult<User[]>(res, 'Chargement des utilisateurs');
    if (!result.ok) {
      users.value = [];
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    users.value = Array.isArray(result.data) ? result.data : [];
  } catch {
    notificationStore.showNotification(
      'Chargement des utilisateurs — impossible de contacter le serveur.',
      'error',
      8000
    );
  }
};

onMounted(fetchUsers);

const openAddModal = () => {
  formError.value = '';
  currentUser.value = { role: 'cashier', username: '' };
  password.value = '';
  isModalOpen.value = true;
};

const openEditModal = (user: User) => {
  formError.value = '';
  currentUser.value = { ...user };
  password.value = '';
  isModalOpen.value = true;
};

const handleSave = async () => {
  const username = String(currentUser.value.username || '').trim();
  if (
    username.length < STRING_LIMITS.username.min ||
    username.length > STRING_LIMITS.username.max
  ) {
    formError.value = `Nom d'utilisateur : entre ${STRING_LIMITS.username.min} et ${STRING_LIMITS.username.max} caractères.`;
    notificationStore.showNotification(formError.value, 'error', 8000);
    return;
  }
  if (!currentUser.value.id) {
    if (
      password.value.length < STRING_LIMITS.password.min ||
      password.value.length > STRING_LIMITS.password.max
    ) {
      formError.value = `Mot de passe : entre ${STRING_LIMITS.password.min} et ${STRING_LIMITS.password.max} caractères.`;
      notificationStore.showNotification(formError.value, 'error', 8000);
      return;
    }
  } else if (password.value) {
    if (
      password.value.length < STRING_LIMITS.password.min ||
      password.value.length > STRING_LIMITS.password.max
    ) {
      formError.value = `Mot de passe : entre ${STRING_LIMITS.password.min} et ${STRING_LIMITS.password.max} caractères.`;
      notificationStore.showNotification(formError.value, 'error', 8000);
      return;
    }
  }

  const method = currentUser.value.id ? 'PUT' : 'POST';
  const url = currentUser.value.id ? `/api/users/${currentUser.value.id}` : '/api/users';
  
  const dataToSave = {
    ...currentUser.value,
    username,
    password: password.value || undefined,
    gymId: (currentUser.value as any).gymId || authStore.user?.gymId,
  };

  try {
    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(dataToSave),
    });
    const saveResult = await readFetchResult(res, "Enregistrement de l'utilisateur");
    if (!saveResult.ok) {
      formError.value = saveResult.message;
      notificationStore.showNotification(saveResult.message, 'error', 8000);
      return;
    }
    closeModal();
    password.value = '';
    fetchUsers();
    notificationStore.showNotification('Utilisateur enregistré', 'success');
  } catch {
    const msg =
      "Enregistrement de l'utilisateur — impossible de contacter le serveur.";
    formError.value = msg;
    notificationStore.showNotification(msg, 'error', 8000);
  }
};

const handleDelete = (id: number) => {
  confirmStore.confirm({
    title: 'Supprimer l\'utilisateur',
    message: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
    confirmText: 'Supprimer',
    onConfirm: async () => {
      try {
        const res = await fetch(`/api/users/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authStore.token}` }
        });
        const delResult = await readFetchResult(res, "Suppression de l'utilisateur");
        if (!delResult.ok) {
          notificationStore.showNotification(delResult.message, 'error', 8000);
          return;
        }
        fetchUsers();
        notificationStore.showNotification('Utilisateur supprimé', 'success');
      } catch {
        notificationStore.showNotification(
          "Suppression de l'utilisateur — erreur réseau.",
          'error',
          8000
        );
      }
    }
  });
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('fr-FR');
};
</script>
