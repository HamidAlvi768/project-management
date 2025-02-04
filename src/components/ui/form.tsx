import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Button } from "@/components/ui/button"
import {
  Form as FormRoot,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-2', className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-[0.8rem] text-muted-foreground', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-[0.8rem] font-medium text-destructive', className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export interface FormField {
  name: string
  type: 'text' | 'select' | 'date' | 'number' | 'textarea'
  label: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  validation?: (value: any) => string | undefined
  defaultValue?: any
  description?: string
}

export interface FormProps {
  fields: FormField[]
  onSubmit: (data: any) => void
  initialValues?: Record<string, any>
  allowDynamicRows?: boolean
  buttons?: {
    submit?: string
    cancel?: string
  }
}

export function DynamicForm({
  fields,
  onSubmit,
  initialValues,
  allowDynamicRows,
  buttons = { submit: 'Submit', cancel: 'Cancel' },
}: FormProps) {
  // Create a dynamic schema based on fields
  const schema = z.object(
    fields.reduce((acc, field) => {
      let validator: any
      
      switch (field.type) {
        case 'number':
          validator = z.number()
          break
        case 'date':
          validator = z.date()
          break
        default:
          validator = z.string()
      }

      if (field.required) {
        validator = validator.min(1, { message: `${field.label} is required` })
      } else {
        validator = validator.optional()
      }

      return { ...acc, [field.name]: validator }
    }, {})
  )

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues || {},
  })

  const { fields: dynamicFields, append, remove } = useFieldArray({
    control: form.control,
    name: "dynamicRows",
  })

  const renderField = (field: FormField, index?: number) => {
    const fieldName = index !== undefined ? `dynamicRows.${index}.${field.name}` : field.name

    return (
      <FormField
        key={fieldName}
        control={form.control}
        name={fieldName}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              {field.type === 'select' && field.options ? (
                <Select
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === 'textarea' ? (
                <Textarea
                  {...formField}
                  className="resize-none"
                />
              ) : field.type === 'date' ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formField.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formField.value ? (
                        format(formField.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formField.value}
                      onSelect={formField.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <Input
                  {...formField}
                  type={field.type}
                  onChange={(e) =>
                    field.type === 'number'
                      ? formField.onChange(e.target.valueAsNumber)
                      : formField.onChange(e.target.value)
                  }
                />
              )}
            </FormControl>
            {field.description && (
              <FormDescription>{field.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  return (
    <FormRoot {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {allowDynamicRows ? (
          <>
            {dynamicFields.map((field, index) => (
              <div key={field.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Row {index + 1}</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {fields.map((fieldDef) => renderField(fieldDef, index))}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({})}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Row
            </Button>
          </>
        ) : (
          fields.map((field) => renderField(field))
        )}
        
        <div className="flex justify-end space-x-4">
          {buttons.cancel && (
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              {buttons.cancel}
            </Button>
          )}
          <Button type="submit">{buttons.submit}</Button>
        </div>
      </form>
    </FormRoot>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
