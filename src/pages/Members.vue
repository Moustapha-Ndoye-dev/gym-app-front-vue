<template>
  <div class="space-y-5 sm:space-y-6 animate-in fade-in duration-500 text-slate-900">
    <div class="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
      <div class="rounded-[28px] bg-slate-950 p-5 sm:p-6 text-white shadow-[0_30px_80px_-45px_rgba(15,23,42,0.95)]">
        <p class="text-[10px] font-black uppercase tracking-[0.34em] text-cyan-300/80">Adhérents</p>
        <h1 class="mt-3 text-2xl sm:text-3xl font-black tracking-tight">Répertoire adhérents</h1>
        <p class="mt-3 max-w-2xl text-[12px] sm:text-[13px] font-medium leading-relaxed text-slate-300">
          Retrouvez ici la liste des adhérents, leur statut et les actions principales.
        </p>
      </div>

      <div class="rounded-[28px] border border-slate-300/70 bg-[#fbf7ef] p-4 sm:p-5 shadow-[0_20px_50px_-35px_rgba(15,23,42,0.4)]">
        <div>
          <p class="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">Résumé</p>
          <h2 class="mt-1 text-lg font-black tracking-tight text-slate-950">État des adhérents</h2>
        </div>
        <div class="mt-4 grid grid-cols-3 gap-3">
          <div v-for="s in stats" :key="s.label" :class="['rounded-2xl border px-4 py-3', s.bg, s.border]">
            <p :class="['text-[9px] font-black uppercase tracking-[0.22em] mb-1', s.color]">{{ s.label }}</p>
            <p class="text-xl font-black text-slate-900">{{ s.value }}</p>
          </div>
        </div>
        <button 
          @click="openAddModal"
          class="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-cyan-400 hover:text-slate-950"
        >
          <Plus class="h-3.5 w-3.5" /> Nouvel adhérent
        </button>
      </div>
    </div>

    <!-- Header & Stats Dashboard -->
    <div class="bg-white rounded-[28px] p-4 sm:p-5 border border-slate-300/60 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.45)] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
      <div>
        <h2 class="text-lg sm:text-xl font-extrabold tracking-tight">Liste des adhérents</h2>
        <p class="text-slate-500 text-[11px] sm:text-[12px] font-medium mt-0.5">Recherchez, modifiez ou renouvelez un adhérent.</p>
      </div>
      
      <div class="w-full lg:w-auto rounded-full border border-slate-200 bg-[#f8f5ee] px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
        {{ filteredMembers.length }} résultat{{ filteredMembers.length > 1 ? 's' : '' }}
      </div>
    </div>

    <!-- List Container -->
    <div class="bg-white rounded-[28px] border border-slate-300/60 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.45)] overflow-hidden">
      <!-- Toolbar -->
      <div class="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-[#fcfaf5]">
        <div class="relative w-full md:w-[26rem] group">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Rechercher un nom ou téléphone..."
            class="w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-4 py-3 text-[12px] font-medium outline-none transition-all focus:border-slate-950/20 focus:bg-white focus:ring-2 focus:ring-slate-900/5"
          />
        </div>
        <div class="text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
          Gestion adhérents
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-12 text-center">
        <div class="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Chargement...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredMembers.length === 0" class="py-16 text-center space-y-3">
        <div class="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
          <User class="h-6 w-6 text-slate-200" />
        </div>
        <p class="text-slate-500 font-bold text-[12px]">Aucun adhérent trouvé</p>
      </div>

      <!-- Desktop Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100">
          <thead class="bg-slate-50/80">
            <tr>
              <th class="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Adhérent</th>
              <th class="px-6 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Contact</th>
              <th class="px-8 py-3 text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Abonnement</th>
              <th class="px-6 py-3 text-right text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="m in filteredMembers" :key="m.id" class="transition-colors group hover:bg-[#fcfaf5]">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="relative">
                    <div class="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                      <img v-if="m.photo" :src="m.photo" alt="Portrait adhérent" class="w-full h-full object-cover" />
                      <span v-else class="text-xs font-black text-slate-900 uppercase">
                        {{ (m.firstName || m.first_name)?.[0] }}{{ (m.lastName || m.last_name)?.[0] }}
                      </span>
                    </div>
                    <div :class="['absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white', isExpired(m.expiryDate || m.expiry_date) ? 'bg-rose-500' : 'bg-emerald-500']"></div>
                  </div>
                  <div>
                    <p class="font-bold text-slate-900 text-[13px]">{{ m.firstName || m.first_name }} {{ m.lastName || m.last_name }}</p>
                    <span :class="['text-[8px] font-black px-2 py-1 rounded-full border uppercase tracking-[0.18em]', isExpired(m.expiryDate || m.expiry_date) ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100']">
                      {{ isExpired(m.expiryDate || m.expiry_date) ? 'Expiré' : 'Actif' }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="space-y-0.5">
                  <p class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5"><Phone class="h-3 w-3 text-slate-400" /> {{ m.phone }}</p>
                </div>
              </td>
              <td class="px-8 py-4">
                <div class="space-y-0.5">
                  <p class="text-[11px] font-bold text-slate-900 uppercase">{{ m.subscription?.name || 'Standard' }}</p>
                  <div v-if="m.subscription?.activities?.length" class="flex flex-wrap gap-1 mt-1">
                    <span v-for="a in m.subscription.activities" :key="a.id" class="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-100">{{ a.name }}</span>
                  </div>
                  <p :class="['text-[10px] font-bold uppercase', isExpired(m.expiryDate || m.expiry_date) ? 'text-rose-600' : 'text-slate-400']">Expire: {{ formatDate(m.expiryDate || m.expiry_date) }}</p>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-1">
                  <button @click="openExpiryModal(m)" class="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all" title="Renouveler">
                    <Calendar class="h-4 w-4" />
                  </button>
                  <button @click="handleDownload(m)" class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all" title="Télécharger/Imprimer">
                    <Download class="h-4 w-4" />
                  </button>
                  <button @click="openViewModal(m)" class="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-950 hover:bg-amber-50 rounded-xl transition-all border border-transparent hover:border-amber-100" title="Carte Membre">
                    <QrCodeIcon class="h-4 w-4" />
                  </button>
                  <button @click="openEditModal(m)" class="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-950 hover:bg-cyan-50 rounded-xl transition-all border border-transparent hover:border-cyan-100">
                    <Edit class="h-4 w-4" />
                  </button>
                  <button @click="handleDelete(m.id)" class="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modals -->
    <Teleport to="body">
      <!-- Edit/Create Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200 text-slate-900">
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl animate-in zoom-in duration-200 relative overflow-hidden">
          <div class="flex justify-between items-center mb-5">
            <h2 class="text-[15px] font-extrabold tracking-tight">{{ currentMember.id ? 'Modifier' : 'Nouvel' }} Adhérent</h2>
            <button @click="isModalOpen = false; memberFormError = ''" class="p-1.5 hover:bg-slate-100 text-slate-400 rounded-lg transition-all"><X class="h-4 w-4" /></button>
          </div>
          
          <form @submit.prevent="handleSave" class="space-y-3">
            <div v-if="memberFormError" role="alert" class="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-[11px] font-semibold text-rose-800 leading-snug">
              {{ memberFormError }}
            </div>
            <div class="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <div class="w-12 h-12 rounded-lg bg-white border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative shrink-0 cursor-pointer hover:border-indigo-400 transition-colors">
                <img v-if="photoPreview || currentMember.photo" :src="photoPreview || currentMember.photo" alt="Portrait profil" class="w-full h-full object-cover" />
                <div v-else class="text-center">
                  <Plus class="h-4 w-4 text-slate-300" />
                </div>
                <input type="file" accept="image/*" @change="handlePhotoChange" class="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <div class="flex-1">
                <p class="text-[10px] font-bold text-slate-700">Photo de profil</p>
                <p class="text-[8px] text-slate-400 font-medium">Cliquez pour modifier.</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label for="member-first-name" class="text-[10px] font-bold text-slate-500 ml-1">Prénom</label>
                <input id="member-first-name" v-model="currentMember.firstName" required :minlength="STRING_LIMITS.personName.min" :maxlength="STRING_LIMITS.personName.max" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-sm" />
              </div>
              <div class="space-y-1">
                <label for="member-last-name" class="text-[10px] font-bold text-slate-500 ml-1">Nom</label>
                <input id="member-last-name" v-model="currentMember.lastName" required :minlength="STRING_LIMITS.personName.min" :maxlength="STRING_LIMITS.personName.max" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-sm" />
              </div>
            </div>

            <div class="space-y-1">
              <label for="member-phone" class="text-[10px] font-bold text-slate-500 ml-1">Téléphone</label>
              <input id="member-phone" v-model="currentMember.phone" required :maxlength="STRING_LIMITS.memberPhone.max" type="tel" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all shadow-sm" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label for="member-subscription" class="text-[10px] font-bold text-slate-500 ml-1">Formule</label>
                <select id="member-subscription" v-model="currentMember.subscriptionId" required class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-bold outline-none focus:bg-white focus:border-indigo-600">
                  <option :value="undefined">Choisir...</option>
                  <option v-for="s in subscriptions" :key="s.id" :value="s.id">
                    {{ s.name }}{{ s.activities?.length ? ' — ' + s.activities.map((a) => a.name).join(', ') : '' }}
                  </option>
                </select>
              </div>
              <div class="space-y-1">
                <label for="member-duration" class="text-[10px] font-bold text-slate-500 ml-1">Ajouter Mois</label>
                <select id="member-duration" v-model="durationMonths" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[12px] font-bold outline-none focus:bg-white focus:border-indigo-600">
                  <option :value="1">1 Mois</option>
                  <option :value="3">3 Mois</option>
                  <option :value="6">6 Mois</option>
                  <option :value="12">12 Mois</option>
                </select>
              </div>
            </div>

            <button type="submit" class="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all mt-3 active:scale-95 text-[11px] shadow-sm shadow-slate-200">Enregistrer</button>
          </form>
        </div>
      </div>

      <!-- Expiry Modal -->
      <div v-if="isExpiryModalOpen" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-[110] animate-in fade-in duration-200 text-slate-900">
        <div class="bg-white rounded-2xl p-6 max-w-[300px] w-full shadow-2xl animate-in zoom-in duration-200">
          <div class="flex items-center gap-3 mb-4 text-emerald-600">
            <RefreshCw class="h-5 w-5 animate-spin-slow" />
            <h2 class="text-[14px] font-black uppercase tracking-tight">Renouvellement</h2>
          </div>
          <p class="text-[11px] text-slate-500 font-medium mb-4 leading-relaxed">
            Modifier la date d'expiration pour <span class="font-bold text-slate-900">{{ currentMember.firstName }}</span>. Cela réactivera son QR Code.
          </p>
          <form @submit.prevent="handleUpdateExpiry" class="space-y-4">
            <div v-if="expiryFormError" role="alert" class="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-[11px] font-semibold text-rose-800 leading-snug">
              {{ expiryFormError }}
            </div>
            <div class="space-y-1">
              <label for="member-expiry-date" class="text-[9px] font-black text-slate-400 uppercase ml-1">Nouvelle Échéance</label>
              <input 
                id="member-expiry-date"
                type="date" 
                required
                v-model="newExpiryDate"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-bold outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all" 
              />
            </div>
            <div class="flex gap-2 pt-2">
              <button type="button" @click="isExpiryModalOpen = false; expiryFormError = ''" class="flex-1 py-2.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-[10px] uppercase hover:bg-slate-200 transition-all">Annuler</button>
              <button type="submit" class="flex-[2] py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-[10px] uppercase hover:bg-emerald-700 shadow-md shadow-emerald-100 transition-all">Confirmer</button>
            </div>
          </form>
        </div>
      </div>

      <!-- ID Card Modal (Ticket Design with Circular Photo) -->
      <div v-if="isViewModalOpen && currentMember.id" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 z-50 text-slate-900">
        <div class="bg-white rounded-[2rem] p-0 max-w-[260px] w-full shadow-2xl relative overflow-hidden border border-slate-100 animate-in zoom-in duration-300 print-content">
          <!-- Header Section -->
          <div :class="['p-6 pb-8 text-center relative', isExpired(currentMember.expiryDate || currentMember.expiry_date) ? 'bg-slate-800' : 'bg-slate-900']">
             <div class="absolute top-0 right-0 w-24 h-24 bg-indigo-600 opacity-20 rounded-full -mr-12 -mt-12"></div>
             <div class="absolute bottom-0 left-0 w-20 h-20 bg-purple-600 opacity-20 rounded-full -ml-10 -mb-10"></div>
             
             <!-- Small Circular Profile Photo -->
             <div class="w-16 h-16 mx-auto mb-3 rounded-full border-2 border-slate-700 p-0.5 relative z-10 shadow-lg overflow-hidden bg-slate-800">
                <img v-if="currentMember.photo" :src="currentMember.photo" alt="Portrait adhérent" class="w-full h-full object-cover rounded-full" />
                <div v-else class="w-full h-full flex items-center justify-center text-xl font-black text-indigo-400 uppercase">
                  {{ (currentMember.firstName || currentMember.first_name)?.[0] }}{{ (currentMember.lastName || currentMember.last_name)?.[0] }}
                </div>
             </div>

             <h3 class="text-[7px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1 relative z-10">Member Pass</h3>
             <div class="text-white text-lg font-black tracking-tighter relative z-10 mb-1 leading-tight">
                {{ currentMember.firstName || currentMember.first_name }} {{ currentMember.lastName || currentMember.last_name }}
             </div>
             <div class="text-slate-400 text-[8px] font-bold relative z-10 uppercase tracking-widest">{{ currentMember.subscription?.name || 'Standard' }}</div>
             <div v-if="currentMember.subscription?.activities?.length" class="flex flex-wrap justify-center gap-1 mt-2 relative z-10 px-2">
               <span v-for="a in currentMember.subscription.activities" :key="a.id" class="text-[7px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/10 text-cyan-200 border border-white/15">{{ a.name }}</span>
             </div>
          </div>
          
          <!-- Body Section -->
          <div class="bg-white px-6 pb-6 relative z-10">
             <div class="flex justify-center -mt-4 mb-5 relative">
                <div class="bg-white p-2 rounded-2xl shadow-xl border border-slate-50">
                   <QRCodeVue :value="'MEMBER-' + currentMember.id" :size="120" level="H" />
                </div>
             </div>

             <div class="space-y-2 mb-6">
                <div class="flex justify-between items-center border-b border-slate-100 pb-1.5">
                   <span class="text-[7px] font-black text-slate-400 uppercase">Statut</span>
                   <span :class="['text-[9px] font-black uppercase', isExpired(currentMember.expiryDate || currentMember.expiry_date) ? 'text-rose-600' : 'text-emerald-600']">
                      {{ isExpired(currentMember.expiryDate || currentMember.expiry_date) ? 'Expiré' : 'Actif' }}
                   </span>
                </div>
                <div class="flex justify-between items-center border-b border-slate-100 pb-1.5">
                   <span class="text-[7px] font-black text-slate-400 uppercase">Validité</span>
                   <span class="text-[9px] font-bold text-slate-900">{{ formatDate(currentMember.expiryDate || currentMember.expiry_date) }}</span>
                </div>
             </div>

             <div class="flex gap-2 no-print">
                <button @click="handlePrint" class="flex-1 bg-slate-900 text-white p-2.5 rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg">
                   <Printer class="h-3.5 w-3.5 mr-2" />
                   <span class="text-[9px] font-black uppercase tracking-wider">Imprimer</span>
                </button>
                <button @click="isViewModalOpen = false" class="px-4 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                   <X class="h-4 w-4" />
                </button>
             </div>
             
             <p class="mt-4 text-[7px] text-slate-400 text-center font-bold uppercase tracking-widest leading-relaxed">
                Badge personnel obligatoire
             </p>
          </div>
          
          <!-- Decoration -->
          <div class="absolute top-[45%] left-0 w-3 h-6 bg-slate-900/10 rounded-r-full -ml-1.5"></div>
          <div class="absolute top-[45%] right-0 w-3 h-6 bg-slate-900/10 rounded-l-full -mr-1.5"></div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Plus, Edit, Search, QrCode as QrCodeIcon, Trash2, User, Phone, X, Printer, Calendar, RefreshCw, Download } from 'lucide-vue-next';
import QRCodeVue from 'qrcode.vue';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { readFetchResult } from '../lib/getApiErrorMessage';
import { STRING_LIMITS } from '../lib/stringLimits';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

type Subscription = {
  id: number;
  name: string;
  price: number;
  activities?: { id: number; name: string }[];
};

type Member = {
  id: number;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  phone: string;
  email: string;
  registrationDate?: string;
  registration_date?: string;
  expiryDate?: string;
  expiry_date?: string;
  photo?: string;
  subscription?: Subscription;
  subscriptionId?: number;
};

const members = ref<Member[]>([]);
const subscriptions = ref<Subscription[]>([]);
const searchTerm = ref('');
const isModalOpen = ref(false);
const isViewModalOpen = ref(false);
const isExpiryModalOpen = ref(false);
const currentMember = ref<Partial<Member>>({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  subscriptionId: undefined
});
const durationMonths = ref(1);
const photoPreview = ref<string | null>(null);
const loading = ref(true);
const newExpiryDate = ref('');
const memberFormError = ref('');
const expiryFormError = ref('');

const stats = computed(() => {
  const total = members.value.length;
  const active = members.value.filter(m => !isExpired(m.expiryDate || m.expiry_date)).length;
  const expired = total - active;
  return [
    { label: 'Total', value: total, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' },
    { label: 'Actifs', value: active, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Expirés', value: expired, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  ];
});

const fetchData = async () => {
  loading.value = true;
  try {
    const [mRes, sRes] = await Promise.all([
      fetch('/api/members', { headers: { 'Authorization': `Bearer ${authStore.token}` } }),
      fetch('/api/subscriptions', { headers: { 'Authorization': `Bearer ${authStore.token}` } })
    ]);
    const mOut = await readFetchResult<Member[]>(mRes, 'Chargement des adhérents');
    const sOut = await readFetchResult<Subscription[]>(sRes, 'Chargement des abonnements');
    if (!mOut.ok) {
      members.value = [];
      notificationStore.showNotification(mOut.message, 'error', 8000);
    } else {
      members.value = Array.isArray(mOut.data) ? mOut.data : [];
    }
    if (!sOut.ok) {
      subscriptions.value = [];
      notificationStore.showNotification(sOut.message, 'error', 8000);
    } else {
      subscriptions.value = Array.isArray(sOut.data) ? sOut.data : [];
    }
  } catch {
    notificationStore.showNotification(
      'Chargement des données — impossible de contacter le serveur.',
      'error',
      8000
    );
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

const filteredMembers = computed(() => {
  return members.value.filter(m => {
    const fn = m.firstName || m.first_name || '';
    const ln = m.lastName || m.last_name || '';
    const full = `${fn} ${ln}`.toLowerCase();
    const phone = m.phone || '';
    return full.includes(searchTerm.value.toLowerCase()) || phone.includes(searchTerm.value);
  });
});

const handlePhotoChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      photoPreview.value = reader.result as string;
      currentMember.value.photo = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const openAddModal = () => {
  if (subscriptions.value.length === 0) {
    notificationStore.showNotification(
      "Créez d'abord un abonnement avant d'ajouter un adhérent.",
      'warning',
      8000
    );
    return;
  }
  memberFormError.value = '';
  currentMember.value = { 
    firstName: '', 
    lastName: '', 
    phone: '', 
    email: '', 
    subscriptionId: undefined,
    photo: undefined
  };
  durationMonths.value = 1;
  photoPreview.value = null;
  isModalOpen.value = true;
};

const openEditModal = (member: Member) => {
  memberFormError.value = '';
  currentMember.value = { ...member };
  photoPreview.value = member.photo || null;
  isModalOpen.value = true;
};

const openExpiryModal = (member: Member) => {
  expiryFormError.value = '';
  currentMember.value = member;
  const dateStr = member.expiryDate || member.expiry_date || new Date().toISOString();
  newExpiryDate.value = new Date(dateStr).toISOString().split('T')[0];
  isExpiryModalOpen.value = true;
};

const openViewModal = (member: Member) => {
  currentMember.value = { ...member };
  isViewModalOpen.value = true;
};

const handlePrint = () => {
  globalThis.print();
};

const handleDownload = (member: Member) => {
  currentMember.value = { ...member };
  isViewModalOpen.value = true;
  setTimeout(() => {
    globalThis.print();
  }, 100);
};

const handleSave = async () => {
  const fn = String(
    currentMember.value.firstName ?? currentMember.value.first_name ?? ''
  ).trim();
  const ln = String(
    currentMember.value.lastName ?? currentMember.value.last_name ?? ''
  ).trim();
  const phone = String(currentMember.value.phone ?? '').trim();
  const isEditing = Boolean(currentMember.value.id);

  if (fn.length < STRING_LIMITS.personName.min) {
    memberFormError.value = 'Le prénom doit contenir au moins 2 caractères.';
    notificationStore.showNotification(memberFormError.value, 'error', 8000);
    return;
  }
  if (fn.length > STRING_LIMITS.personName.max) {
    memberFormError.value = `Le prénom ne peut pas dépasser ${STRING_LIMITS.personName.max} caractères.`;
    notificationStore.showNotification(memberFormError.value, 'error', 8000);
    return;
  }
  if (ln.length < STRING_LIMITS.personName.min) {
    memberFormError.value = 'Le nom doit contenir au moins 2 caractères.';
    notificationStore.showNotification(memberFormError.value, 'error', 8000);
    return;
  }
  if (ln.length > STRING_LIMITS.personName.max) {
    memberFormError.value = `Le nom ne peut pas dépasser ${STRING_LIMITS.personName.max} caractères.`;
    notificationStore.showNotification(memberFormError.value, 'error', 8000);
    return;
  }
  if (!phone) {
    memberFormError.value = 'Indiquez un numéro de téléphone.';
    notificationStore.showNotification(memberFormError.value, 'error', 8000);
    return;
  }
  if (phone.length > STRING_LIMITS.memberPhone.max) {
    memberFormError.value = `Le téléphone ne peut pas dépasser ${STRING_LIMITS.memberPhone.max} caractères.`;
    notificationStore.showNotification(memberFormError.value, 'error', 8000);
    return;
  }
  if (
    !isEditing &&
    (!currentMember.value.subscriptionId ||
      currentMember.value.subscriptionId < 1)
  ) {
    memberFormError.value = "Choisissez une formule d'abonnement.";
    notificationStore.showNotification(memberFormError.value, 'error', 8000);
    return;
  }

  const method = currentMember.value.id ? 'PUT' : 'POST';
  const url = currentMember.value.id ? `/api/members/${currentMember.value.id}` : '/api/members';
  const dataToSave = {
    firstName: fn,
    lastName: ln,
    phone,
    photo: currentMember.value.photo,
    subscriptionId: currentMember.value.subscriptionId,
    durationMonths: durationMonths.value,
    expiryDate: currentMember.value.id ? (currentMember.value.expiryDate || currentMember.value.expiry_date) : undefined
  };

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.token}` },
      body: JSON.stringify(dataToSave),
    });
    const result = await readFetchResult(res, "Enregistrement de l'adhérent");
    if (!result.ok) {
      memberFormError.value = result.message;
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    memberFormError.value = '';
    isModalOpen.value = false;
    fetchData();
    notificationStore.showNotification('Dossier validé', 'success');
  } catch {
    const msg = "Enregistrement de l'adhérent — erreur réseau.";
    memberFormError.value = msg;
    notificationStore.showNotification(msg, 'error', 8000);
  }
};

const handleUpdateExpiry = async () => {
  if (!currentMember.value.id) return;
  if (!newExpiryDate.value?.trim()) {
    expiryFormError.value = "Choisissez une date d'expiration.";
    notificationStore.showNotification(expiryFormError.value, 'error', 8000);
    return;
  }
  try {
    const res = await fetch(`/api/members/${currentMember.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.token}` },
      body: JSON.stringify({
        expiryDate: newExpiryDate.value,
        expiry_date: newExpiryDate.value
      }),
    });
    const result = await readFetchResult(res, "Mise à jour de la date d'expiration");
    if (!result.ok) {
      expiryFormError.value = result.message;
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    expiryFormError.value = '';
    isExpiryModalOpen.value = false;
    fetchData();
    notificationStore.showNotification('Date mise à jour', 'success');
  } catch {
    const msg = "Mise à jour de la date — erreur réseau.";
    expiryFormError.value = msg;
    notificationStore.showNotification(msg, 'error', 8000);
  }
};

const handleDelete = async (id: number) => {
  if (!globalThis.confirm('Supprimer définitivement cet adhérent ?')) return;
  try {
    const res = await fetch(`/api/members/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    const result = await readFetchResult(res, "Suppression de l'adhérent");
    if (!result.ok) {
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    fetchData();
    notificationStore.showNotification('Adhérent supprimé', 'success');
  } catch {
    notificationStore.showNotification(
      "Suppression de l'adhérent — erreur réseau.",
      'error',
      8000
    );
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('fr-FR');
};

const isExpired = (expiryDate?: string) => {
  if (!expiryDate) return true;
  return new Date(expiryDate) < new Date();
};
</script>

<style scoped>
.animate-spin-slow {
  animation: spin 3s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
