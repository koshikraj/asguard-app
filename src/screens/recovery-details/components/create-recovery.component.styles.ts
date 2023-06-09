import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  progressbox: {
    width: "515px",
    maxWidth: "100%",

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      width: "100%",
      padding: "0px",
    },
  },
  box: {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    maxWidth: "60%",
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: "column-reverse",
      gap: "20px",
      maxWidth: "100%",
    },
  },
  button: {
    color: "#fff !important",
    background:
      "linear-gradient(149.86deg, #D844F0 -1.13%, #818CF8 74.76%, #A099FF 143.23%)",
    width: "100%",
  },

  h3: {
    fontWeight: 600,
    fontSize: "22px",
    marginBottom: "20px",
    color: "#fff",
  },
  link: {
    color: "#f0d5ee",
  },

  address: {
    fontSize: "18px",
    fontWeight: 500,
    color: "#B3B4B7",
    textOverflow: "ellipsis",
  },

  formContainer: {
    padding: "30px",
    marginTop: "38px",

    borderRadius: "8px",
    flex: "2",
    minWidth: "591px",
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: "100%",
      minWidth: "100%",
    },
  },

  SuccessIcon: {
    width: "60px",
    height: "60px",
  },
  successText: {
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "20px",
    color: "#2C7A7B",
    textAlign: "center",
    marginTop: "30px",
  },
  dataGrid: {
    margin: "0 auto",
    padding: "4rem",
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.08)",
    borderRadius: "5px",
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      padding: "10px",
    },
  },
  ul: {
    listStyle: "none",
    padding: "0",
  },
  listContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
  },
  listHeading: {
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "16px",
    color: "#B3B4B7",
  },
  listValue: {
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "16px",
    color: "#fff",
  },

  voucherImage: {
    // backgroundImage: `url("/images/voucher.svg")`,
    position: "relative",
    width: "100%",
    height: "150px",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    borderRadius: "8px",
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      height: "150px",
    },
  },
  voucherDetailsContainer: {
    marginTop: "45px",
    borderRadius: "8px",
  },

  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: "10px",
    color: "#fff",
    background: "#6663FD",
    borderRadius: "4px",
    fontWeight: 400,
    fontSize: "12px",
    padding: "12px",
  },

  ghostButton: {
    width: "100%",
    color: "#fff",
    background: "rgba(242, 241, 255, 0.06)",
    border: "1px solid rgba(132, 154, 170, 0.52)",
  },
  btnContainer: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  voucherText: {
    fontWeight: "bold",
    color: theme.colorScheme === "dark" ? "#A6A7AB " : "#495057 ",
  },
  voucherTextBlue: {
    color: "transparent",
    textShadow: "0 0 5px rgba(255,255,255,0.9)",
  },
  imageContainer: {
    maxWidth: "250px",
    minHeight: "180px",
    background: "#F2F1FF",
    position: "relative",
    padding: "2px",
    margin: "2px",
    borderTopRightRadius: "4px",
    borderTopLeftRadius: "4px",
  },
}));
