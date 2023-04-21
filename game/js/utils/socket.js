import '../../../node_modules/socket.io-client/dist/socket.io.min.js';

const ENDPOINT =
  document.location.hostname === 'localhost'
    ? 'http://localhost:4001'
    : 'https://ridane.com';

export const socket = io(ENDPOINT);
