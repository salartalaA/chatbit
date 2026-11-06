import z from "zod";

export const createRoomSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Please enter room name.")
    .max(20, "Room name must be at most 20 characters."),

  description: z
    .string()
    .trim()
    .max(50, "Description must be at most 50 characters.")
    .optional(),

  category: z.enum([
    "LOFI_AND_CHILL",
    "SYNTHWAVE_AND_RETRO",
    "DEEP_AMBIENT",
    "GAMING_AND_BEATS",
    "STUDY_AND_FOCUS",
    "LATE_NIGHT_TALK",
  ]),

  visibility: z.enum(["PUBLIC", "PRIVATE"]),

  duration: z.enum(["PERMANENT", "TEMPORARY"]),

  durationMinutes: z.enum(["15", "60", "360", "1440"]).optional(),

  tags: z
    .string()
    .trim()
    .max(20, "Room tags must be at most 20 characters.")
    .transform((value) =>
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    ),
});

export type CreateRoomInput = z.input<typeof createRoomSchema>;
export type CreateRoomType = z.output<typeof createRoomSchema>;
