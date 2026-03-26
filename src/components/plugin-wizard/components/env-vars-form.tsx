import { useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { formOptions } from "@tanstack/react-form";
import { z } from "zod";
import { useShallow } from "zustand/react/shallow";

import { useAppForm, withForm } from "@/hooks/form";
import { getErrors } from "@/lib/utils";
import { type FormStepProps } from "..";
import { BasicInfoSchema, EnvironmentVariablesSchema } from "../schemas";
import { usePluginWizardStore } from "../store";

type EnvVarsForm = z.infer<typeof EnvironmentVariablesSchema>;
type EnvironmentVariable = EnvVarsForm["envVars"][number];

const DEFAULT_TEXT_LIST_FIELD: Extract<
  EnvironmentVariable,
  { type: "list" }
>["listFields"][number] = {
  name: "",
  description: "",
  isRequired: false,
  isRedacted: false,
  displayType: "text",
  validationRegex: "",
};

const DEFAULT_DROPDOWN_LIST_FIELD: Extract<
  EnvironmentVariable,
  { type: "list" }
>["listFields"][number] = {
  name: "",
  description: "",
  isRequired: false,
  displayType: "dropdown",
  values: ["Option 1"],
};

const DEFAULT_STRING_ENV_VAR: EnvironmentVariable = {
  name: "",
  fieldName: "",
  description: "",
  isRequired: false,
  type: "string",
  displayType: "text",
  validationRegex: "",
  isRedacted: false,
};

const DEFAULT_LIST_ENV_VAR: EnvironmentVariable = {
  name: "",
  fieldName: "",
  description: "",
  isRequired: false,
  type: "list",
  listFields: [{ ...DEFAULT_TEXT_LIST_FIELD }],
};

function createEnvVarFormOptions(onNext?: () => void) {
  return formOptions({
    defaultValues: { envVars: usePluginWizardStore.getState().envVars || [] },
    onSubmit: async ({ value }) => {
      console.log("Submitting env vars:", value);
      usePluginWizardStore.getState().setData(value);
      if (onNext) onNext();
    },
    validators: {
      onBlur: EnvironmentVariablesSchema,
      onSubmit: EnvironmentVariablesSchema,
    },
    listeners: {
      onBlur: ({ formApi }) =>
        usePluginWizardStore.getState().setData(formApi.state.values),
    },
  });
}

function EnvironmentVariablesForm({ onNext, onBack, onCancel }: FormStepProps) {
  const basicInfoData = usePluginWizardStore(
    useShallow((state) => ({
      name: state.name,
      description: state.description,
      imageURL: state.imageURL,
      tag: state.tag,
    })),
  );

  useEffect(() => {
    if (!BasicInfoSchema.safeParse(basicInfoData).success) {
      onBack?.();
    }
  }, [basicInfoData, onBack]);

  const form = useAppForm({ ...createEnvVarFormOptions(onNext) });
  // console.log(`disabled ${!onNext} || ${form.state.canSubmit}`);

  return (
    <form.AppForm>
      <Box
        component="form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.AppField name="envVars" mode="array">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Stack spacing={3}>
                {field.state.value.map((_, i) => (
                  <EnvironmentVariableCard key={i} form={form} index={i} />
                ))}
                <Button
                  sx={{ alignSelf: "center" }}
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => field.pushValue({ ...DEFAULT_STRING_ENV_VAR })}
                >
                  Add Environment Variable
                </Button>
                {isInvalid && (
                  <Typography color="error" variant="h6">
                    {getErrors(field.state.meta.errors)}
                  </Typography>
                )}
              </Stack>
            );
          }}
        </form.AppField>
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button variant="outlined" disabled={!onBack} onClick={onBack}>
            Back
          </Button>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              // disabled={!form.state.isTouched || !form.state.canSubmit || !onNext}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </form.AppForm>
  );
}

const EnvironmentVariableCard = withForm({
  ...createEnvVarFormOptions(),
  props: { index: 0 },
  render: function ({ form, index }) {
    return (
      <Card variant="outlined">
        <CardHeader
          title={`Environment Variable ${index + 1}`}
          action={
            <>
              <form.AppField
                name={`envVars[${index}].type`}
                listeners={{
                  onChange: ({ value }) => {
                    if (value === "string") {
                      form.setFieldValue(`envVars[${index}]`, {
                        ...DEFAULT_STRING_ENV_VAR,
                      });
                    } else if (value === "list") {
                      form.setFieldValue(`envVars[${index}]`, {
                        ...DEFAULT_LIST_ENV_VAR,
                      });
                    }
                  },
                }}
              >
                {(field) => {
                  const items = [
                    { label: "String", value: "string" },
                    { label: "List", value: "list" },
                  ];
                  return (
                    <field.FormSelect
                      size="small"
                      label="Type"
                      sx={{ minWidth: 120 }}
                      items={items}
                    />
                  );
                }}
              </form.AppField>
              <IconButton
                color="error"
                onClick={() => form.removeFieldValue("envVars", index)}
              >
                <DeleteIcon />
              </IconButton>
            </>
          }
        />
        <CardContent>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <form.AppField name={`envVars[${index}].name`}>
                {(field) => (
                  <field.FormTextField
                    sx={{ flex: 1 }}
                    placeholder="JF_CMDS"
                    label="Variable Name"
                    required
                  />
                )}
              </form.AppField>
              <form.AppField name={`envVars[${index}].fieldName`}>
                {(field) => (
                  <field.FormTextField
                    sx={{ flex: 1 }}
                    placeholder="JF Commands"
                    label="Field Name"
                    required
                  />
                )}
              </form.AppField>
            </Box>

            <form.AppField name={`envVars[${index}].description`}>
              {(field) => (
                <field.FormTextField
                  fullWidth
                  placeholder="Description..."
                  label="Description"
                  required
                />
              )}
            </form.AppField>

            <form.AppField name={`envVars[${index}].isRequired`}>
              {(field) => <field.FormCheckbox label="Required" />}
            </form.AppField>

            <form.Subscribe
              selector={(state) => state.values.envVars[index].type}
            >
              {(type) => {
                if (type === "string") {
                  return <StringEnvFields form={form} envIndex={index} />;
                } else if (type === "list") {
                  return <ListEnvFields form={form} envIndex={index} />;
                } else {
                  return null;
                }
              }}
            </form.Subscribe>
          </Stack>
        </CardContent>
      </Card>
    );
  },
});

const StringEnvFields = withForm({
  ...createEnvVarFormOptions(),
  props: { envIndex: 0 },
  render: function ({ form, envIndex: index }) {
    return (
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        <form.AppField name={`envVars[${index}].displayType`}>
          {(field) => {
            const items = [
              { label: "Text", value: "text" },
              { label: "Dropdown", value: "dropdown" },
            ];
            return <field.FormSelect label="Display Type" items={items} />;
          }}
        </form.AppField>

        {/* @ts-expect-error TODO: Fix type issue here */}
        <form.Subscribe
          selector={(state) => state.values.envVars[index].displayType}
        >
          {(displayType) => {
            if (displayType === "text") {
              return (
                <>
                  <form.AppField name={`envVars[${index}].validationRegex`}>
                    {(field) => (
                      <field.FormTextField
                        sx={{ flex: 1 }}
                        placeholder="^[a-z]+$"
                        label="Validation Regex"
                      />
                    )}
                  </form.AppField>

                  <form.AppField name={`envVars[${index}].isRedacted`}>
                    {(field) => <field.FormCheckbox label="Redacted" />}
                  </form.AppField>
                </>
              );
            } else if (displayType === "dropdown") {
              return (
                <form.AppField name={`envVars[${index}].values`} mode="array">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    const values = field.state.value || [];
                    field.state.value = values;

                    return (
                      <>
                        <DropdownField addValue={field.pushValue} />
                        {!!values.length &&
                          values.map((val, i) => (
                            <Box
                              key={i}
                              sx={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                                mt: 1,
                              }}
                            >
                              <Typography>{val}</Typography>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => field.removeValue(i)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        {isInvalid && (
                          <Typography color="error" variant="inherit">
                            {getErrors(field.state.meta.errors)}
                          </Typography>
                        )}
                      </>
                    );
                  }}
                </form.AppField>
              );
            } else {
              return null;
            }
          }}
        </form.Subscribe>
      </Box>
    );
  },
});

const ListEnvFields = withForm({
  ...createEnvVarFormOptions(),
  props: { envIndex: 0 },
  render: function ({ form, envIndex: index }) {
    return (
      <form.AppField name={`envVars[${index}].listFields`} mode="array">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Stack spacing={2}>
              {(field.state.value || []).map((_, listFieldIndex) => (
                <ListFieldCard
                  key={listFieldIndex}
                  form={form}
                  envIndex={index}
                  listFieldIndex={listFieldIndex}
                />
              ))}
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => {
                  field.pushValue({
                    ...DEFAULT_TEXT_LIST_FIELD,
                  });
                }}
                sx={{ alignSelf: "flex-start" }}
              >
                Add List Field
              </Button>
              {isInvalid && (
                <Typography color="error" variant="inherit">
                  {getErrors(field.state.meta.errors)}
                </Typography>
              )}
            </Stack>
          );
        }}
      </form.AppField>
    );
  },
});

const ListFieldCard = withForm({
  ...createEnvVarFormOptions(),
  props: { envIndex: 0, listFieldIndex: 0 },
  render: function ({ form, envIndex, listFieldIndex }) {
    return (
      <Card variant="outlined" sx={{ bgcolor: "action.hover" }}>
        <CardContent
          sx={{
            "&:last-child": { pb: 2 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Box
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
              }}
            >
              List Field {listFieldIndex + 1}
            </Box>
            <IconButton
              size="small"
              color="error"
              onClick={() =>
                form.removeFieldValue(
                  `envVars[${envIndex}].listFields`,
                  listFieldIndex,
                )
              }
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>

          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <form.AppField
                name={`envVars[${envIndex}].listFields[${listFieldIndex}].name`}
              >
                {(field) => {
                  return (
                    <field.FormTextField
                      sx={{
                        flex: 1,
                      }}
                      placeholder="Option Name"
                      label="Name"
                      required
                    />
                  );
                }}
              </form.AppField>

              <form.AppField
                name={`envVars[${envIndex}].listFields[${listFieldIndex}].description`}
              >
                {(field) => {
                  return (
                    <field.FormTextField
                      sx={{
                        flex: 1,
                      }}
                      placeholder="Description..."
                      label="Description"
                      required
                    />
                  );
                }}
              </form.AppField>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "flex-start",
              }}
            >
              <form.AppField
                name={`envVars[${envIndex}].listFields[${listFieldIndex}].displayType`}
                listeners={{
                  onChange: ({ value }) => {
                    if (value === "text") {
                      form.setFieldValue(
                        `envVars[${envIndex}].listFields[${listFieldIndex}]`,
                        {
                          ...DEFAULT_TEXT_LIST_FIELD,
                        },
                      );
                    } else if (value === "dropdown") {
                      form.setFieldValue(
                        `envVars[${envIndex}].listFields[${listFieldIndex}]`,
                        {
                          ...DEFAULT_DROPDOWN_LIST_FIELD,
                        },
                      );
                    }
                  },
                }}
              >
                {(field) => {
                  const items = [
                    { label: "Text", value: "text" },
                    { label: "Dropdown", value: "dropdown" },
                  ];
                  return (
                    <field.FormSelect
                      size="medium"
                      label="Display Type"
                      items={items}
                    />
                  );
                }}
              </form.AppField>

              <form.Subscribe
                selector={(state) =>
                  // @ts-expect-error TODO: Fix type issue
                  state.values.envVars[envIndex].listFields[listFieldIndex]
                    .displayType
                }
              >
                {(displayType) => {
                  if (displayType === "text") {
                    return (
                      <form.AppField
                        name={`envVars[${envIndex}].listFields[${listFieldIndex}].validationRegex`}
                      >
                        {(field) => (
                          <field.FormTextField
                            sx={{ flex: 1 }}
                            placeholder="^[a-z]+$"
                            label="Validation Regex"
                          />
                        )}
                      </form.AppField>
                    );
                  } else if (displayType === "dropdown") {
                    return <div>Dropdown Values Here</div>;
                  } else {
                    return null;
                  }
                }}
              </form.Subscribe>

              <form.AppField
                name={`envVars[${envIndex}].listFields[${listFieldIndex}].isRequired`}
              >
                {(field) => <field.FormCheckbox label="Required" />}
              </form.AppField>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  },
});

interface DropdownFieldProps {
  addValue: (value: string) => void;
}

function DropdownField({ addValue }: DropdownFieldProps) {
  const [value, setValue] = useState<string>("");

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <TextField
        label="Add a dropdown value"
        placeholder="Type a value and click Add"
        // fullWidth
        value={value}
        onChange={(e) => setValue(e.target.value.trim())}
      />
      <Button
        variant="outlined"
        size="small"
        onClick={() => {
          addValue(value);
          setValue("");
        }}
      >
        Add
      </Button>
    </Box>
  );
}

export default EnvironmentVariablesForm;
