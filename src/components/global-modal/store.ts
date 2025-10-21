import { createSelectors } from "@/components/utils/zustand";
import { create } from "zustand";

type ModalState = {
  isOpen: boolean;
  title: string;
  content: React.ReactNode;
  isLoading: boolean;
  isConfirmActionAsync: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  closeText: string;
  CloseButton: React.ReactNode;
  ConfirmButton: React.ReactNode;
  ActionButtons: React.ReactNode;
  handleCloseModal?: () => void;
};

type ConfirmAction =
  | ((payload?: any) => Promise<any>)
  | ((payload?: any) => any)
  | null;

type ShowModalPayload = {
  title: string;
  content: React.ReactNode;
  isConfirmActionAsync?: boolean;
  confirmAction?: ConfirmAction;
  closeText?: string;
  CloseButton?: React.ReactNode;
  handleCloseModal?: () => void;
};

type ModalAction = {
  confirmAction: ConfirmAction;
  setConfirmAction: (
    action: ConfirmAction,
    isConfirmActionAsync?: boolean,
  ) => void;
  showModal: (payload: ShowModalPayload) => void;
  closeModal: () => void;
  startLoading: () => void;
  stopLoading: () => void;
  setSuccessMessage: (msg: string) => void;
  setCloseText: (closeText: string) => void;
  setErrorMessage: (msg: string) => void;
  onSuccess: (params: { successMessage?: string }) => void;
  onError: (params: { errorMessage?: string; canResubmit?: boolean }) => void;
  submit: (payload?: any) => Promise<void>;
  setCloseButton: (CloseButton: React.ReactNode) => void;
  setHandleCloseModal: (handleCloseModal: (() => void) | undefined) => void;
  setTitle: (title: string) => void;
};

export type ModalStore = ModalState & ModalAction;

const initialState = {
  isOpen: false,
  title: "",
  content: null,
  isLoading: false,
  confirmAction: null,
  errorMessage: null,
  successMessage: null,
  isConfirmActionAsync: false,
  closeText: "Fermer",
  ActionButtons: null,
  CloseButton: null,
  ConfirmButton: null,
};

export const useModalStore = createSelectors(
  create<ModalStore>((set, get) => ({
    ...initialState,
    showModal: (data: ShowModalPayload) => {
      set({
        isOpen: true,
        title: data.title,
        content: data.content,
        confirmAction: data.confirmAction || null,
        isConfirmActionAsync: data.isConfirmActionAsync ?? false,
        closeText: data.closeText ?? "Fermer",
        CloseButton: data.CloseButton,
        handleCloseModal: data.handleCloseModal,
        isLoading: false,
        errorMessage: null,
        successMessage: null,
      });
    },
    submit: async (data?: any) => {
      const { confirmAction, isConfirmActionAsync } = get();

      if (confirmAction) {
        if (isConfirmActionAsync) {
          set({ isLoading: true });

          try {
            const response = await confirmAction(data);

            const responseMsg =
              typeof response === "string" ? response : "Opération réussie";

            set({
              isLoading: false,
              successMessage: responseMsg,
              errorMessage: null,
              confirmAction: null,
            });
          } catch (error) {
            let errorMessage = "Une erreur est survenue";

            if (error instanceof Error) errorMessage = error.message;

            set({
              isLoading: false,
              errorMessage,
              successMessage: null,
            });
          }
        } else {
          confirmAction(data);
        }
      }
    },

    setConfirmAction: (confirmAction, isConfirmActionAsync) =>
      set({
        confirmAction,
        isConfirmActionAsync: isConfirmActionAsync ?? false,
      }),

    closeModal: () => set({ ...initialState }),
    startLoading: () => set({ isLoading: true }),
    stopLoading: () => set({ isLoading: false }),

    setSuccessMessage: (msg) => {
      set({
        successMessage: msg,
        errorMessage: null,
      });
    },
    setErrorMessage: (msg) => {
      set({
        errorMessage: msg,
        successMessage: null,
      });
    },
    setCloseText: (closeText) => {
      set({ closeText });
    },
    onSuccess: (payload) => {
      set({
        isLoading: false,
        successMessage: payload.successMessage ?? "Opération réussie",
        errorMessage: null,
        confirmAction: null,
      });
    },
    onError: (payload) => {
      const state = get();

      set({
        isLoading: false,
        errorMessage: payload.errorMessage ?? "Opération échouée",
        confirmAction: payload.canResubmit ? state.confirmAction : null,
        successMessage: null,
      });
    },
    setCloseButton: (CloseButton) => {
      set({ CloseButton });
    },
    setHandleCloseModal: (handleCloseModal) => {
      set({ handleCloseModal });
    },
    setTitle: (title) => set({ title }),
  })),
);
