// Compare dashboard uses prototype brand data; it is gated OFF in the production
// build (.env.production) until the data is verified. Dev/test/e2e default ON.
export const COMPARE_ENABLED = import.meta.env.VITE_COMPARE_ENABLED !== 'false';
