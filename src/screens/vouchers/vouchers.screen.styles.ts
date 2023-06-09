import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  voucherScreenContainer: {
    margin: "0 !important",
    padding: "10px !important",
  },
  actionsContainer: {
    margin: "30px 0 130px 0",
    display: "flex",
    gap: "24px",
  },

  vouchersContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "24px",
    marginTop: "30px",
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      alignItems: "center",
      justifyContent: "center",
    },
  },
  title: {
    marginTop: "42px",
    marginBottom: "30px",
  },
  test: {
    fontSize: "1rem",
  },
  button: {
    background:
      "linear-gradient(149.86deg, #D844F0 -1.13%, #818CF8 74.76%, #A099FF 143.23%)",
  },
}));
