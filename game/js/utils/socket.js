import '../../../node_modules/socket.io-client/dist/socket.io.min.js';

const ENDPOINT =
  document.location.hostname === 'localhost'
    ? 'http://localhost:4001'
    : 'http://192.168.2.69:4001';

export const socket = io(ENDPOINT);
