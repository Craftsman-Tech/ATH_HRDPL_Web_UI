/**
 * ============================================================================
 *  RootNavigator — Mobile
 * ============================================================================
 *  Top-level navigation logic:
 *    - Not signed in     → SignInScreen
 *    - Signed in          → role-based portal navigator (placeholder for now)
 *
 *  When auth state flips, the entire navigator re-renders, so there's no
 *  manual `replace`/`reset` plumbing needed.
 * ============================================================================
 */
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer }     from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth, useTheme }   from '../components/AppContexts';
import SignInScreen            from '../screens/SignInScreen';
import RegisterScreen          from '../screens/RegisterScreen';
import PortalHomeScreen        from '../screens/PortalHomeScreen';

// Param-list types for type-safe navigation. Each phase will add to these.
<<<<<<< HEAD
// `Home` deliberately lives only on the app stack — the auth stack cannot
// navigate to it, because signing in swaps the whole navigator instead.
export type AuthStackParamList = { SignIn: undefined; Register: undefined };
=======
export type AuthStackParamList = { SignIn: undefined; Register: undefined; Home: undefined };
>>>>>>> 298e0ab2d1a2dca93b78290b1b3f3d4fc0fb18c2
export type AppStackParamList  = { Home: undefined };

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack  = createNativeStackNavigator<AppStackParamList>();

export default function RootNavigator() {
  const { user, ready } = useAuth();
  const { theme }       = useTheme();

  // Brief splash while we hydrate persisted auth from AsyncStorage.
  if (!ready) {
    return (
      <View style={{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor: theme.bg }}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user
        ? (
          <AppStack.Navigator screenOptions={{ headerShown: false }}>
            <AppStack.Screen name="Home" component={PortalHomeScreen} />
          </AppStack.Navigator>
        )
        : (
          <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="SignIn" component={SignInScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
          </AuthStack.Navigator>
        )}
    </NavigationContainer>
  );
}
