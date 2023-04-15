import { forwardRef, useContext, useEffect, useState } from "react";
import {
  Container,
  Group,
  Stack,
  Select,
  Button,
  Text,
  Textarea,
  TextInput,
  Paper,
  Avatar,
  Alert,
  Switch,
  Box,
  Modal,
  Loader,
  Center,
} from "@mantine/core";
import { IconAlertCircle, IconCheck, IconCopy, IconPlugConnected } from "@tabler/icons";
import useRecoveryStore from "store/recovery/recovery.store";
import { useStyles } from "./create-recovery.component.styles";
import { BackButton, ProgressStatus, Title, Image } from "../../../components";
import recoveryModule from "../../../artifacts/SocialRecoveryModule.json";
import { useNavigate } from "react-router-dom";
import crypto from "crypto";

//@ts-ignore
import Flask from "../../../assets/icons/flask.svg";
//@ts-ignore
import Asguard from "../../../assets/icons/asguard.svg";
import { ethers } from "ethers";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import { SafeEventEmitterProvider, CHAIN_NAMESPACES } from '@web3auth/base'
import { Web3Auth } from "@web3auth/modal";
import { SafeAccountConfig, SafeFactory } from "@safe-global/safe-core-sdk";
import SafeServiceClient from "@safe-global/safe-service-client";
import { Contract } from "ethers";
import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
import { RoutePath } from "navigation";
import { SafeAuthKit, SafeAuthProviderType } from "@safe-global/auth-kit";
import axios from "axios";



const progressMessage = [{text: "Recovering the wallet", image: Asguard}, {text: "Recovering the wallet", image: Asguard}]


const RPC_URL='https://restless-young-layer.base-goerli.discover.quiknode.pro/3860a9e7a99900628604b143682330d4cec99db0'
const txServiceUrl = 'https://safe-transaction-base-testnet.safe.global/'

export const UserAuth = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();


  const [walletName, setWalletName] = useState("");
  const [walletDescription, setWalletDescription] = useState("");

  const [recoveryEmailHash, setRecoveryEmailHash] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [idToken, setIdToken] = useState("");

  const [progressStage, setProgressStage] = useState(0);

  const [authenticated, setAuthenticated] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [creating, setCreating] = useState(false);

  const [safeAuth, setSafeAuth] = useState<SafeAuthKit>()
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null)

  const { setCreateStep, setFormData, accountDetails, setSafeId } = useRecoveryStore(
    (state: any) => state
  );


  const txServiceUrl = 'https://safe-transaction-base-testnet.safe.global/'
  const recoveryAPI = process.env.REACT_APP_RECOVERY_API;
  
  
  const authenticateUser = async () => {
    
    setCreating(true);
    const web3auth = new Web3Auth({
      clientId: process.env.REACT_APP_W3AUTH_CLIENTID!,
      web3AuthNetwork: 'testnet',
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x14A33",
        rpcTarget: RPC_URL,
      },
      uiConfig: {
        theme: 'dark',
        loginMethodsOrder: ['google', 'facebook']
      }
    });

    await web3auth.initModal()

    await web3auth.connect()

    const safeBeneficiary = new ethers.providers.Web3Provider(web3auth.provider as ethers.providers.ExternalProvider).getSigner(0)

    const userInfo = await web3auth.getUserInfo()

    setRecoveryEmailHash(crypto.createHash('sha256').update(userInfo.email!).digest('hex'));
    setIdToken(userInfo.idToken!)
    setNewOwner(await safeBeneficiary.getAddress())

    setAuthenticated(true);
    setCreating(false);

  }


  const recoverWallet = async () => {

    setCreating(true);

    try {
      const recoveryResponse = await axios.post(`${recoveryAPI}/recover`, {
        recoveryEmailHash: recoveryEmailHash,
        newOwner: newOwner,
        idToken: idToken,
      })
      console.log(recoveryResponse)
      setSafeId(recoveryResponse.data.data.safeAddress)
      navigate(RoutePath.wallet)
      setCreating(false);

    }
  catch(e) {
    setCreating(false);
    console.log(e);
  }
}


  const backButtonHandler = () => {
    setCreateStep(1);
  };

  return (
    <Container className={classes.box}>
            <Modal
        centered
        opened={creating}
        onClose={() => !creating}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        withCloseButton={false}
        overlayOpacity={0.5}
        size={320}
      >
        <Box sx={{ padding: "20px" }}>
          <Group>
            <Container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <Loader />
              
              <Text mt={"lg"} align='center'>{progressMessage[progressStage].text}
              <Box sx={{ paddingTop: "20px" }}><Center><Image src={progressMessage[progressStage].image} width={50}/></Center> </Box>
              </Text>
              
            </Container>
          </Group>
        </Box>
      </Modal>
      <Paper className={classes.formContainer} withBorder>
        <BackButton label="Back to Previous" onClick={backButtonHandler} />
        <Group mb={30}>
          <Title>Recover a Wallet</Title>
        </Group>
        <Stack justify="flex-start">



         
        { !authenticated && <Alert icon={<IconPlugConnected size={32} />} title="Verify your email!" color="grape" radius="lg">
            Authenticate with you social accounts to verify your email.
        </Alert>
       }

        { authenticated && <Alert icon={<IconCheck size={32} />} title="Email verified!" color="green" radius="lg">
            Your email is successfully verified proceed to recover the wallet.
          </Alert> 
          }
         
          <Button
            loading={creating}
            className={classes.button}
            onClick={() => {
              authenticated ? recoverWallet() : authenticateUser(); 
              
            }}
            style={{
              background:
                "linear-gradient(149.86deg, #D844F0 -1.13%, #818CF8 74.76%, #A099FF 143.23%)",
            }}
          >
             { authenticated ? "Recover" : "Authenticate" }
          </Button>
        </Stack>
      </Paper>

      <Container className={classes.progressbox}>
        <ProgressStatus
          title="Recovering a wallet"
          description="Authenticate with your social accounts to verify your email and recover the wallet. 🛡️"
          // update the status according to the progress
          status={creating ? 100 : 50}
        />
      </Container>
    </Container>
  );
};
