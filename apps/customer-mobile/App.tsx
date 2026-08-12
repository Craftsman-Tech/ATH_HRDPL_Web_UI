import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { PortalShell } from './src/PortalShell';
import { SignIn } from './src/SignIn';

/**
 * Vexoo Customer — iOS and Android from one codebase.
 *
 * Session state is held here so sign-in and the portal shell stay decoupled;
 * it moves to expo-secure-store once packages/customer-api lands.
 */
export default function App() {
  const [customerName, setCustomerName] = useState<string | null>(null);

  return (
    <SafeAreaProvider>
      <StatusBar style={customerName ? 'dark' : 'light'} />
      {customerName ? (
        <PortalShell
          customerName={customerName}
          customerId="VX-PT-2048"
          onSignOut={() => setCustomerName(null)}
        />
      ) : (
        <SignIn onSignIn={setCustomerName} />
      )}
    </SafeAreaProvider>
  );
}
