import create from "zustand";

const useRecoveryStore = create((set) => ({
  createStep: 1,
  fetching: false,
  roleName: "",
  accountDetails: {},
  safeId: '',
  chainId: 84531,

  setRoleName: (name: string) => {
    set((state: any) => ({
      ...state,
      roleName: name,
    }));
  },

  setSafeId: (id: string) => {
    set((state: any) => ({
      ...state,
      safeId: id,
    }));
  },

  setFetching: (status: boolean) => {
    set((state: any) => ({
      ...state,
      fetching: status,
    }));
  },
  setCreateStep: (step: any) =>
    set((state: any) => ({
      createStep: step,
    })),
  formData: {},
  setFormData: (data: object) =>
    set((state: any) => ({
      formData: data,
    })),

  setChainId: (id: number) =>
    set((state: any) => ({
      ...state,
      chainId: id,
    })),

  

  setAccountDetails: (data: object) =>
    set((state: any) => ({
      accountDetails: data,
    })),

  recoveryDetails: {},

  setRecoveryDetails: (data: object) =>
    set((state: any) => ({
      recoveryDetails: data,
    })),


}));
export default useRecoveryStore;
