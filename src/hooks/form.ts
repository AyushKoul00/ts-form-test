import FormCheckbox from "@/components/form-components/checkbox";
import FormSelect from "@/components/form-components/select";
import FormTextField from "@/components/form-components/text-field";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FormTextField,
    FormCheckbox,
    FormSelect,
  },
  formComponents: {},
});
