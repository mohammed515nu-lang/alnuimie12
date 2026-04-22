import type { NavigationProp, ParamListBase } from '@react-navigation/native';

import type { RootStackParamList } from './types';

/** تنقّل من تبويبات إلى شاشة في الـ Stack الأب */
export function navigateFromRoot(navigation: NavigationProp<ParamListBase>, name: keyof RootStackParamList) {
  const parent = navigation.getParent<NavigationProp<RootStackParamList>>();
  parent?.navigate(name as never);
}
