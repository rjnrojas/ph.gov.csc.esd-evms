const host = (
  (typeof window !== 'undefined' && window.__API_HOST__) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_HOST) ||
  (typeof window !== 'undefined' && window.location && window.location.hostname) ||
  'localhost'
);

const imageAddress = (
  (typeof window !== 'undefined' && window.__IMAGE_ADDRESS__) ||
  '/path/to/scanned'
);

const qrAddress = (
  (typeof window !== 'undefined' && window.__QR_ADDRESS__) ||
  '/path/to/qrcode'
);

const config = { host, imageAddress, qrAddress };

export default config;
