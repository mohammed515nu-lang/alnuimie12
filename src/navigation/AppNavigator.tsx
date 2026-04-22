import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';

import { useStore } from '../store/useStore';
import { colors } from '../theme';
import type { RootStackParamList } from './types';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { SearchScreen } from '../screens/social/SearchScreen';
import { PublicProfileScreen } from '../screens/social/PublicProfileScreen';
import { EditProfileScreen } from '../screens/social/EditProfileScreen';
import { PortfolioManageScreen } from '../screens/social/PortfolioManageScreen';
import { ConnectionRequestsScreen } from '../screens/social/ConnectionRequestsScreen';
import { ChatListScreen } from '../screens/chat/ChatListScreen';
import { ChatRoomScreen } from '../screens/chat/ChatRoomScreen';
import { WalletHomeScreen } from '../screens/wallet/WalletHomeScreen';
import { ManageCardsScreen } from '../screens/wallet/ManageCardsScreen';
import { AddCardScreen } from '../screens/wallet/AddCardScreen';
import { PayContractorScreen } from '../screens/wallet/PayContractorScreen';
import { ContractorPaySupplierScreen } from '../screens/wallet/ContractorPaySupplierScreen';
import { TransfersScreen } from '../screens/wallet/TransfersScreen';
import { ProjectsScreen } from '../screens/projects/ProjectsScreen';
import { NewProjectScreen } from '../screens/projects/NewProjectScreen';
import { BunyanAIScreen } from '../screens/ai/BunyanAIScreen';
import { AccountingHomeScreen } from '../screens/accounting/AccountingHomeScreen';
import { InvoicesScreen } from '../screens/accounting/InvoicesScreen';
import { NewInvoiceScreen } from '../screens/accounting/NewInvoiceScreen';
import { RevenuesScreen } from '../screens/accounting/RevenuesScreen';
import { AddRevenueScreen } from '../screens/accounting/AddRevenueScreen';
import { ExpenseCategoriesScreen } from '../screens/accounting/ExpenseCategoriesScreen';
import { ReportsScreen } from '../screens/accounting/ReportsScreen';
import { AccountScreen } from '../screens/account/AccountScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator();

const tabIcon: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home-outline',
  Projects: 'folder-outline',
  BunyanAI: 'hardware-chip-outline',
  Accounting: 'calculator-outline',
  Chats: 'chatbubbles-outline',
  Account: 'person-outline',
};

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.borderMuted,
          paddingTop: 4,
          height: 62,
        },
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontWeight: '700', fontSize: 10, marginBottom: 2 },
        tabBarIcon: ({ color, size }) => {
          const icon = tabIcon[route.name] ?? 'ellipse';
          return <Ionicons name={icon} size={size - 2} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} options={{ title: 'الرئيسية' }} />
      <Tabs.Screen name="Projects" component={ProjectsScreen} options={{ title: 'المشاريع' }} />
      <Tabs.Screen name="BunyanAI" component={BunyanAIScreen} options={{ title: 'بنيان AI' }} />
      <Tabs.Screen name="Accounting" component={AccountingHomeScreen} options={{ title: 'المحاسبة' }} />
      <Tabs.Screen name="Chats" component={ChatListScreen} options={{ title: 'محادثة' }} />
      <Tabs.Screen name="Account" component={AccountScreen} options={{ title: 'حسابي' }} />
    </Tabs.Navigator>
  );
}

const stackContent = { backgroundColor: colors.background };

export function AppNavigator() {
  const user = useStore((s) => s.user);
  const isAuthenticated = !!user;

  const theme = useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        background: colors.background,
        card: colors.surfaceMid,
        primary: colors.primary,
        text: colors.textSecondary,
        border: colors.borderMuted,
        notification: colors.notification,
      },
    }),
    []
  );

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="App" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Group
              screenOptions={{
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
                headerTitleStyle: { fontWeight: '800' },
                headerShadowVisible: false,
                contentStyle: stackContent,
              }}
            >
              <Stack.Screen
                name="DiscoverUsers"
                component={SearchScreen}
                options={{ title: 'اكتشف مستخدمين', headerTitleAlign: 'center' }}
              />
              <Stack.Screen
                name="PublicProfile"
                component={PublicProfileScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="ChatRoom" component={ChatRoomScreen} options={{ title: 'محادثة' }} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'تعديل ملفي' }} />
              <Stack.Screen name="PortfolioManage" component={PortfolioManageScreen} options={{ title: 'معرض أعمالي' }} />
              <Stack.Screen name="ConnectionRequests" component={ConnectionRequestsScreen} options={{ title: 'طلبات التواصل' }} />
              <Stack.Screen name="ManageCards" component={ManageCardsScreen} options={{ title: 'البطاقات' }} />
              <Stack.Screen name="AddCard" component={AddCardScreen} options={{ title: 'إضافة بطاقة' }} />
              <Stack.Screen name="PayContractor" component={PayContractorScreen} options={{ title: 'دفع للمقاول' }} />
              <Stack.Screen name="ContractorPaySupplier" component={ContractorPaySupplierScreen} options={{ title: 'دفع للمورد' }} />
              <Stack.Screen name="Transfers" component={TransfersScreen} options={{ title: 'التحويلات' }} />
              <Stack.Screen name="WalletHome" component={WalletHomeScreen} options={{ title: 'المحفظة' }} />
              <Stack.Screen name="Invoices" component={InvoicesScreen} options={{ headerShown: false }} />
              <Stack.Screen name="NewInvoice" component={NewInvoiceScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Revenues" component={RevenuesScreen} options={{ headerShown: false }} />
              <Stack.Screen name="AddRevenue" component={AddRevenueScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ExpenseCategories" component={ExpenseCategoriesScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ReportsAccounting" component={ReportsScreen} options={{ headerShown: false }} />
              <Stack.Screen name="NewProject" component={NewProjectScreen} options={{ headerShown: false }} />
            </Stack.Group>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
