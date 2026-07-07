import { createClient } from '@butterbase/sdk';

export const butterbase = createClient({
  appId: import.meta.env.VITE_BUTTERBASE_APP_ID,
  apiUrl: import.meta.env.VITE_BUTTERBASE_API_URL,
});
