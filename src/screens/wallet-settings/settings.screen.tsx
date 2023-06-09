import {
  Accordion,
  Alert,
  Box,
  Button,
  Center,
  Container,
  createStyles,
  Group,
  Loader,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import Safe, { SafeFactory } from "@safe-global/safe-core-sdk";
import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import SafeServiceClient from "@safe-global/safe-service-client";
import { BackButton, EmptyState, Image } from "components";
import { Contract, ethers } from "ethers";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import useRecoveryStore from "store/recovery/recovery.store";
import crypto from 'crypto';


import recoveryModule from "../../artifacts/SocialRecoveryModule.json";
//@ts-ignore
import Asguard from "../../assets/icons/asguard.svg";
import { IconCheck } from "@tabler/icons";
import { NetworkUtil } from "utils/networks";


const oauthGuardian = '0x14E900767Eca41A42424F2E20e52B20c61f9E3eA';
const recoveryAPI =  process.env.REACT_APP_RECOVERY_API;

const useStyles = createStyles((theme) => ({
  settingsContainer: {
    borderRadius: "8px",
    width: "591px",
    margin: "45px auto 0 auto",
    minWidth: "591px",
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
      minWidth: "100%",
    },
  },

  formContainer: {
    marginBottom: "40px",
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      padding: "30px 20px",
    },
  },
}));

export const WalletSettings = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  const { accountDetails, safeId, chainId } = useRecoveryStore(
    (state: any) => state
  );

  const [signalingPeriod, setSignalingPeriod] = useState(30);
  const [walletBeneficiary, setWalletBeneficiary]: any = useState('');
  const [claimType, setClaimType]: any = useState();
  const [creating, setCreating] = useState(false);
  const [executedHash, setExecutedHash] = useState("");

  
  const createRecovery = async () => {

    const recoveryEmailHash = crypto.createHash('sha256').update(walletBeneficiary).digest('hex');

    console.log(chainId)

    try {
    const recoveryResponse = await axios.post(`${recoveryAPI}/recovery`, {
      recoveryEmailHash: recoveryEmailHash,
      safeAddress: safeId,
      chainId: chainId
    })
    
    const recModule = recoveryResponse.data.data.recoveryModuleAddress;
  
    
    setCreating(true);
    const safeOwner = new ethers.providers.Web3Provider(accountDetails.provider as ethers.providers.ExternalProvider).getSigner(0)
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider:safeOwner
    })

    
    const safeService = new SafeServiceClient({ txServiceUrl: NetworkUtil.getNetworkById(chainId)!.safeService, ethAdapter })

    console.log(await safeService.getSafesByOwner(accountDetails.authResponse.eoa))

    

    const safeSdk: Safe = await Safe.create({ ethAdapter, safeAddress: safeId })
    console.log(await safeSdk.getOwners())

    let enableModuleTrans = await safeSdk.createEnableModuleTx(recModule);
    let txResponse = await safeSdk.executeTransaction(enableModuleTrans)
    await txResponse.transactionResponse?.wait()
    console.log(await safeSdk.getModules())

    console.log(recModule)

    const recoveryModuleInstance = new Contract(recModule, recoveryModule.abi, safeOwner)

    console.log(recoveryModuleInstance)

    let addGuardian =  recoveryModuleInstance.interface.encodeFunctionData('addGuardianWithThreshold', [safeSdk.getAddress(), oauthGuardian, 1])
    
    const safeTransactionData: SafeTransactionDataPartial = {
      to: recModule,
      value: "0",
      data: addGuardian 
    }

    const transaction = await safeSdk.createTransaction({safeTransactionData})
    const execResponse = await safeSdk.executeTransaction(transaction)
    
    if(execResponse.hash) {
      setExecutedHash(execResponse.hash);
    }

    console.log(await recoveryModuleInstance.getGuardians(safeSdk.getAddress()))

    setCreating(false);
  }
  catch(e) {
    console.log(e)
    setCreating(false);

  }
  
  }


  return (
    <Paper withBorder className={classes.settingsContainer}>
      <Container className={classes.formContainer} p={40}>
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
              
              <Text mt={"lg"} align='center'> Adding recovery module to your wallet
              <Box sx={{ paddingTop: "20px" }}><Center><Image src={Asguard} width={50}/></Center> </Box>
              </Text>
              
            </Container>
          </Group>
        </Box>
      </Modal>
        <Box mt={20}>
          <>
            <BackButton label="Go Back" onClick={() => navigate(-1)} />

            <Text align="center" weight={600} size="lg">
              Settings
            </Text>
          </>
        </Box>
        <Stack>

          {/* <Select
            label="Select Network"
            placeholder="Select Cliam Type"
            // itemComponent={SelectItem}
            // value={chain}
            data={[
              {
                value: "PolygonMainnet",
                label: "Polygon Mainnet",
              },
            ]}
            // onChange={setChain}
          /> */}

          <Group sx={{ justifyContent: "space-between" }}>
            <Text size="md" weight={600}>
              Recovery settings 🛡️
            </Text>{" "}

          </Group> 

          <Select
                label="Select Recovery Type"
                placeholder="Select Recovery Type"
                // itemComponent={SelectItem}
                // value={chain}
                data={[
                  {
                    value: "0",
                    label: "Email based recovery",
                  },
                  {
                    value: "1",
                    label: "Biometrics (Soon)",
                  },
                  {
                    value: "2",
                    label: "Authenticator",
                  },
                ]}
                onChange={(value) => setClaimType(parseInt(value!))}
              />

        <TextInput
            type="email"
            placeholder="Enter Beneficiary email"
            label="Recovery Email"
            rightSectionWidth={92}
            onChange={(event) => {
              setWalletBeneficiary(event.target.value);
            }}
          />
          

          {/* advanced */}

   
              <Select
                label="Select Recovery Guard"
                placeholder="Select Recovery Type"
                // itemComponent={SelectItem}
                // value={chain}
                data={[
                  {
                    value: "0",
                    label: "Cooling period (You can revoke before the cooling period)",
                  },
                  {
                    value: "1",
                    label: "Arbitration (Arbitrators decide the recovery claim)",
                  },
                  {
                    value: "2",
                    label: "DDAY (Claim on exact date)",
                  },
                ]}
                onChange={(value) => setClaimType(parseInt(value!))}
              />

          <TextInput
            type="text"
            placeholder={signalingPeriod.toString()}
            label="Cooling period (Seconds)"
            rightSectionWidth={92}
            onChange={(event) => {
              setSignalingPeriod(parseInt(event.target.value));
            }}
          />

        <Button
            loading={creating}
            onClick={() => {
              createRecovery();
            }}
            style={{
              background:
                "linear-gradient(149.86deg, #D844F0 -1.13%, #818CF8 74.76%, #A099FF 143.23%)",
            }}
          >
            Confirm
          </Button>

          { executedHash && <Alert icon={<IconCheck size={32} />} title="Recovery created!" color="green" radius="lg">
            Recovery successfully created for the wallet. Verify <a href={`${NetworkUtil.getNetworkById(chainId)?.blockExplorer}/tx/${executedHash}`} target="_blank">here</a>
          </Alert> 
          }

        </Stack>
      </Container>
    </Paper>
  );
};
