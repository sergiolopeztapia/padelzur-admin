import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { SessionState } from './useSessionStore.types';

const useSessionStore = create<SessionState>()(
	persist(
		(set) => ({
			session: null,
			setSession: (session) => set({ session }),
			clearSession: () => set({ session: null }),
		}),
		{
			name: 'admin_session',
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);

export default useSessionStore;
