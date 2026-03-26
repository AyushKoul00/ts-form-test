import {
  FormControl,
  type FormControlProps,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { useFieldContext } from "@/hooks/form";

interface FormSelectProps {
  label: string;
  items: Array<{ label: string; value: string }>;
}

function FormSelect({
  label,
  items,
  ...props
}: FormSelectProps & FormControlProps) {
  const field = useFieldContext<string>();

  return (
    <FormControl {...props}>
      <InputLabel id={`${field.name}-label`}>{label}</InputLabel>
      <Select
        id={field.name}
        labelId={`${field.name}-label`}
        value={field.state.value}
        label={label}
        onChange={(e) => field.handleChange(e.target.value)}
      >
        {items.map(({ label, value }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default FormSelect;
