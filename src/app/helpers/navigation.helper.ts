import { createNavigationContainerRef, NavigationState, PartialState, StackActions } from '@react-navigation/native';
import { RootStackList } from 'app/navigation/type.navigation';

export const navigationRef = createNavigationContainerRef<RootStackList>()

const navigate = <RouteName extends keyof RootStackList>(
  ...args:
    RouteName extends unknown
    ? undefined extends RootStackList[RouteName]
    ?
    | [screen: RouteName]
    | [screen: RouteName, params: RootStackList[RouteName]]
    : [screen: RouteName, params: RootStackList[RouteName]]
    : never
) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(...args);
  }
};

const push = <RouteName extends keyof RootStackList>(
  ...args:
    RouteName extends unknown
    ? undefined extends RootStackList[RouteName]
    ?
    | [screen: RouteName]
    | [screen: RouteName, params: RootStackList[RouteName]]
    : [screen: RouteName, params: RootStackList[RouteName]]
    : never
) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(args[0], args[1]))
  }
}

const pop = (n = 1) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.pop(n))
  }
}



const goBack = () => {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

const getRouteName = () => {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.name
  }
  return ""
}

const getActiveRouteName = (state: NavigationState | PartialState<NavigationState>): string => {
  const route = state?.routes?.[state.index || 0];

  if (route?.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
}

const replace = <RouteName extends keyof RootStackList>(
  ...args:
    RouteName extends unknown
    ? undefined extends RootStackList[RouteName]
    ?
    | [screen: RouteName]
    | [screen: RouteName, params: RootStackList[RouteName]]
    : [screen: RouteName, params: RootStackList[RouteName]]
    : never
) => {
  if (navigationRef.isReady() && getRouteName() !== args[0]) {
    navigationRef.dispatch(StackActions.replace(args[0], args[1]))
  }
}

export default {
  navigate,
  getRouteName,
  goBack,
  getActiveRouteName,
  replace,
  push,
  pop
}
