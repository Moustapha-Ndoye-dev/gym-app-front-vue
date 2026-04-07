<template>
  <div class="h-16 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
    <div class="flex items-center">
      <div :class="cn('w-8 h-8 rounded-2xl flex items-center justify-center mr-3 ring-1', isSuperAdmin ? 'bg-rose-500/90 ring-rose-300/30' : 'bg-cyan-400/90 ring-cyan-200/30')">
        <component :is="isSuperAdmin ? ShieldCheck : Dumbbell" class="h-3.5 w-3.5 text-white" />
      </div>
      <div>
        <p class="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
          {{ isSuperAdmin ? 'plateforme' : 'application' }}
        </p>
        <span class="text-base font-extrabold tracking-tight text-white">
          <span v-if="isSuperAdmin" class="text-rose-300">SUPER</span>
          <span v-else class="text-white">GYM</span>
          <span :class="isSuperAdmin ? 'text-white' : 'text-cyan-300'">{{ isSuperAdmin ? ' ADMIN' : ' PRO' }}</span>
        </span>
      </div>
    </div>
    <button class="lg:hidden text-white/50 hover:text-white p-1.5" @click="$emit('close')">
      <X class="h-4 w-4" />
    </button>
  </div>
  
  <nav class="flex-1 overflow-y-auto py-5 px-3">
    <div class="text-[9px] font-bold text-white/35 uppercase tracking-[0.24em] mb-3 px-3">
      {{ isSuperAdmin ? 'Gestion Plateforme' : 'Menu Principal' }}
    </div>
    <ul class="space-y-1">
      <li v-for="item in filteredNavItems" :key="item.path">
        <router-link
          :to="item.path"
          @click="$emit('close')"
          :class="cn(
            'flex items-center px-3 py-3 rounded-2xl text-[12px] font-bold transition-all duration-200 group',
            $route.path === item.path 
              ? (isSuperAdmin ? 'bg-rose-500 text-white shadow-lg shadow-rose-950/40' : 'bg-white text-slate-950 shadow-lg shadow-black/20')
              : (isSuperAdmin ? 'text-white/68 hover:bg-white/8 hover:text-white' : 'text-white/68 hover:bg-white/8 hover:text-white')
          )"
        >
          <component 
            :is="item.icon" 
            :class="cn('h-4 w-4 mr-3 transition-colors', $route.path === item.path ? (isSuperAdmin ? 'text-white' : 'text-slate-950') : 'text-white/35 group-hover:text-white')" 
          />
          {{ item.name }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { 
  Dumbbell, Users, CreditCard, Ticket, QrCode, Settings, LayoutDashboard, ShoppingBag, X, ShieldCheck, Building2, TrendingUp
} from 'lucide-vue-next';
import { cn } from '../lib/utils';

const emit = defineEmits(['close']);
const authStore = useAuthStore();

const navItems = [
  { name: 'Tableau de bord', path: '/', icon: LayoutDashboard, roles: ['admin', 'cashier', 'member'] },
  { name: 'Activités', path: '/activities', icon: Dumbbell, roles: ['admin'] },
  { name: 'Boutique', path: '/shop', icon: ShoppingBag, roles: ['admin', 'cashier', 'member'] },
  { name: 'Abonnements', path: '/subscriptions', icon: CreditCard, roles: ['admin', 'cashier'] },
  { name: 'Adhérents', path: '/members', icon: Users, roles: ['admin', 'cashier'] },
  { name: 'Tickets', path: '/tickets', icon: Ticket, roles: ['admin', 'cashier'] },
  { name: 'Contrôle d\'accès', path: '/access', icon: QrCode, roles: ['admin', 'controller'] },
  { name: 'Caisse', path: '/cash-register', icon: CreditCard, roles: ['admin', 'cashier'] },
  { name: 'Utilisateurs', path: '/users', icon: Settings, roles: ['admin'] },
];

const superAdminItems = [
  { name: 'Vue d\'ensemble', path: '/super', icon: LayoutDashboard, roles: ['superadmin'] },
  { name: 'Gestion des Salles', path: '/super/gyms', icon: Building2, roles: ['superadmin'] },
  { name: 'Abonnements SaaS', path: '/super/subscriptions', icon: TrendingUp, roles: ['superadmin'] },
  { name: 'Utilisateurs Système', path: '/super/admins', icon: Users, roles: ['superadmin'] },
  ];
const normalizedUserRole = computed(() => {
  const role = authStore.user?.role;
  return role ? String(role).trim().toLowerCase() : null;
});

const isSuperAdmin = computed(() => normalizedUserRole.value === 'superadmin');

const filteredNavItems = computed(() => {
  if (isSuperAdmin.value) {
    return superAdminItems;
  }
  if (!normalizedUserRole.value) {
    return navItems;
  }
  return navItems.filter((item) => item.roles.includes(normalizedUserRole.value as any));
});
</script>
