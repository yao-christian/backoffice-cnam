import { createSelectors } from "@/components/utils/zustand";
import { create } from "zustand";

type AlertDialogState = {
  isOpen: boolean;
  title: string;
  content: string;
  isInput: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
};

type ConfirmAction =
  | ((input?: string) => Promise<any>)
  | ((input?: string) => any)
  | null;

type ConfirmClosing = (() => void) | null;

type ShowAlertPayload = {
  title: string;
  content: string;
  isInput?: boolean;
  confirmAction?: ConfirmAction;
  confirmClosing?: ConfirmClosing;
};

type AlertDialogAction = {
  confirmAction: ConfirmAction;
  confirmClosing: ConfirmClosing;
  showAlert: (payload: ShowAlertPayload) => void;
  closeAlert: () => void;
  startLoading: () => void;
  stopLoading: () => void;
  setSuccessMessage: (msg: string) => void;
  setErrorMessage: (msg: string) => void;
  onSuccess: (params: { successMessage?: string }) => void;
  onError: (params: { errorMessage?: string; canResubmit?: boolean }) => void;
  submit: (input?: string) => Promise<void>;
};

export type AlertDialogStore = AlertDialogState & AlertDialogAction;

const initialState = {
  isOpen: false,
  title: "",
  content: "",
  isLoading: false,
  confirmAction: null,
  confirmClosing: null,
  isInput: false,
  errorMessage: null,
  successMessage: null,
};

export const useAlertDialogStore = createSelectors(
  create<AlertDialogStore>((set, get) => ({
    ...initialState,
    showAlert: (data: ShowAlertPayload) => {
      set({
        isOpen: true,
        title: data.title,
        content: data.content,
        isInput: data.isInput ?? false,
        confirmAction: data.confirmAction || null,
        confirmClosing: data.confirmClosing || null,
        isLoading: false,
        errorMessage: null,
        successMessage: null,
      });
    },
    submit: async (input?: string) => {
      const { confirmAction } = get();

      if (confirmAction) {
        const isAsync = confirmAction.constructor.name === "AsyncFunction";

        if (isAsync) {
          set({ isLoading: true });

          try {
            const response = await confirmAction(input);

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
          confirmAction(input);
        }
      }
    },
    closeAlert: () => {
      const { confirmClosing } = get();

      if (confirmClosing) {
        confirmClosing();
      }

      set({ ...initialState });
    },
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
  })),
);
