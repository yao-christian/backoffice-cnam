import { z } from "zod";
import { ACTIONS } from "../permissions.const";

export const permissionRegex = new RegExp(
  `^(${ACTIONS.join("|")}):[a-zA-Z0-9_-]+$`,
);

export const CreateRoleSchema = z.object({
  name: z.string().min(1, "Le nom du rôle est requis."),
  description: z.string().optional().default(""),
  // au moins une permission, et chaque entrée doit respecter action:menu
  permissions: z
    .array(z.string().regex(permissionRegex, "Permission invalide"))
    .min(1, "Sélectionnez au moins une permission."),
});

export type CreateRoleInput = z.infer<typeof CreateRoleSchema>;

export const UpdateRoleSchema = z.object({
  uuid: z.string().optional().nullable(),
  name: z.string().min(1, "Le nom du rôle est requis."),
  description: z.string().optional().default(""),
  // bool côté form; on convertira en 0/1 au submit
  status: z.boolean(),
  permissions: z
    .array(z.string().regex(permissionRegex, "Permission invalide"))
    .min(1, "Sélectionnez au moins une permission."),
});

export type UpdateRoleInput = z.infer<typeof UpdateRoleSchema>;
