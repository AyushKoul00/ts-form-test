import { z } from "zod";

import { isValidRegex } from "@/lib/utils";

export const BasicInfoSchema = z.object({
  name: z.string().min(3, "Plugin name should be at least 3 characters"),
  description: z.string().min(5, "Description should be at least 5 characters"),
  imageURL: z.url("Please enter a valid Image URL"),
  tag: z.string().min(1, "Tag is required"),
});

// #region Environment Variables
const BaseEnvSchema = z.object({
  name: z.string().min(1, "Environment variable name is required"),
  fieldName: z.string().min(1, "Environment variable field name is required"),
  description: z.string().min(5, "Description should be at least 5 characters"),
  isRequired: z.boolean(), // TODO: giving .default(false) causes type errors
});

const StringEnvSchema = z.discriminatedUnion("displayType", [
  // Text
  z.object({
    type: z.literal("string"),
    displayType: z.literal("text"),
    ...BaseEnvSchema.shape,
    validationRegex: z.string().refine(isValidRegex, "Invalid Regex"),
    isRedacted: z.boolean(),
  }),
  // Dropdown
  z.object({
    type: z.literal("string"),
    displayType: z.literal("dropdown"),
    ...BaseEnvSchema.shape,
    values: z
      .array(z.string())
      .min(1, "At least one dropdown value is required")
      .refine(
        (vals) => new Set(vals).size === vals.length,
        "Dropdown values need to be unique",
      ),
  }),
]);

const ListFieldBaseSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  description: z
    .string()
    .min(5, "Field description should be at least 5 characters"),
  isRequired: z.boolean(),
});

const ListEnvSchema = z.object({
  type: z.literal("list"),
  ...BaseEnvSchema.shape,
  listFields: z
    .array(
      z.discriminatedUnion("displayType", [
        // Text
        z.object({
          displayType: z.literal("text"),
          ...ListFieldBaseSchema.shape,
          validationRegex: z.string().refine(isValidRegex, "Invalid Regex"),
          isRedacted: z.boolean(),
        }),
        // Dropdown
        z.object({
          displayType: z.literal("dropdown"),
          ...ListFieldBaseSchema.shape,
          values: z
            .array(z.string())
            .min(1, "At least one dropdown value is required")
            .refine(
              (vals) => new Set(vals).size === vals.length,
              "Dropdown values need to be unique",
            ),
        }),
      ]),
    )
    .min(1, "At least 1 List field is required"),
});

export const EnvironmentVariablesSchema = z.object({
  envVars: z
    .array(z.discriminatedUnion("type", [StringEnvSchema, ListEnvSchema]))
    .refine((values) => {
      const names = values.map((v) => v.name);
      return new Set(names).size === names.length;
    }, "Environment variable names must be unique"),
});
// #endregion

export const pluginWizardSchema = z.object({
  ...BasicInfoSchema.shape,
  ...EnvironmentVariablesSchema.shape,

  // TODO: Volumes
});

export type PluginWizardForm = z.infer<typeof pluginWizardSchema>;
