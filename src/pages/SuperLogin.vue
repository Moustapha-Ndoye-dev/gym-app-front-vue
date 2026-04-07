<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
    <div class="absolute inset-0 z-0 opacity-10" style="background-image: radial-gradient(#334155 1px, transparent 1px); background-size: 24px 24px"></div>
    <div class="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-rose-600/10 rounded-full blur-[120px]"></div>
    
    <div class="container max-w-[320px] w-full relative z-10 p-6">
      <div class="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 p-6 sm:p-8 animate-in fade-in zoom-in duration-500">
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-rose-500/10 rounded-2xl mb-4 border border-rose-500/20">
            <ShieldAlert class="h-6 w-6 text-rose-500" />
          </div>
          <h2 class="text-lg font-black text-white tracking-tight uppercase tracking-widest">Super <span class="text-rose-500 text-base">Admin</span></h2>
          <p class="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-[0.2em]">Console de Maintenance</p>
        </div>

        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform -translate-y-4 opacity-0" enter-to-class="transform translate-y-0 opacity-100">
          <div v-if="error" class="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center gap-3">
            <XCircle class="h-3.5 w-3.5 shrink-0" />
            <p class="text-[10px] font-black">{{ error }}</p>
          </div>
        </Transition>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Identifiant Maître</label>
            <div class="relative group">
              <UserIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input v-model="loginData.username" type="text" required class="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 text-[12px] font-bold text-white outline-none transition-all placeholder:text-slate-700" placeholder="Utilisateur" />
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Clé d'Accès</label>
            <div class="relative group">
              <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input v-model="loginData.password" type="password" required class="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 text-[12px] font-bold text-white outline-none transition-all placeholder:text-slate-700" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" :disabled="loading" class="w-full py-2.5 flex items-center justify-center bg-rose-600 text-white rounded-xl shadow-xl shadow-rose-900/20 hover:bg-rose-500 active:scale-[0.98] transition-all text-[11px] font-black uppercase tracking-widest mt-6 group disabled:opacity-50">
            <div v-if="loading" class="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <template v-else>
              Authentifier <ArrowRight class="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </template>
          </button>
        </form>

        <div class="mt-6 text-center">
          <span class="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Zone Hautement Sécurisée</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore, type User } from '../stores/auth';
import { readFetchResult } from '../lib/getApiErrorMessage';
import { ShieldAlert, Lock, User as UserIcon, ArrowRight, XCircle } from 'lucide-vue-next';

const loading = ref(false);
const error = ref('');
const authStore = useAuthStore();
const router = useRouter();

const loginData = ref({ username: '', password: '' });

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...loginData.value, requiredRole: 'superadmin' })
    });
    const result = await readFetchResult<{ user?: User; token?: string }>(res, 'Connexion super-admin');
    if (!result.ok) {
      error.value = result.message;
      return;
    }
    const data = result.data;
    if (data.user?.role !== 'superadmin') {
      error.value = 'Accès refusé. Réservé aux SuperAdmins.';
      return;
    }
    if (!data.user || !data.token) {
      error.value = 'Réponse de connexion incomplète. Réessayez.';
      return;
    }
    authStore.login(data.user as User, data.token);
    router.push('/super');
  } catch {
    error.value = 'Connexion super-admin — impossible de contacter le serveur.';
  } finally {
    loading.value = false;
  }
};
</script>
