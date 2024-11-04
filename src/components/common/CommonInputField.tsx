import {
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form"
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { ReactElement } from "react"

type CommonInputFieldProps<TFormData extends FieldValues> = {
  form: UseFormReturn<TFormData>
  name: Path<TFormData>
  children: (
    field: ControllerRenderProps<TFormData, Path<TFormData>>,
  ) => ReactElement
}

const CommonInputField = <TFormData extends FieldValues>({
  form,
  name,
  children,
}: CommonInputFieldProps<TFormData>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>{children(field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default CommonInputField
