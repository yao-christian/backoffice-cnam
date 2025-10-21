export type ApiResponse<T> = {
  status: "success" | "error" | "fail";
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};
