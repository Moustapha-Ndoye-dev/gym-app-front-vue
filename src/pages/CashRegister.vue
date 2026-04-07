<template>
  <div class="space-y-4 sm:space-y-6 animate-in fade-in duration-500 text-slate-900">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-black tracking-tight">Journal de Caisse</h1>
        <p class="text-slate-500 text-[12px] font-medium">Suivi des flux financiers en temps réel.</p>
      </div>
      <button
        @click="openModal"
        class="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all text-[11px] font-black uppercase tracking-widest w-full sm:w-auto"
      >
        <Plus class="h-4 w-4 mr-2" /> Nouvelle Opération
      </button>
    </div>

    <!-- Stats Quick View -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><ArrowUpRight class="h-6 w-6" /></div>
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase">Recettes</p>
          <p class="text-lg font-black">{{ stats.income.toLocaleString() }} FCFA</p>
        </div>
      </div>
      <div class="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center"><ArrowDownRight class="h-6 w-6" /></div>
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase">Dépenses</p>
          <p class="text-lg font-black">{{ stats.expense.toLocaleString() }} FCFA</p>
        </div>
      </div>
      <div class="bg-slate-900 p-5 rounded-[2rem] shadow-xl flex items-center gap-4 text-white">
        <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white"><TrendingUp class="h-6 w-6" /></div>
        <div>
          <p class="text-[10px] font-black text-slate-400 uppercase">Balance</p>
          <p class="text-lg font-black text-white">{{ stats.balance.toLocaleString() }} FCFA</p>
        </div>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
      <div class="relative flex-1 min-w-[200px]">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input 
          v-model="searchTerm"
          type="text" 
          placeholder="Rechercher une opération..." 
          class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all"
        />
      </div>
      <select 
        v-model="typeFilter"
        class="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/10"
      >
        <option value="all">Tous les types</option>
        <option value="income">Encaissements</option>
        <option value="expense">Décaissements</option>
      </select>
      <input 
        v-model="dateFilter"
        type="date" 
        class="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/10"
      />
    </div>

    <!-- Desktop Table -->
    <div class="hidden lg:block bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
      <table class="min-w-full divide-y divide-slate-100">
        <thead class="bg-slate-50/50">
          <tr>
            <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
            <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
            <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
            <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant</th>
            <th class="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-if="loading">
            <td colspan="5" class="p-20 text-center text-slate-400 font-bold uppercase text-[10px]">Chargement...</td>
          </tr>
          <tr v-else-if="currentItems.length === 0">
            <td colspan="5" class="p-20 text-center text-slate-400 font-bold uppercase text-[10px]">Aucune transaction trouvée</td>
          </tr>
          <tr v-else v-for="t in currentItems" :key="t.id" class="hover:bg-slate-50/50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-[12px] font-bold text-slate-500">
              {{ new Date(t.date).toLocaleDateString('fr-FR') }} <span class="opacity-50 ml-1">{{ new Date(t.date).toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'}) }}</span>
            </td>
            <td class="px-6 py-4 text-[13px] font-bold text-slate-900">{{ t.description }}</td>
            <td class="px-6 py-4">
              <span :class="['px-2 py-1 text-[9px] font-black rounded-lg uppercase border', t.type === 'income' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100']">
                {{ t.type === 'income' ? 'Encaissement' : 'Décaissement' }}
              </span>
            </td>
            <td :class="['px-6 py-4 font-black text-[14px]', t.type === 'income' ? 'text-emerald-600' : 'text-rose-600']">
              {{ t.type === 'income' ? '+' : '-' }}{{ t.amount.toLocaleString() }} FCFA
            </td>
            <td class="px-6 py-4 text-right">
              <button @click="handleDelete(t.id)" class="p-2 text-slate-300 hover:text-rose-600 transition-all"><Trash2 class="h-4 w-4" /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Bar -->
    <div v-if="totalPages > 1" class="flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm">
      <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Page {{ currentPage }} sur {{ totalPages }}</p>
      <div class="flex gap-2">
        <button 
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="p-2 rounded-xl bg-slate-50 text-slate-600 disabled:opacity-30 hover:bg-slate-100 transition-all"
        >
          <ChevronLeft class="h-5 w-5" />
        </button>
        <button 
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="p-2 rounded-xl bg-slate-50 text-slate-600 disabled:opacity-30 hover:bg-slate-100 transition-all"
        >
          <ChevronRight class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Modal: New Transaction -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-xl font-black uppercase tracking-tight">Opération Caisse</h2>
          <button @click="isModalOpen = false; transactionFormError = ''" class="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400"><X class="h-5 w-5" /></button>
        </div>
        <form @submit.prevent="handleSave" class="space-y-5">
          <div v-if="transactionFormError" role="alert" class="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-[11px] font-semibold text-rose-800 leading-snug">
            {{ transactionFormError }}
          </div>
          <div class="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 text-slate-900">
            <button type="button" @click="newTransaction.type = 'income'" :class="['flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all', newTransaction.type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400']">Recette (+)</button>
            <button type="button" @click="newTransaction.type = 'expense'" :class="['flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all', newTransaction.type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400']">Dépense (-)</button>
          </div>
          <div class="space-y-1.5 text-slate-900">
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Montant (FCFA)</label>
            <input v-model.number="newTransaction.amount" type="number" required step="0.01" min="0.01" class="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" placeholder="0.00" />
          </div>
          <div class="space-y-1.5 text-slate-900">
            <label class="text-[10px] font-black text-slate-400 uppercase ml-1">Motif / Description</label>
            <input v-model="newTransaction.description" type="text" required class="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" placeholder="Désignation..." />
          </div>
          <button type="submit" class="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all active:scale-95 text-xs">Valider l'opération</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Plus, Trash2, CreditCard, DollarSign, TrendingUp, Search, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, X } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { useConfirmStore } from '../stores/confirm';
import { readFetchResult } from '../lib/getApiErrorMessage';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const confirmStore = useConfirmStore();

type Transaction = {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
  user_id: number;
};

const transactions = ref<Transaction[]>([]);
const loading = ref(true);
const isModalOpen = ref(false);
const transactionFormError = ref('');
const newTransaction = ref<Partial<Transaction>>({ type: 'income' });

// Filters
const searchTerm = ref('');
const typeFilter = ref<'all' | 'income' | 'expense'>('all');
const dateFilter = ref('');

// Pagination
const currentPage = ref(1);
const itemsPerPage = 8;

const fetchTransactions = async () => {
  loading.value = true;
  try {
    const res = await fetch('/api/transactions', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    const result = await readFetchResult<Transaction[]>(res, 'Chargement des transactions');
    if (!result.ok) {
      transactions.value = [];
      notificationStore.showNotification(result.message, 'error', 8000);
    } else {
      transactions.value = Array.isArray(result.data) ? result.data : [];
    }
  } catch {
    notificationStore.showNotification(
      'Chargement des transactions — impossible de contacter le serveur.',
      'error',
      8000
    );
  }
  finally { loading.value = false; }
};

onMounted(fetchTransactions);

const filteredTransactions = computed(() => {
  return transactions.value.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.value.toLowerCase());
    const matchesType = typeFilter.value === 'all' || t.type === typeFilter.value;
    const matchesDate = !dateFilter.value || (t.date && t.date.startsWith(dateFilter.value));
    return matchesSearch && matchesType && matchesDate;
  });
});

const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage));
const currentItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredTransactions.value.slice(start, start + itemsPerPage);
});

const stats = computed(() => {
  const income = filteredTransactions.value.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = filteredTransactions.value.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  return { income, expense, balance: income - expense };
});

const openModal = () => {
  transactionFormError.value = '';
  newTransaction.value = { type: 'income', amount: 0, description: '' };
  isModalOpen.value = true;
};

const handleSave = async () => {
  try {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.token}` },
      body: JSON.stringify(newTransaction.value),
    });
    const result = await readFetchResult(res, 'Enregistrement de la transaction');
    if (!result.ok) {
      transactionFormError.value = result.message;
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    transactionFormError.value = '';
    isModalOpen.value = false;
    fetchTransactions();
    notificationStore.showNotification('Transaction enregistrée', 'success');
  } catch {
    const msg = 'Enregistrement de la transaction — erreur réseau.';
    transactionFormError.value = msg;
    notificationStore.showNotification(msg, 'error', 8000);
  }
};

const handleDelete = (id: number) => {
  confirmStore.confirm({
    title: 'Supprimer',
    message: 'Voulez-vous supprimer cette transaction ?',
    onConfirm: async () => {
      try {
        const res = await fetch(`/api/transactions/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authStore.token}` }
        });
        const delResult = await readFetchResult(res, 'Suppression de la transaction');
        if (!delResult.ok) {
          notificationStore.showNotification(delResult.message, 'error', 8000);
          return;
        }
        fetchTransactions();
        notificationStore.showNotification('Supprimé', 'success');
      } catch {
        notificationStore.showNotification('Suppression de la transaction — erreur réseau.', 'error', 8000);
      }
    }
  });
};

watch([searchTerm, typeFilter, dateFilter], () => {
  currentPage.value = 1;
});
</script>
