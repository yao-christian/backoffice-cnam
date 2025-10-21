import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Stub minimal de `next/server` pour que les libs (ex: next-auth)
// ne fassent pas planter Vitest en environnement Node.
vi.mock("next/server", () => {
  return {
    headers: () => new Headers(),
    cookies: () => ({
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
      getAll: vi.fn(() => []),
    }),
    NextResponse: {
      json: (data: any, init?: any) => ({ data, init }),
      redirect: vi.fn(),
      rewrite: vi.fn(),
    },
  };
});
