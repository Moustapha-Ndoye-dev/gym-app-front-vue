<template>
  <div class="space-y-5 sm:space-y-6 animate-in fade-in duration-500 text-slate-900">
    <div class="grid gap-4 xl:grid-cols-[1.25fr_0.95fr]">
      <div class="rounded-[28px] border border-slate-300/70 bg-white p-5 sm:p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.45)]">
        <p class="text-[10px] font-black uppercase tracking-[0.34em] text-slate-400">Tickets</p>
        <h1 class="mt-3 text-2xl sm:text-3xl font-black tracking-tight">Ventes tickets</h1>
        <p class="mt-3 max-w-2xl text-[12px] sm:text-[13px] font-medium leading-relaxed text-slate-500">
          Vendez des tickets, consultez leur statut et retrouvez les ventes du jour. Séance Unique : 1 scan en 24h. Pass Journée : 2 scans sur la journée.
        </p>
      </div>
      <div class="rounded-[28px] bg-slate-950 p-5 text-white shadow-[0_30px_80px_-45px_rgba(15,23,42,0.95)]">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-[10px] font-black uppercase tracking-[0.28em] text-white/35">Aujourd'hui</p>
            <p class="mt-2 text-3xl font-black tracking-tight">{{ tickets.length }}</p>
            <p class="mt-2 text-[11px] font-medium text-white/55">Tickets affichés dans la liste.</p>
          </div>
          <button
            @click="isModalOpen = true; ticketFormError = ''"
            class="rounded-2xl bg-cyan-300 px-4 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-slate-950 transition hover:bg-cyan-200"
          >
            <span class="flex items-center justify-center gap-2">
              <Plus class="h-4 w-4" />
              Vente
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- List Container -->
    <div class="bg-white rounded-[28px] border border-slate-300/60 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.45)] overflow-hidden">
      <div class="flex items-center justify-between border-b border-slate-100 bg-[#fcfaf5] px-4 py-3">
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Liste</p>
          <p class="mt-0.5 text-sm font-bold text-slate-900">Liste des tickets du jour</p>
        </div>
        <div class="rounded-full border border-slate-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          {{ tickets.length }} ligne{{ tickets.length > 1 ? 's' : '' }}
        </div>
      </div>
      <div v-if="loading" class="p-12 text-center">
        <div class="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p class="text-[11px] font-bold text-slate-400 uppercase">Chargement...</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100">
          <thead class="bg-slate-50/80">
            <tr>
              <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Désignation</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Prix</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Heure</th>
              <th class="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
              <th class="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-50">
            <tr v-if="tickets.length === 0">
              <td colspan="5" class="px-6 py-12 text-center">
                <TicketIcon class="h-10 w-10 text-slate-100 mx-auto mb-3" />
                <p class="text-[13px] font-bold text-slate-400">Aucune vente enregistrée</p>
              </td>
            </tr>
            <tr v-else v-for="ticket in tickets" :key="ticket.id" class="transition-colors group hover:bg-[#fcfaf5]">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-2xl bg-slate-950 text-white flex items-center justify-center">
                    <TicketIcon class="h-4 w-4" />
                  </div>
                  <span class="text-[13px] font-bold text-slate-900">{{ ticket.type }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-[13px] font-black text-slate-900">
                  {{ ticket.price.toLocaleString() }} FCFA
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-[12px] font-medium text-slate-500">
                {{ formatDate(ticket.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-html="getStatusBadgeHTML(ticket.status)"></div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex justify-end gap-1">
                  <button @click="openViewModal(ticket)" class="p-2.5 text-slate-400 hover:text-slate-950 hover:bg-amber-50 rounded-xl transition-all border border-transparent hover:border-amber-100" title="Voir QR">
                    <QrCode class="h-4 w-4" />
                  </button>
                  <button @click="handleDownload(ticket)" class="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100" title="Télécharger">
                    <Download class="h-4 w-4" />
                  </button>
                  <button @click="handleDelete(ticket.id)" class="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal: Vente -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-slate-900">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-[16px] font-extrabold uppercase tracking-tight">Nouvelle Vente Ticket</h2>
          <button @click="isModalOpen = false; ticketFormError = ''" class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><X class="h-4 w-4" /></button>
        </div>
        <form @submit.prevent="handleGenerate" class="space-y-4">
          <div v-if="ticketFormError" role="alert" class="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-[11px] font-semibold text-rose-800 leading-snug">
            {{ ticketFormError }}
          </div>
          <div class="space-y-1.5">
            <label for="ticket-type" class="block text-[10px] font-bold text-slate-500 uppercase ml-1">Type d'accès</label>
            <select id="ticket-type" v-model="newTicket.type" class="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold outline-none focus:bg-white focus:border-emerald-600 transition-all">
              <option value="Séance Unique">Séance Unique</option>
              <option value="Pass Journée">Pass Journée</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label for="ticket-price" class="block text-[10px] font-bold text-slate-500 uppercase ml-1">Prix Encaissé (FCFA)</label>
            <input id="ticket-price" v-model.number="newTicket.price" type="number" required min="0" class="block w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-bold outline-none focus:bg-white focus:border-emerald-600 transition-all" />
          </div>
          <div class="pt-4">
            <button type="submit" class="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 text-[11px]">Encaisser & Valider</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: View Ticket (Visual) -->
    <div v-if="isViewModalOpen && currentTicket" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50 text-slate-900">
      <div class="bg-white rounded-[2rem] p-0 max-w-[260px] w-full shadow-2xl relative overflow-hidden border border-slate-100 animate-in zoom-in duration-300 print-content">
        <!-- Header Section -->
        <div :class="['p-6 pb-8 text-center relative', currentTicket.status === 'used' || currentTicket.status === 'expired' ? 'bg-slate-800' : 'bg-slate-900']">
           <div class="absolute top-0 right-0 w-24 h-24 bg-indigo-600 opacity-20 rounded-full -mr-12 -mt-12"></div>
           <div class="absolute bottom-0 left-0 w-20 h-20 bg-purple-600 opacity-20 rounded-full -ml-10 -mb-10"></div>

           <div class="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-slate-700 p-0.5 relative z-10 shadow-lg overflow-hidden bg-slate-800">
              <div class="w-full h-full rounded-full flex items-center justify-center text-xl font-black text-indigo-400 uppercase">
                <TicketIcon class="h-7 w-7" />
              </div>
           </div>

           <h3 class="text-[7px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1 relative z-10">Ticket Pass</h3>
           <div class="text-white text-lg font-black tracking-tighter relative z-10 mb-1 leading-tight">
              {{ currentTicket.type }}
           </div>
           <div class="text-slate-400 text-[8px] font-bold relative z-10 uppercase tracking-widest">
              {{ currentTicket.status === 'used' ? 'Ticket utilisé' : currentTicket.status === 'expired' ? 'Ticket expiré' : 'Ticket valide' }}
           </div>
        </div>
        
        <!-- Body Section -->
        <div class="bg-white px-6 pb-6 relative z-10">
           <div class="flex justify-center -mt-4 mb-5 relative">
              <div :class="['bg-white p-2 rounded-2xl shadow-xl border border-slate-50', currentTicket.status === 'used' || currentTicket.status === 'expired' ? 'opacity-30 grayscale' : '']">
                 <QRCodeVue :value="'TICKET-' + currentTicket.id" :size="120" level="H" />
              </div>
           </div>

           <div class="space-y-2 mb-6">
              <div class="flex justify-between items-center border-b border-slate-100 pb-1.5">
                 <span class="text-[7px] font-black text-slate-400 uppercase">Vendu le</span>
                 <span class="text-[9px] font-bold text-slate-900">{{ formatDate(currentTicket.createdAt) }}</span>
              </div>
              <div class="flex justify-between items-center border-b border-slate-100 pb-1.5">
                 <span class="text-[7px] font-black text-slate-400 uppercase">Statut</span>
                 <span :class="['text-[9px] font-black uppercase', currentTicket.status === 'used' ? 'text-rose-600' : currentTicket.status === 'expired' ? 'text-amber-600' : 'text-emerald-600']">
                    {{ currentTicket.status === 'used' ? 'Utilisé' : currentTicket.status === 'expired' ? 'Expiré' : 'Valide' }}
                 </span>
              </div>
              <div class="flex justify-between items-center border-b border-slate-100 pb-1.5">
                 <span class="text-[7px] font-black text-slate-400 uppercase">Prix</span>
                 <span class="text-[9px] font-bold text-slate-900">{{ currentTicket.price.toLocaleString() }} FCFA</span>
              </div>
              <div class="flex justify-between items-center border-b border-slate-100 pb-1.5">
                 <span class="text-[7px] font-black text-slate-400 uppercase">Validité</span>
                 <span class="text-[9px] font-bold text-slate-900">
                    {{ currentTicket.type === 'Pass Journée' ? 'Jusqu’à la fin de la journée / 2 séances' : '24 heures / 1 séance' }}
                 </span>
              </div>
           </div>

           <div class="flex gap-2 no-print">
              <button @click="handlePrint" class="flex-1 bg-slate-900 text-white p-2.5 rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg">
                 <Printer class="h-3.5 w-3.5 mr-2" />
                 <span class="text-[10px] font-black uppercase tracking-wider">Imprimer</span>
              </button>
              <button @click="handleDownload(currentTicket)" class="px-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors" title="Télécharger le ticket">
                 <Download class="h-4 w-4" />
              </button>
              <button @click="isViewModalOpen = false" class="px-4 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                 <X class="h-4 w-4" />
              </button>
           </div>
           
           <p class="mt-4 text-[7px] text-slate-400 text-center font-bold uppercase tracking-widest leading-relaxed">
              Présenter ce badge au contrôle
           </p>
        </div>
        
        <div class="absolute top-[45%] left-0 w-3 h-6 bg-slate-900/10 rounded-r-full -ml-1.5"></div>
        <div class="absolute top-[45%] right-0 w-3 h-6 bg-slate-900/10 rounded-l-full -mr-1.5"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, onMounted } from 'vue';
import { Plus, Trash2, Ticket as TicketIcon, QrCode, X, Printer, Download } from 'lucide-vue-next';
import QRCodeVue from 'qrcode.vue';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { useConfirmStore } from '../stores/confirm';
import { readFetchResult } from '../lib/getApiErrorMessage';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const confirmStore = useConfirmStore();

type Ticket = {
  id: number;
  type: string;
  price: number;
  status: 'valid' | 'used' | 'expired';
  createdAt: string;
};

const tickets = ref<Ticket[]>([]);
const ticketFormError = ref('');
const isModalOpen = ref(false);
const isViewModalOpen = ref(false);
const newTicket = ref({ type: 'Séance Unique', price: 1000 });
const currentTicket = ref<Ticket | null>(null);
const loading = ref(true);

const fetchTickets = async () => {
  loading.value = true;
  try {
    const res = await fetch('/api/tickets', {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    const result = await readFetchResult<Ticket[]>(res, 'Chargement des tickets');
    if (!result.ok) {
      tickets.value = [];
      notificationStore.showNotification(result.message, 'error', 8000);
    } else {
      tickets.value = Array.isArray(result.data) ? result.data : [];
    }
  } catch {
    notificationStore.showNotification(
      'Chargement des tickets — impossible de contacter le serveur.',
      'error',
      8000
    );
  } finally {
    loading.value = false;
  }
};

onMounted(fetchTickets);

const handleGenerate = async () => {
  try {
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify(newTicket.value),
    });
    const result = await readFetchResult<Record<string, unknown>>(res, 'Vente de ticket');
    if (!result.ok) {
      ticketFormError.value = result.message;
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    ticketFormError.value = '';
    const data = result.data as Record<string, unknown> | Ticket;
    const payload =
      data && typeof data === 'object' && data !== null && 'ticket' in data
        ? (data as { ticket: Record<string, unknown> }).ticket
        : (data as Record<string, unknown>);
    const createdTicket = payload && typeof payload === 'object' ? payload : {};
    isModalOpen.value = false;
    fetchTickets();
    notificationStore.showNotification('Vente validée', 'success');

    currentTicket.value = {
      id: Number(createdTicket.id ?? 0),
      type: String(createdTicket.type ?? newTicket.value.type),
      price: Number(createdTicket.price ?? newTicket.value.price),
      status: (createdTicket.status as Ticket['status']) ?? 'valid',
      createdAt: String(createdTicket.createdAt ?? new Date().toISOString()),
    };
    isViewModalOpen.value = true;
  } catch {
    const msg = 'Vente de ticket — erreur réseau.';
    ticketFormError.value = msg;
    notificationStore.showNotification(msg, 'error', 8000);
  }
};

const openViewModal = (ticket: Ticket) => {
  currentTicket.value = ticket;
  isViewModalOpen.value = true;
};

const handlePrint = () => {
  globalThis.print();
};

const waitForPreviewRender = async () => {
  await nextTick();
  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
  await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
};

const handleDownload = async (ticket: Ticket) => {
  currentTicket.value = ticket;
  isViewModalOpen.value = true;
  await waitForPreviewRender();
  handlePrint();
};

const handleDelete = (id: number) => {
  confirmStore.confirm({
    title: 'Supprimer',
    message: 'Supprimer cet enregistrement ?',
    onConfirm: async () => {
      try {
        const res = await fetch(`/api/tickets/${id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authStore.token}` }
        });
        const delResult = await readFetchResult(res, 'Suppression du ticket');
        if (!delResult.ok) {
          notificationStore.showNotification(delResult.message, 'error', 8000);
          return;
        }
        fetchTickets();
        notificationStore.showNotification('Supprimé', 'success');
      } catch {
        notificationStore.showNotification('Suppression du ticket — erreur réseau.', 'error', 8000);
      }
    }
  });
};

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getStatusBadgeHTML = (status: string) => {
  switch (status) {
    case 'valid': return '<span class="px-2 py-0.5 inline-flex text-[9px] font-black uppercase tracking-tighter rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">Valide</span>';
    case 'used': return '<span class="px-2 py-0.5 inline-flex text-[9px] font-black uppercase tracking-tighter rounded-md bg-rose-50 text-rose-600 border border-rose-100">Utilisé</span>';
    default: return '';
  }
};
</script>
