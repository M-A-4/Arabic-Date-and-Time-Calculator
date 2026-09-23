<script setup>
import {ref, onMounted, onUnmounted} from 'vue'

const shown = ref(false)

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
   });
}

let deferredPrompt = null;

const handleBeforeInstallPrompt = (e) => {
  e.preventDefault();
  deferredPrompt = e;
  shown.value = true;
}

const handleAppInstalled = () => {
  shown.value = false;
  deferredPrompt = null;
  if (navigator.onLine && typeof umami !== 'undefined'){
    umami.track('install-to-mainscreen', {
      page_title: document.title,
      page_url: window.location.pathname
    });
  }
}

onMounted(() => {
  if ('serviceWorker' in navigator){
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
  }
});

onUnmounted(() => {
  window.removeEventListener('beforeinstalledprompt', handleBeforeInstallPrompt);
  window.removeEventListener('appinstalled', handleAppInstalled);
});

async function installPwa() {
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  const {outcome} = await deferredPrompt.userChoice;
  deferredPrompt = null;
  shown.value = false;
}

</script>

<template>
    <div style="text-align:center">
        <button v-show="shown" id="pwaInstallBtn" @click="installPwa">
          تثبيت أيقونة الموقع على الشاشة الرئيسية
        </button>
    </div><br>
</template>

<style scoped></style>