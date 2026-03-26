import { Box, Button, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useShallow } from "zustand/react/shallow";

import { useAppForm } from "@/hooks/form";
import { type FormStepProps } from "..";
import { BasicInfoSchema } from "../schemas";
import { usePluginWizardStore } from "../store";

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

function BasicInfoForm({ onNext, onBack, onCancel }: FormStepProps) {
  const { name, description, imageURL, tag } = usePluginWizardStore(
    useShallow((state) => ({
      name: state.name,
      description: state.description,
      imageURL: state.imageURL,
      tag: state.tag,
    })),
  );
  const setData = usePluginWizardStore((state) => state.setData);

  const form = useAppForm({
    defaultValues: {
      name: name ?? "",
      description: description ?? "",
      imageURL: imageURL ?? "",
      tag: tag ?? "",
    },
    onSubmit: async ({ value }) => {
      setData(value);
      onNext?.();
    },
    validators: {
      onBlur: BasicInfoSchema,
      onSubmit: BasicInfoSchema,
    },
    listeners: {
      onBlur: ({ formApi }) => setData(formApi.state.values),
    },
  });

  return (
    <Box
      component="form"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <Grid container spacing={3}>
        <FormGrid size={{ xs: 12 }}>
          <form.AppField name="name">
            {(field) => (
              <field.FormTextField
                fullWidth
                label="Name"
                placeholder="Enter Plugin Name"
                required
              />
            )}
          </form.AppField>
        </FormGrid>

        <FormGrid size={{ xs: 12 }}>
          <form.AppField name="description">
            {(field) => (
              <field.FormTextField
                fullWidth
                label="Description"
                placeholder="Enter Plugin Description"
                required
              />
            )}
          </form.AppField>
        </FormGrid>

        <FormGrid size={{ xs: 12, md: 6 }}>
          <form.AppField name="tag">
            {(field) => (
              <field.FormTextField
                fullWidth
                label="Tag"
                placeholder="Enter Plugin Tag"
                required
              />
            )}
          </form.AppField>
        </FormGrid>

        <FormGrid size={{ xs: 12, md: 6 }}>
          <form.AppField name="imageURL">
            {(field) => (
              <field.FormTextField
                fullWidth
                label="Image URL"
                placeholder="Enter Plugin Image URL"
                required
              />
            )}
          </form.AppField>
        </FormGrid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "space-between", pt: 4 }}>
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
  );
}

export default BasicInfoForm;
