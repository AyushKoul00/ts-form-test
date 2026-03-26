import {
  TextField,
  type TextFieldProps,
  type TextFieldVariants,
} from "@mui/material";

import { useFieldContext } from "@/hooks/form";
import { getErrors } from "@/lib/utils";

function FormTextField<Variant extends TextFieldVariants>({
  ...props
}: {
  variant?: Variant;
} & Omit<TextFieldProps, "variant">) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <TextField
      {...props}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      value={field.state.value}
      error={isInvalid}
      helperText={isInvalid ? getErrors(field.state.meta.errors) : undefined}
    />
  );
}

export default FormTextField;
