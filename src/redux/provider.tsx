'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import SocketManager from './SocketManager';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
     return (
          <Provider store={store}>
               <SocketManager />
               {children}
          </Provider>
     );
}
