<template>
  <div class="max-w-7xl mx-auto space-y-4 text-slate-900 font-sans">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100 shadow-sm"><ShoppingBag class="h-5 w-5" /></div>
        <h1 class="text-lg font-black tracking-tight uppercase">Boutique <span class="text-indigo-600 font-bold">Pro</span></h1>
      </div>
      <div class="flex bg-slate-100 p-1 rounded-xl">
        <button @click="mode = 'sell'" :class="['px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all', mode === 'sell' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500']">Vente</button>
        <button @click="mode = 'manage'" :class="['px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all', mode === 'manage' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500']">Stock</button>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-6">
      <div class="flex-1 space-y-4">
        <!-- Categories & Search -->
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex gap-1 bg-white p-1 rounded-xl border border-slate-100 overflow-x-auto">
            <button v-for="cat in categories" :key="cat" @click="activeCategory = cat; currentPage = 1" :class="['px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all', activeCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50']">{{ cat }}</button>
          </div>
          <div class="relative flex-1 min-w-[200px]">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input v-model="searchTerm" @input="currentPage = 1" type="text" placeholder="Rechercher..." class="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:border-indigo-500 transition-all" />
          </div>
        </div>

        <div v-if="mode === 'sell'" class="space-y-4">
          <div v-if="paginatedProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            <div v-for="p in paginatedProducts" :key="p.id" class="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-indigo-200 transition-all group animate-in fade-in zoom-in duration-300">
              <div class="h-24 bg-slate-50 relative flex items-center justify-center p-2">
                <img v-if="p.photo" :src="p.photo" class="h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                <Package v-else class="h-8 w-8 text-slate-200" />
                <div :class="['absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-lg text-[8px] font-black border uppercase shadow-sm', p.stock > 0 ? 'bg-white text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100']">
                  {{ p.stock > 0 ? `Stock: ${p.stock}` : 'EPUISE' }}
                </div>
              </div>
              <div class="p-3 space-y-2">
                <h3 class="text-[11px] font-black text-slate-900 leading-tight line-clamp-1">{{ p.name }}</h3>
                <div class="flex items-center justify-between">
                  <span class="text-[12px] font-black text-indigo-600">{{ p.price.toLocaleString() }} CFA</span>
                  <button @click="addToCart(p)" :disabled="p.stock <= 0" class="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-30 transition-all"><Plus class="h-3 w-3" /></button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-900">
            <AlertCircle class="h-8 w-8 text-slate-300 mx-auto mb-3" />
            <p class="text-[12px] font-black">
              {{ products.length === 0 ? 'Aucun produit en boutique pour le moment.' : 'Aucun produit ne correspond a votre recherche.' }}
            </p>
            <p class="text-[11px] font-bold text-slate-400 mt-1">
              {{ products.length === 0 ? 'Ajoutez d abord un produit dans l onglet Stock.' : 'Essayez une autre recherche ou une autre categorie.' }}
            </p>
          </div>
          <div v-if="totalPages > 1" class="flex justify-center gap-1.5 pt-4">
            <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="['w-7 h-7 rounded-lg text-[10px] font-black transition-all', currentPage === page ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50']">{{ page }}</button>
          </div>
        </div>

        <div v-else class="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h3 class="text-[11px] font-black uppercase text-slate-900 tracking-widest">Inventaire des Produits</h3>
            <button @click="openAddProductModal" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-md transition-all">Nouveau Produit</button>
          </div>
          <div v-if="paginatedProducts.length > 0" class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th class="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Produit</th>
                  <th class="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Prix</th>
                  <th class="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Stock</th>
                  <th class="p-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-slate-900">
                <tr v-for="p in paginatedProducts" :key="p.id" class="hover:bg-slate-50 transition-colors">
                  <td class="p-4"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-lg bg-slate-100 p-1 flex items-center justify-center shrink-0"><img v-if="p.photo" :src="p.photo" class="h-full object-contain" /><Package v-else class="h-4 w-4 text-slate-300" /></div><span class="text-[12px] font-bold">{{ p.name }}</span></div></td>
                  <td class="p-4 text-right text-[12px] font-black">{{ p.price.toLocaleString() }}</td>
                  <td class="p-4 text-center"><span :class="['px-2 py-0.5 rounded-full text-[10px] font-black', p.stock < 5 ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50']">{{ p.stock }}</span></td>
                  <td class="p-4 text-right flex justify-end gap-1">
                    <button @click="openEditProductModal(p)" class="p-2 text-slate-400 hover:text-indigo-600 transition-all"><Edit class="h-4 w-4" /></button>
                    <button @click="handleDelete(p)" class="p-2 text-slate-400 hover:text-rose-600 transition-all"><Trash2 class="h-4 w-4" /></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="p-8 text-center text-slate-900">
            <AlertCircle class="h-8 w-8 text-slate-300 mx-auto mb-3" />
            <p class="text-[12px] font-black">
              {{ products.length === 0 ? 'Aucun produit en stock pour le moment.' : 'Aucun produit ne correspond a votre recherche.' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Mini Cart Sidebar -->
      <div v-if="mode === 'sell'" class="w-full lg:w-[300px] bg-white rounded-3xl border border-slate-100 shadow-xl p-5 flex flex-col h-fit sticky top-6">
        <div class="flex items-center justify-between mb-6 text-slate-900">
          <h2 class="text-[13px] font-black uppercase tracking-wider flex items-center gap-2"><ShoppingCart class="h-4 w-4 text-indigo-600" /> Panier</h2>
          <button @click="cart = []" class="text-[9px] font-bold text-slate-400 hover:text-rose-500 uppercase">Vider</button>
        </div>
        <div class="space-y-4 max-h-[350px] overflow-y-auto mb-6 scrollbar-none pr-1">
          <div v-for="item in cart" :key="item.product.id" class="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-transparent hover:border-slate-200 transition-all text-slate-900">
            <div class="flex-1 min-w-0">
              <p class="text-[11px] font-black truncate">{{ item.product.name }}</p>
              <p class="text-[10px] font-bold text-indigo-600">{{ item.product.price.toLocaleString() }} CFA</p>
            </div>
            <div class="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-slate-200 shadow-sm">
              <button @click="updateCartQuantity(item.product.id, -1)" class="p-0.5 text-slate-400 hover:text-rose-500"><Minus class="h-3 w-3" /></button>
              <span class="text-[11px] font-black w-4 text-center">{{ item.quantity }}</span>
              <button @click="updateCartQuantity(item.product.id, 1)" class="p-0.5 text-slate-400 hover:text-indigo-600"><Plus class="h-3 w-3" /></button>
            </div>
            <button @click="removeFromCart(item.product.id)" class="p-1 text-slate-300 hover:text-rose-500"><Trash2 class="h-3.5 w-3.5" /></button>
          </div>
          <div v-if="cart.length === 0" class="py-10 text-center space-y-2 opacity-40">
            <ShoppingCart class="h-8 w-8 mx-auto text-slate-300" />
            <p class="text-[10px] font-bold uppercase">Panier vide</p>
          </div>
        </div>
        <div class="border-t border-slate-100 pt-5 space-y-5">
          <div class="flex justify-between items-end text-slate-900"><p class="text-[10px] font-black text-slate-400 uppercase">Total à payer</p><p class="text-2xl font-black tracking-tighter">{{ cartTotal.toLocaleString() }} <span class="text-xs">CFA</span></p></div>
          <button :disabled="cart.length === 0" @click="handleCheckout" class="w-full bg-slate-900 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 disabled:opacity-20 transition-all shadow-xl shadow-slate-200">Valider l'encaissement</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300 text-slate-900">
        <div class="bg-white rounded-[2rem] p-8 max-w-xs w-full shadow-2xl relative">
          <h2 class="text-lg font-black uppercase mb-6 tracking-tight">{{ currentProduct.id ? 'Modifier' : 'Nouveau' }}</h2>
          <form @submit.prevent="handleSaveProduct" class="space-y-4">
            <div v-if="productFormError" role="alert" class="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-2 text-[11px] font-semibold text-rose-800 leading-snug">
              {{ productFormError }}
            </div>
            <div class="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
              <div class="w-12 h-12 rounded-lg bg-white border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative shrink-0">
                <img v-if="photoPreview || currentProduct.photo" :src="photoPreview || currentProduct.photo" class="h-full object-contain" />
                <PlusCircle v-else class="h-4 w-4 text-slate-300" />
                <input type="file" accept="image/*" @change="handlePhotoChange" class="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <p class="text-[10px] font-black uppercase text-slate-400">Image</p>
            </div>
            <input required v-model="currentProduct.name" :minlength="STRING_LIMITS.labelName.min" :maxlength="STRING_LIMITS.labelName.max" placeholder="Nom du produit" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-bold outline-none focus:border-rose-600 transition-all" />
            <div class="grid grid-cols-2 gap-2">
              <input required v-model.number="currentProduct.price" type="number" placeholder="Prix" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-bold outline-none" />
              <input required v-model.number="currentProduct.stock" type="number" placeholder="Stock" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-bold outline-none" />
            </div>
            <input v-model="currentProduct.category" :maxlength="STRING_LIMITS.productCategory.max" placeholder="Catégorie" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-bold outline-none" />
            <div class="flex gap-2 pt-2">
              <button type="button" @click="isModalOpen = false; productFormError = ''" class="flex-1 py-2 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50">Annuler</button>
              <button type="submit" class="flex-[2] py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 transition-all shadow-lg">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ShoppingBag, Plus, Minus, Search, CreditCard, ShoppingCart, Settings, Package, Edit, Trash2, X, PlusCircle, AlertCircle } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { useConfirmStore } from '../stores/confirm';
import { readFetchResult } from '../lib/getApiErrorMessage';
import { STRING_LIMITS } from '../lib/stringLimits';

const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const confirmStore = useConfirmStore();

type Product = { id: number; name: string; category: string; price: number; stock: number; photo?: string; };

const mode = ref<'sell' | 'manage'>('sell');
const products = ref<Product[]>([]);
const searchTerm = ref('');
const activeCategory = ref('Tous');
const cart = ref<{product: Product, quantity: number}[]>([]);
const isModalOpen = ref(false);
const productFormError = ref('');
const currentProduct = ref<Partial<Product>>({});
const photoPreview = ref<string | null>(null);
const currentPage = ref(1);
const itemsPerPage = 8;

const fetchProducts = async () => {
  try {
    const res = await fetch('/api/products', { headers: { 'Authorization': `Bearer ${authStore.token}` } });
    const result = await readFetchResult<Product[]>(res, 'Chargement des produits');
    if (!result.ok) {
      products.value = [];
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    products.value = Array.isArray(result.data) ? result.data : [];
  } catch {
    notificationStore.showNotification(
      'Chargement des produits — impossible de contacter le serveur.',
      'error',
      8000
    );
  }
};

onMounted(fetchProducts);

const categories = computed(() => ['Tous', ...new Set(products.value.map(p => p.category).filter(Boolean))]);
const filteredProducts = computed(() => products.value.filter(p => (activeCategory.value === 'Tous' || p.category === activeCategory.value) && p.name.toLowerCase().includes(searchTerm.value.toLowerCase())));
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage));
const paginatedProducts = computed(() => filteredProducts.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage));
const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0));

const handlePhotoChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      photoPreview.value = reader.result as string;
      currentProduct.value.photo = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const addToCart = (product: Product) => {
  const existing = cart.value.find(item => item.product.id === product.id);
  if (existing) {
    if (existing.quantity >= product.stock) { notificationStore.showNotification('Stock insuffisant', 'warning'); return; }
    existing.quantity++;
  } else { cart.value.push({ product, quantity: 1 }); }
};

const updateCartQuantity = (productId: number, delta: number) => {
  const item = cart.value.find(i => i.product.id === productId);
  if (item) {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    if (newQty > item.product.stock) { notificationStore.showNotification('Stock insuffisant', 'warning'); return; }
    item.quantity = newQty;
  }
};

const removeFromCart = (id: number) => { cart.value = cart.value.filter(i => i.product.id !== id); };

const handleCheckout = () => {
  if (cart.value.length === 0) return;
  confirmStore.confirm({
    title: 'Encaisser',
    message: `Valider pour ${cartTotal.value.toLocaleString()} CFA ?`,
    onConfirm: async () => {
      try {
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.token}` },
          body: JSON.stringify({
            amount: cartTotal.value,
            type: 'income',
            description: `Vente boutique: ${cart.value.map(c => `${c.quantity}x ${c.product.name}`).join(', ')}`,
            items: cart.value.map(c => ({ id: c.product.id, quantity: c.quantity }))
          })
        });
        const checkoutResult = await readFetchResult(res, 'Encaissement boutique');
        if (!checkoutResult.ok) {
          notificationStore.showNotification(checkoutResult.message, 'error', 8000);
          return;
        }
        cart.value = [];
        fetchProducts();
        notificationStore.showNotification('Vente et stock mis à jour', 'success');
      } catch {
        notificationStore.showNotification('Encaissement boutique — erreur réseau.', 'error', 8000);
      }
    }
  });
};

const openAddProductModal = () => {
  productFormError.value = '';
  currentProduct.value = { stock: 0, price: 0 };
  photoPreview.value = null;
  isModalOpen.value = true;
};
const openEditProductModal = (p: Product) => {
  productFormError.value = '';
  currentProduct.value = { ...p };
  photoPreview.value = p.photo || null;
  isModalOpen.value = true;
};

const handleSaveProduct = async () => {
  const name = String(currentProduct.value.name ?? '').trim();
  const category = String(currentProduct.value.category ?? '').trim();
  if (
    name.length < STRING_LIMITS.labelName.min ||
    name.length > STRING_LIMITS.labelName.max
  ) {
    productFormError.value = `Nom du produit : entre ${STRING_LIMITS.labelName.min} et ${STRING_LIMITS.labelName.max} caractères.`;
    notificationStore.showNotification(productFormError.value, 'error', 8000);
    return;
  }
  if (category.length > STRING_LIMITS.productCategory.max) {
    productFormError.value = `Catégorie : ${STRING_LIMITS.productCategory.max} caractères maximum.`;
    notificationStore.showNotification(productFormError.value, 'error', 8000);
    return;
  }
  const price = Number(currentProduct.value.price);
  if (!Number.isFinite(price) || price <= 0) {
    productFormError.value = 'Indiquez un prix valide supérieur à 0.';
    notificationStore.showNotification(productFormError.value, 'error', 8000);
    return;
  }
  const payload = {
    ...currentProduct.value,
    name,
    category: category || undefined,
    price,
    stock:
      currentProduct.value.stock === undefined || currentProduct.value.stock === null
        ? 0
        : Number(currentProduct.value.stock),
  };
  productFormError.value = '';
  try {
    const method = currentProduct.value.id ? 'PUT' : 'POST';
    const url = currentProduct.value.id ? `/api/products/${currentProduct.value.id}` : '/api/products';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authStore.token}` },
      body: JSON.stringify(payload),
    });
    const result = await readFetchResult(res, 'Enregistrement du produit');
    if (!result.ok) {
      productFormError.value = result.message;
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    productFormError.value = '';
    isModalOpen.value = false;
    fetchProducts();
    notificationStore.showNotification('Produit enregistré', 'success');
  } catch {
    const msg = 'Enregistrement du produit — erreur réseau.';
    productFormError.value = msg;
    notificationStore.showNotification(msg, 'error', 8000);
  }
};

const handleDelete = (p: Product) => {
  confirmStore.confirm({
    title: 'Supprimer',
    message: 'Supprimer ce produit ?',
    onConfirm: async () => {
      try {
        const res = await fetch(`/api/products/${p.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${authStore.token}` },
        });
        const delResult = await readFetchResult(res, 'Suppression du produit');
        if (!delResult.ok) {
          notificationStore.showNotification(delResult.message, 'error', 8000);
          return;
        }
        fetchProducts();
        notificationStore.showNotification('Produit supprimé', 'success');
      } catch {
        notificationStore.showNotification('Suppression du produit — erreur réseau.', 'error', 8000);
      }
    },
  });
};
</script>
