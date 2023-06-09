import { Routes, Route } from "react-router";
import { CallBackScreen } from "screens/auth/callback.screen";
import { RequireAuth, NotFound } from "../components";
import {
  LoginScreen,
  ProfileScreen,
  VouchersScreen,
  RecoveryDetailsScreen,
  CreateRecoveryScreen,
  LandingScreen,
  TeamsScreen,
  WalletSettings,
  WalletNotification,
  VoucherDetailsScreen,
  WalletRecoveryScreen
} from "../screens";
import { GlobalStyle } from "../utils";
import { RoutePath } from "./route-path";

export const Navigation = () => {
  return (
    <Routes>
      <Route path={RoutePath.home} element={<LoginScreen />} />
      <Route path={RoutePath.login} element={<LoginScreen />} />
      <Route path={RoutePath.recovery} element={<VouchersScreen />} />
      <Route path={RoutePath.wallet} element={<VoucherDetailsScreen />} />
      <Route path={RoutePath.walletRecovery} element={<WalletRecoveryScreen />} />


      <Route path={RoutePath.notFound} element={<NotFound />} />
      <Route path={RoutePath.callback} element={<CallBackScreen />} />
      <Route
        path={RoutePath.recoveryDetails}
        element={<RecoveryDetailsScreen />}
      />

      <Route element={<RequireAuth />}>
        <Route path={RoutePath.account} element={<ProfileScreen />} />
        <Route
          path={RoutePath.createRecovery}
          element={<CreateRecoveryScreen />}
        />

        <Route path={RoutePath.walletSettings} element={<WalletSettings />} />
        <Route
          path={RoutePath.notifications}
          element={<WalletNotification />}
        />
      </Route>
    </Routes>
  );
};

export const LandingPageNavigation = () => {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path={RoutePath.home} element={<LandingScreen />} />
        <Route path={RoutePath.teams} element={<TeamsScreen />} />
      </Routes>
    </>
  );
};
