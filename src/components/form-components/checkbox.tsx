import {
  Checkbox,
  FormControlLabel,
  type FormControlLabelProps,
} from "@mui/material";

import { useFieldContext } from "@/hooks/form";

function FormCheckbox({ ...props }: Omit<FormControlLabelProps, "control">) {
  const field = useFieldContext<boolean>();

  return (
    <FormControlLabel
      {...props}
      control={
        <Checkbox
          onChange={(e) => field.handleChange(e.target.checked)}
          onBlur={field.handleBlur}
          checked={field.state.value}
        />
      }
    />
  );
}

export default FormCheckbox;
