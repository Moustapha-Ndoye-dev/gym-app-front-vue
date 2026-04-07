<template>
  <div class="max-w-5xl mx-auto space-y-5 animate-in fade-in duration-500 text-slate-900">

    <!-- En-tête — même palette indigo / émeraude / slate que l’app (différence Vue : barre violette + coins arrondis) -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div class="flex items-start gap-3">
        <span class="hidden sm:block mt-1 h-9 w-1 rounded-full bg-gradient-to-b from-violet-500 to-indigo-600 shrink-0" aria-hidden="true"></span>
        <div class="min-w-0 flex-1 pr-2">
          <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight uppercase text-slate-900">Contrôle d'accès</h1>
          <template v-if="authStore.user?.role === 'controller'">
            <p class="text-[11px] sm:text-[12px] font-medium text-slate-600 mt-0.5 leading-snug break-words [overflow-wrap:anywhere] max-w-full">
              <span class="font-bold text-slate-800">{{ authStore.user.username }}</span>
              <template v-if="authStore.user.gymName">
                <span class="text-slate-400"> · </span>
                <span class="font-semibold text-indigo-600">{{ authStore.user.gymName }}</span>
              </template>
            </p>
          </template>
          <p v-else class="text-slate-500 text-[11px] sm:text-[12px] font-medium">Terminal de validation en temps réel.</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
        <div class="flex items-center gap-2">
          <div :class="['w-2 h-2 rounded-full', cameraActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300']"></div>
          <span class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{{ cameraActive ? 'En ligne' : 'Hors ligne' }}</span>
        </div>
        <button
          @click="toggleScanner"
          :class="['relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none', isScannerEnabled ? 'bg-indigo-600' : 'bg-slate-200']"
        >
          <span :class="['inline-block h-4 w-4 transform rounded-full bg-white transition-transform', isScannerEnabled ? 'translate-x-5' : 'translate-x-1']" />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">

      <div class="lg:col-span-7 xl:col-span-8">

        <template v-if="!scanResult">
          <div class="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[490px] p-10">

            <div :class="['inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 border', isScannerEnabled ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200']">
              <span :class="['w-1.5 h-1.5 rounded-full', isScannerEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400']"></span>
              <span :class="['text-[9px] font-black uppercase tracking-[0.2em]', isScannerEnabled ? 'text-emerald-600' : 'text-slate-400']">
                {{ isScannerEnabled ? 'Détection active' : 'Désactivé' }}
              </span>
            </div>

            <h2 class="text-lg font-black uppercase tracking-tight text-slate-900 mb-1">Scanner QR</h2>
            <p class="text-[11px] text-slate-400 mb-7 text-center max-w-xs leading-relaxed">
              <template v-if="isScannerEnabled && cameraSurface === 'native'">Tout le cadre est analysé — le repère vert épouse le QR détecté</template>
              <template v-else-if="isScannerEnabled && cameraSurface === 'html5'">Recherche du QR sur toute la zone caméra</template>
              <template v-else>Activez le scanner pour commencer</template>
            </p>

            <div :class="['p-[2.5px] rounded-[26px] transition-all duration-500', isScannerEnabled
              ? 'bg-gradient-to-br from-indigo-500 via-violet-500 to-indigo-700 shadow-[0_0_55px_rgba(99,102,241,0.40),0_10px_30px_rgba(0,0,0,0.28)]'
              : 'bg-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.10)]']">

              <div class="relative w-80 h-80 rounded-[24px] bg-slate-950 overflow-hidden">

                <video
                  ref="videoEl"
                  class="absolute inset-0 z-[1] block h-full w-full bg-[#020617] object-contain transition-opacity duration-300"
                  :class="isScannerEnabled && cameraSurface === 'native' ? 'opacity-100' : 'opacity-0 pointer-events-none'"
                  playsinline
                  muted
                />

                <div
                  id="reader"
                  class="qr-reader absolute inset-0 z-[1] transition-opacity duration-300"
                  :class="isScannerEnabled && cameraSurface === 'html5' ? 'opacity-100' : 'opacity-0 pointer-events-none'"
                  :style="{ width: READER_PX + 'px', height: READER_PX + 'px' }"
                ></div>

                <div
                  v-if="isScannerEnabled && cameraSurface === 'native' && qrHighlight && qrHighlight.width > 4 && qrHighlight.height > 4"
                  class="pointer-events-none absolute z-20 rounded-md border-2 border-emerald-400 shadow-[0_0_26px_rgba(52,211,153,0.55)] transition-all duration-75 ease-out"
                  :style="{
                    left: qrHighlight.left + 'px',
                    top: qrHighlight.top + 'px',
                    width: qrHighlight.width + 'px',
                    height: qrHighlight.height + 'px',
                  }"
                />

                <div v-if="!isScannerEnabled" class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-md text-white/25">
                  <Power class="w-12 h-12 mb-3" />
                  <p class="text-[9px] font-black uppercase tracking-[0.28em]">Caméra éteinte</p>
                </div>
              </div>
            </div>

            <p class="mt-7 flex items-center gap-2 text-[10px] font-semibold text-slate-400">
              <template v-if="isScannerEnabled">
                <Scan class="h-3 w-3 text-indigo-400" /> Analyse du flux en cours…
              </template>
              <template v-else>
                <Power class="h-3 w-3 opacity-40" /> Scanner désactivé
              </template>
            </p>
          </div>
        </template>

        <!-- Résultat de scan -->
        <template v-else>
          <div :class="['rounded-2xl p-1 shadow-xl border border-transparent animate-in zoom-in duration-300 min-h-[490px] flex flex-col', scanResult.granted ? 'bg-emerald-500' : 'bg-rose-500']">
            <div class="flex-1 bg-white m-1 rounded-xl p-6 flex flex-col items-center justify-between">
              <div class="text-center w-full">
                <div :class="['inline-flex p-3 rounded-2xl mb-4', scanResult.granted ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600']">
                  <CheckCircle2 v-if="scanResult.granted" class="h-10 w-10" />
                  <XCircle v-else class="h-10 w-10" />
                </div>

                <div class="mb-6">
                  <h3 :class="['text-2xl font-black uppercase tracking-tight', scanResult.granted ? 'text-emerald-600' : 'text-rose-600']">
                    {{ scanResult.message }}
                  </h3>
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Statut de l'accès</p>
                </div>

                <div v-if="scanResult.member" class="w-full max-w-sm mx-auto p-5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-5">
                  <div class="w-24 h-24 rounded-xl bg-white overflow-hidden border-2 border-white shadow-md shrink-0">
                    <img v-if="scanResult.member.photo" :src="scanResult.member.photo" alt="Photo adhérent" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-600 text-3xl font-black">
                      {{ scanResult.member.firstName?.[0] }}{{ scanResult.member.lastName?.[0] }}
                    </div>
                  </div>
                  <div class="text-left space-y-2 min-w-0 flex-1">
                    <div>
                      <p class="text-[8px] font-black text-indigo-500 uppercase tracking-widest mb-0.5">Adhérent</p>
                      <p class="text-lg font-black text-slate-900 leading-tight">{{ scanResult.member.firstName }} <br/> {{ scanResult.member.lastName }}</p>
                    </div>
                    <div v-if="scanResult.member.subscriptionName">
                      <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Formule</p>
                      <p class="text-[11px] font-bold text-slate-800 uppercase">{{ scanResult.member.subscriptionName }}</p>
                    </div>
                    <div v-if="scanResult.member.activities?.length">
                      <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Activités</p>
                      <div class="flex flex-wrap gap-1">
                        <span v-for="name in scanResult.member.activities" :key="name" class="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-cyan-50 text-cyan-800 border border-cyan-100">
                          {{ name }}
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center gap-1.5 px-2 py-1 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded uppercase w-fit">
                      <UserCheck class="h-2.5 w-2.5" /> ID Vérifié
                    </div>
                  </div>
                </div>

                <div v-else-if="scanResult.scannedCode" class="w-full max-w-sm mx-auto rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left">
                  <p class="text-[8px] font-black uppercase tracking-widest text-slate-400">QR lu</p>
                  <p class="mt-2 break-all text-[12px] font-bold text-slate-900">{{ scanResult.scannedCode }}</p>
                </div>
              </div>

              <button
                @click="handleNext"
                :class="['w-full max-w-xs py-3.5 rounded-xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 text-[11px] mt-6', scanResult.granted ? 'bg-slate-900 text-white hover:bg-indigo-600' : 'bg-rose-600 text-white hover:bg-rose-700']"
              >
                Suivant <ArrowRight class="h-4 w-4" />
              </button>
            </div>
          </div>
        </template>
      </div>

      <div class="lg:col-span-5 xl:col-span-4 flex flex-col">
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-1 flex flex-col min-h-[490px]">
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100">
                <History class="h-4 w-4" />
              </div>
              <h2 class="text-[13px] font-black tracking-tight uppercase text-slate-900">Historique</h2>
            </div>
            <button @click="fetchLogs" class="p-1.5 hover:bg-slate-50 rounded-xl text-slate-300 transition-colors">
              <RefreshCw class="h-3.5 w-3.5" />
            </button>
          </div>

          <div class="space-y-2.5 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <div v-if="logs.length === 0" class="py-16 text-center opacity-20">
              <User class="h-10 w-10 mx-auto" />
              <p class="text-[9px] font-black uppercase tracking-widest mt-2">Vide</p>
            </div>
            <div
              v-else
              v-for="log in logs.slice(0, 10)"
              :key="log.id"
              class="flex items-center justify-between p-2.5 bg-slate-50/50 rounded-2xl border border-slate-100/50 hover:bg-white transition-all"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">
                  <img v-if="log.member?.photo" :src="log.member.photo" alt="" class="w-full h-full object-cover" />
                  <User v-else class="h-4 w-4" />
                </div>
                <div class="min-w-0">
                  <p class="text-[11px] font-bold text-slate-900 truncate max-w-[80px]">{{ log.member ? log.member.firstName : 'Client' }}</p>
                  <p class="text-[8px] font-bold text-slate-400 uppercase">{{ formatDate(log.accessTime) }}</p>
                </div>
              </div>
              <div :class="['w-2 h-2 rounded-full', log.status === 'granted' ? 'bg-emerald-500' : 'bg-rose-500']"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { History, User, CheckCircle2, XCircle, RefreshCw, Power, ArrowRight, UserCheck, Scan } from 'lucide-vue-next';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useAuthStore } from '../stores/auth';
import { useNotificationStore } from '../stores/notification';
import { readFetchResult } from '../lib/getApiErrorMessage';

/* ─── Config scanner ─────────────────────────────────────────────────────── */

const READER_PX = 320;

type NativeQrBarcodeDetector = {
  detect: (source: HTMLVideoElement) => Promise<
    Array<{ rawValue?: string; boundingBox?: DOMRectReadOnly }>
  >;
};

type NativeQrBarcodeDetectorCtor = new (options?: { formats?: string[] }) => NativeQrBarcodeDetector;

function getNativeQrDetectorCtor(): NativeQrBarcodeDetectorCtor | null {
  if (typeof window === 'undefined' || !('BarcodeDetector' in window)) return null;
  return (window as unknown as { BarcodeDetector: NativeQrBarcodeDetectorCtor }).BarcodeDetector;
}

type QrHighlightRect = { left: number; top: number; width: number; height: number };

function mapVideoBBoxToOverlay(bbox: DOMRectReadOnly, video: HTMLVideoElement): QrHighlightRect {
  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const cw = video.clientWidth;
  const ch = video.clientHeight;
  if (!vw || !vh || !cw || !ch) {
    return { left: 0, top: 0, width: 0, height: 0 };
  }
  const scale = Math.min(cw / vw, ch / vh);
  const dw = vw * scale;
  const dh = vh * scale;
  const ox = (cw - dw) / 2;
  const oy = (ch - dh) / 2;
  return {
    left: bbox.x * scale + ox,
    top: bbox.y * scale + oy,
    width: bbox.width * scale,
    height: bbox.height * scale,
  };
}

const HTML5_FALLBACK_CONFIG: {
  fps: number;
  qrbox: (vw: number, vh: number) => { width: number; height: number };
  disableFlip: boolean;
  videoConstraints: MediaTrackConstraints;
} = {
  fps: 12,
  qrbox: (vw, vh) => ({ width: vw, height: vh }),
  disableFlip: true,
  videoConstraints: { facingMode: { ideal: 'environment' } },
};

function waitNextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

/* ─── Stores ─────────────────────────────────────────────────────────────── */

const authStore         = useAuthStore();
const notificationStore = useNotificationStore();

/* ─── Types ──────────────────────────────────────────────────────────────── */

type AccessLog = {
  id: number;
  member?: { firstName: string; lastName: string; photo?: string };
  ticket?: { type: string };
  accessTime: string;
  status: 'granted' | 'denied';
};

/* ─── State ──────────────────────────────────────────────────────────────── */

const scanResult      = ref<{ granted: boolean; message: string; member?: any; scannedCode?: string } | null>(null);
const logs            = ref<AccessLog[]>([]);
const isScannerEnabled = ref(true);
const cameraActive    = ref(false);
const scanLock        = ref(false);
/** Évite un 2e verify si html5-qrcode envoie un callback après « Suivant ». */
const scanCooldownUntil = ref(0);
const cameraSurface   = ref<'native' | 'html5' | null>(null);
const qrHighlight     = ref<QrHighlightRect | null>(null);
const videoEl         = ref<HTMLVideoElement | null>(null);

let scanner: Html5Qrcode | null = null;
let nativeStream: MediaStream | null = null;
let nativeDetector: NativeQrBarcodeDetector | null = null;
let rafId = 0;

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const formatDate = (d: string) =>
  new Date(d).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

function parseApiGranted(value: unknown): boolean {
  return value === true || value === 'true' || value === 1;
}

/* ─── Logs ───────────────────────────────────────────────────────────────── */

const fetchLogs = async () => {
  try {
    const res = await fetch('/api/access/logs', {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    const result = await readFetchResult<AccessLog[]>(res, "Chargement de l'historique d'accès");
    if (!result.ok) {
      logs.value = [];
      notificationStore.showNotification(result.message, 'error', 8000);
      return;
    }
    logs.value = Array.isArray(result.data) ? result.data : [];
  } catch {
    notificationStore.showNotification(
      "Historique d'accès — impossible de contacter le serveur.",
      'error',
      8000,
    );
  }
};

/* ─── Scanner ────────────────────────────────────────────────────────────── */

const stopScanner = async () => {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
  nativeDetector = null;
  if (nativeStream) {
    nativeStream.getTracks().forEach((t) => t.stop());
    nativeStream = null;
  }
  if (videoEl.value) {
    videoEl.value.srcObject = null;
  }
  qrHighlight.value = null;
  if (scanner) {
    try {
      if (scanner.isScanning) await scanner.stop();
    } catch (e) { console.error('stopScanner:', e); }
    scanner = null;
  }
  cameraSurface.value = null;
  cameraActive.value = false;
};

/* ─── Scan success ───────────────────────────────────────────────────────── */

const onScanSuccess = async (decodedText: string) => {
  if (Date.now() < scanCooldownUntil.value) return;
  if (scanLock.value) return;
  scanLock.value = true;
  isScannerEnabled.value = false;
  try {
    await stopScanner();
    const res = await fetch('/api/access/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authStore.token}`,
      },
      body: JSON.stringify({ qr_code: decodedText }),
    });
    const result = await readFetchResult<{
      granted?: boolean;
      message?: string;
      member?: unknown;
      scannedCode?: string;
    }>(res, "Vérification d'accès");

    if (!result.ok) {
      scanResult.value = { granted: false, message: result.message };
      notificationStore.showNotification(result.message, 'error', 8000);
      scanLock.value = false;
    } else {
      const d = result.data;
      scanResult.value = {
        granted:     parseApiGranted(d.granted),
        message:     typeof d.message === 'string' ? d.message : '',
        member:      d.member,
        scannedCode: typeof d.scannedCode === 'string' ? d.scannedCode : decodedText,
      };
    }
    fetchLogs();
  } catch {
    const msg = "Vérification d'accès — erreur réseau.";
    scanResult.value = { granted: false, message: msg };
    notificationStore.showNotification(msg, 'error', 8000);
    scanLock.value = false;
  }
};

const startScanner = async () => {
  if (scanner || nativeStream) return;
  qrHighlight.value = null;
  try {
    const DetectorClass = getNativeQrDetectorCtor();
    let detector: NativeQrBarcodeDetector | null = null;
    if (DetectorClass) {
      try {
        detector = new DetectorClass({ formats: ['qr_code'] });
      } catch {
        detector = null;
      }
    }

    if (detector) {
      nativeDetector = detector;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });
      nativeStream = stream;
      cameraSurface.value = 'native';
      await waitNextPaint();
      const video = videoEl.value;
      if (!nativeStream || !video) {
        stream.getTracks().forEach((t) => t.stop());
        nativeStream = null;
        nativeDetector = null;
        cameraSurface.value = null;
        throw new Error('Élément vidéo indisponible');
      }
      video.srcObject = stream;
      await video.play();
      cameraActive.value = true;

      const minIntervalMs = 45;
      let lastFrameTime = 0;

      const tick = async (now: number) => {
        if (!nativeStream || !nativeDetector) return;
        if (scanLock.value) {
          return;
        }
        if (now - lastFrameTime < minIntervalMs) {
          rafId = requestAnimationFrame(tick);
          return;
        }
        lastFrameTime = now;
        try {
          const codes = await nativeDetector.detect(video);
          if (codes.length > 0) {
            const c = codes[0];
            const raw = c.rawValue ?? '';
            if (c.boundingBox && video.videoWidth > 0) {
              qrHighlight.value = mapVideoBBoxToOverlay(c.boundingBox, video);
            }
            if (raw) {
              void onScanSuccess(raw);
              return;
            }
          } else {
            qrHighlight.value = null;
          }
        } catch {
          qrHighlight.value = null;
        }
        if (nativeStream) {
          rafId = requestAnimationFrame(tick);
        }
      };
      rafId = requestAnimationFrame(tick);
      return;
    }

    cameraSurface.value = 'html5';
    await waitNextPaint();
    scanner = new Html5Qrcode('reader', {
      verbose: false,
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      useBarCodeDetectorIfSupported: true,
    });
    await scanner.start(
      { facingMode: 'environment' },
      HTML5_FALLBACK_CONFIG,
      onScanSuccess,
      () => {},
    );
    cameraActive.value = true;
  } catch (e) {
    console.error('startScanner:', e);
    await stopScanner();
    isScannerEnabled.value = false;
  }
};

/* ─── Lifecycle ──────────────────────────────────────────────────────────── */

const toggleScanner = () => { isScannerEnabled.value = !isScannerEnabled.value; };
/** Caméra coupée puis cooldown avant déverrouillage (callbacks scanner retardataires). */
const handleNext = async () => {
  try {
    await stopScanner();
  } finally {
    scanCooldownUntil.value = Date.now() + 400;
    scanLock.value = false;
    scanResult.value = null;
    isScannerEnabled.value = false;
  }
};

watch([isScannerEnabled, scanResult], async ([enabled, result]) => {
  if (enabled && !result) await startScanner();
  else await stopScanner();
});

onMounted(() => {
  fetchLogs();
  if (isScannerEnabled.value) startScanner();
});

onUnmounted(async () => { await stopScanner(); });
</script>

<style scoped>
/*
 * La lib html5-qrcode injecte element.style.width = "320px" et position = "relative".
 * Notre :style inline { width: 320px, height: 320px } a la même spécificité → pas de conflit.
 * :deep(video) cible la <video> injectée dynamiquement (hors scope Vue).
 * Vidéo 320×320 + object-fit: contain (cover décale le QR par rapport au canvas interne).
 * :deep(#qr-shaded-region) = masque de la lib quand qrbox est actif → on le masque.
 */
.qr-reader { overflow: hidden; }

.qr-reader :deep(video) {
  width:  320px !important;
  height: 320px !important;
  max-width: none !important;
  object-fit: contain !important;
  object-position: center !important;
  display: block !important;
  background: #020617;
}

.qr-reader :deep(#qr-shaded-region) { display: none !important; }

.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
</style>
