//@ts-nocheck
import {
  createStyles,
  Group,
  Image,
  Select,
  useMantineTheme, ActionIcon, UnstyledButton, useMantineColorScheme, Text, Modal, Container, Box
} from "@mantine/core";
import LogoLight from "../../../assets/logo/logo-light.svg";
import LogoDark from "../../../assets/logo/logo-dark.svg";
import Discord from "../../../assets/icons/discord.svg";
import GitHub from "../../../assets/icons/github.svg";
import { useNavigate } from "react-router-dom";
import { RoutePath } from "navigation/route-path";
import {
  IconSun,
  IconMoonStars,
  IconBrandDiscord,
  IconBrandGithub,
} from "@tabler/icons";

import useRecoveryStore from "store/recovery/recovery.store";
import { useState } from "react";
import { NetworkUtil } from "utils/networks";

const useStyles = createStyles((theme) => ({
  nav: {
    height: "64px",
    display: "flex",
    alignItems: "center",
    background: theme.colorScheme === "dark" ? "1A1B1E" : "white",
    padding: "10px",

    borderBottom:
      theme.colorScheme === "dark" ? "1px solid  #25262B" : "1px solid #ECEEF5",
  },
  wrapper: {
    maxWidth: "1187px",
    margin: "0 auto",
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },
  maincontainer: {
    width: "1187px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
    },
  },
  buttonContainer: {
    width: "30px",
    height: "30px",
    padding: "2px",
    border:
      theme.colorScheme === "dark"
        ? "1px solid 1px solid #25262B "
        : "1px solid #A6A7AB",
    borderRadius: "4px",
  },
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  root: {
    position: "relative",
    "& *": {
      cursor: "pointer",
    },
  },

  icon: {
    pointerEvents: "none",
    position: "absolute",
    zIndex: 1,
    top: 3,
  },

  iconLight: {
    left: 4,
    color: theme.white,
  },

  iconDark: {
    right: 4,
    color: theme.colors.gray[6],
  },
}));

export const Navbar = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const { setCreateStep, setFormData, setChainId, chainId } =
  useRecoveryStore((state: any) => state);
  const theme = useMantineTheme();
  const dark = colorScheme === "dark";

  const { classes } = useStyles();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <nav className={classes.nav}>
      <Modal
        centered
        opened={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        withCloseButton={false}
        overlayOpacity={0.5}
        size={320}
      >
        <Box radius="md" sx={{ padding: "20px" }} >
          <Group>
            <Container
              sx={{
                display: "flex",
                alignItem: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
            </Container>
            <Text sx={{ textAlign: "center" }}>
              {" "}

            </Text>
            <Select
      label="Select the network"
      placeholder="Pick one"
      value={chainId}
      onChange={setChainId} 
      data={[
        { value: 100, label: 'Gnosis Mainnet' },
        { value: 137, label: 'Polygon Mainnet' },
        { value: 84531, label: 'Base Testnet' },
      ]}
    />
          </Group>
          
        </Box>
      </Modal>
      
      
      <div className={classes.wrapper}>
        <div className={classes.maincontainer}>
          <Image
            onClick={() => {
              navigate(RoutePath.recovery);
              setFormData({});
              setCreateStep(1);
            }}
            sx={{ cursor: "pointer" }}
            src={dark ? LogoDark : LogoLight}
            alt="Logo"
            width={"180px"}
          />
          
          <Group className={classes.container}>

          <UnstyledButton onClick={()=> setOpen(true)}>
        <div>
          <Text>{NetworkUtil.getNetworkById(chainId)?.name}</Text>
          <Text size="xs" color="dimmed">{NetworkUtil.getNetworkById(chainId)?.type}</Text>
        </div>
    </UnstyledButton>
          
            <ActionIcon
              className={classes.buttonContainer}
              // variant="filled"
              component="a"
              href="https://discord.safient.io/"
              title="Discord"
              target="_blank"
            >
              {/* <Image src={Discord} height={18} width={18} /> */}
              <>
                <IconBrandDiscord size={18} />
              </>
            </ActionIcon>
            <ActionIcon
              className={classes.buttonContainer}
              // variant="filled"
              component="a"
              href="https://github.com/koshikraj/asguard-app"
              title="github"
              target="_blank"
            >
              <>
                <IconBrandGithub size={18} />
              </>
              {/* <Image src={GitHub} height={18} width={18} /> */}
            </ActionIcon>

            <Group className={classes.container} position="center" my={30}>
              <div className={classes.container}>
                {dark ? (
                  <IconSun
                    size={24}
                    stroke={1.5}
                    onClick={() => toggleColorScheme()}
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <IconMoonStars
                    size={24}
                    stroke={1.5}
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleColorScheme()}
                  />
                )}
              </div>
            </Group>
          </Group>
        </div>
      </div>
    </nav>
  );
};
