// frontend/src/services/BroadcastService.js

// This creates a communication channel named 'auth_channel' that all our tabs can join.
const channel = new BroadcastChannel('auth_channel');

// This function sends a simple "auth_change" message to all other tabs.
export const postAuthChange = () => {
    channel.postMessage('auth_change');
};

// This function allows a component to listen for that message and run a callback function.
export const listenToAuthChange = (callback) => {
    const handler = (event) => {
        if (event.data === 'auth_change') {
            callback();
        }
    };
    channel.addEventListener('message', handler);

    // This returns a function to stop listening, which is important for cleanup.
    return () => channel.removeEventListener('message', handler);
};