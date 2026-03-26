export function isValidRegex(value: string) {
  try {
    new RegExp(value);
    return true;
  } catch {
    return false;
  }
}

export function getErrors(errors: unknown): string {
  if (!errors) return "";
  if (typeof errors === "string") return errors;
  if (
    Array.isArray(errors) &&
    errors.length > 0 &&
    typeof errors[0] === "string"
  ) {
    return (errors as string[]).join(", ");
  }
  if (
    Array.isArray(errors) &&
    errors.length > 0 &&
    typeof errors[0] === "object"
  ) {
    const errorSet = new Set<string>();
    for (const error of errors as { message?: string }[]) {
      if (error?.message) {
        errorSet.add(error.message);
      }
    }

    return Array.from(errorSet).join(", ");
  }
  return "";
}
