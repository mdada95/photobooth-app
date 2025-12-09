// service-worker.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');
importScripts('https://cdn.jsdelivr.net/npm/idb@7.1.1/build/umd.js');

// Precache built assets (optional if using Angular CLI assets)
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);


const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin('photoUploadQueue', {
  maxRetentionTime: 24 * 60 // Retry for up to 24 hours
});

workbox.routing.registerRoute(
  ({ url, request }) =>
    url.hostname === 'api.cloudinary.com' && request.method === 'POST',
  new workbox.strategies.NetworkOnly({ plugins: [bgSyncPlugin] }),
  'POST'
);

self.addEventListener('install', (event) => {
  console.log('Custom SW installed.');
});

self.addEventListener('activate', (event) => {
  console.log('Custom SW activated.');
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'photo-upload-sync') {
    event.waitUntil(uploadPendingPhotos());
  }
});

// self.addEventListener('message', async (event) => {
//   if (event.data.type === 'UPLOAD_PHOTOS') {
//     const photos = event.data.payload;
//     for (const photo of photos) {
//       await fetch('/upload-photo', {
//         method: 'POST',
//         body: JSON.stringify(photo),
//         headers: { 'Content-Type': 'application/json' },
//       });
//     }
//   }
// });

async function uploadPendingPhotos() {
  const db = await idb.openDB('PhotoDB', 1);
  const photos = await db.getAll('photos');

  for (const photo of photos) {
    try {
      await uploadPhoto(photo);
      // await db.delete('photos', photo.id);
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  }
}

async function uploadPhoto(photo) {
  try {
    const formData = new FormData();
    formData.append('file', photo.data);
    formData.append('upload_preset', 'cloud_s_and_y');

    const response = await fetch('https://api.cloudinary.com/v1_1/de38ndf2u/image/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload photo');
    }
  } catch (error) {
    console.error('Error uploading photo:', error);
  }
}

// // Cache image assets
// registerRoute(
//   ({ request }) => request.destination === 'image',
//   new CacheFirst()
// );

// // Example: API requests
// registerRoute(
//   ({ url }) => url.pathname.startsWith('/api/'),
//   new NetworkFirst()
// );
