import React, { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  TextInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Stack,
  Box,
  Notification,
  Alert,
  Modal,
  Center,
  Loader,
  Container,
} from "@mantine/core";
import { GoogleButton, MetaMaskButton } from "../../components";
import { OAuthProvider } from "@magic-ext/oauth";
import { ethers } from 'ethers'

import { SafeEventEmitterProvider } from '@web3auth/base'
import { SafeAuthKit, SafeAuthProviderType, SafeAuthSignInData } from '@safe-global/auth-kit'
import SafeServiceClient from '@safe-global/safe-service-client'
import EthersAdapter from '@safe-global/safe-ethers-lib'

import { useServices } from "services";
import { useStores } from "store";
import { RoutePath } from "navigation";
import { StyledSpan } from "./auth.screen.styles";

import Safe, { SafeAccountConfig, SafeFactory } from '@safe-global/safe-core-sdk'
import useRecoveryStore from "store/recovery/recovery.store";
//@ts-ignore
import AsguardHero from "../../assets/images/asguard-hero.svg";
import { NetworkUtil } from "utils/networks";

import MetaMaskSDK from '@metamask/sdk';

import detectEthereumProvider from '@metamask/detect-provider';






export function LoginScreen(props: any) {

  


  
  let navigate = useNavigate();

  const [signingIn, setSigningIn] = useState(false);
  const [loginType, setLoginType] = useState("wallet");

  const { setAccountDetails, setChainId, chainId } = useRecoveryStore(
    (state: any) => state
  );

  console.log(chainId)

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [safeAuthSignInResponse, setSafeAuthSignInResponse] = useState<SafeAuthSignInData | null>(
    null
  )
  const [safeAuth, setSafeAuth] = useState<SafeAuthKit>()
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null)


  useEffect(() => {
    ;(async () => {
      await setSafeAuth(
        await SafeAuthKit.init(SafeAuthProviderType.Web3Auth, {
          
          chainId: '0x' + NetworkUtil.getNetworkById(chainId)?.chainId.toString(16),
          txServiceUrl: NetworkUtil.getNetworkById(chainId)?.safeService , // Optional. Only if want to retrieve related safes
          authProviderConfig: {
            rpcTarget: NetworkUtil.getNetworkById(chainId)!.url,
            clientId: 'BAcCop_qaWVfw15peOnVq8xd8KefD3UvZ-3bKip0RNy0w1J0Z8ZKNNzWiFW97a66S-UGr-oZpzdk1hE8SwWmy00',
            network: 'testnet',
            theme: 'dark'
          }
        })
      )
    })()
  }, [chainId])



  const handleLogin = async () => {
    if (!safeAuth) return



    const response = await safeAuth.signIn()
    console.log('SIGN IN RESPONSE: ', response)

    console.log(response)
    setSafeAuthSignInResponse(response)
    setProvider(safeAuth.getProvider() as SafeEventEmitterProvider)

    setAccountDetails({provider: safeAuth.getProvider() as SafeEventEmitterProvider, authResponse: response})

    navigate(RoutePath.recovery)
  }

  const handleWalletLogin = async () => {

  const provider = await detectEthereumProvider();
  const safeOwner = new ethers.providers.Web3Provider(provider as ethers.providers.ExternalProvider).getSigner(0)
  setAccountDetails({provider: provider as SafeEventEmitterProvider, authResponse: {eoa: await safeOwner.getAddress()}})
  navigate(RoutePath.recovery)
  
  };



  const logout = async () => {
    if (!safeAuth) return

    await safeAuth.signOut()

    setProvider(null)
    setSafeAuthSignInResponse(null)
  }

  return (
    <>
      <Modal
        centered
        opened={signingIn}
        onClose={() => !signingIn}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        withCloseButton={false}
        overlayOpacity={0.5}
        size={320}
      >
        <Box radius="md" sx={{ padding: "20px" }} {...props}>
          <Group>
            <Container
              sx={{
                display: "flex",
                alignItem: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <Loader />
            </Container>
            <Text sx={{ textAlign: "center" }}>
              {" "}
              Please sign the message on Wallet if prompted. This may take a
              couple of seconds ...
            </Text>
          </Group>
          
        </Box>
      </Modal>

      <Box
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          padding: "10px",
        })}
      >
        <Paper radius="md" p="xl" sx={{ width: "500px" }} withBorder {...props}>
          <Text size="lg" weight={900} align="center">
            Welcome to Asguard👋
          </Text>

          {errorMessage.length > 0 && (
            <Box mt="md">
              <Text size="md" color="red">
                {errorMessage}
              </Text>
            </Box>
          )}

              
            <Box
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
        })}
      >

            <img src={AsguardHero} alt="empty" />
            </Box>
            <Box mt="md">
              <Text size="sm" align="center">
            Get started just with your social accounts, email or even your existing wallets. It's that simple!
            .
          </Text>
            </Box>


          {/* <Group position="apart" mt="xl">
            <Button
              type="submit"
              fullWidth
              onClick={handleLogin}
              style={{
                background:
                  "linear-gradient(149.86deg, #D844F0 -1.13%, #818CF8 74.76%, #A099FF 143.23%)",
              }}
            >
              Get started
            </Button>
          </Group> */}

          <Group grow mb="md" mt="md">
            <GoogleButton
              loading={signingIn && loginType === "social"}
              radius="md"
              onClick={handleLogin}
            >
              {" "}
              Social{" "}
            </GoogleButton>
            <MetaMaskButton
              loading={signingIn && loginType === "wallet"}
              radius="md"
              onClick={handleWalletLogin}
            >
              {" "}
              MetaMask{" "}
            </MetaMaskButton>
          </Group>

          <Divider label="" labelPosition="center" my="lg" />

          {/* <Text size="sm" align="center">
            By logging in, you are agreeing to the{" "}
            <StyledSpan
              onClick={() =>
                window.open(
                  "https://resources.safient.io/legal/terms",
                  "_blank"
                )
              }
            >
              Terms of Service{" "}
            </StyledSpan>{" "}
            and{" "}
            <StyledSpan
              onClick={() =>
                window.open(
                  "https://resources.safient.io/legal/privacy",
                  "_blank"
                )
              }
            >
              Privacy policy
            </StyledSpan>
            .
          </Text> */}
        </Paper>
      </Box>
    </>
  );
}
