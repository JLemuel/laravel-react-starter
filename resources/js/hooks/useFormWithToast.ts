import { useForm as useInertiaForm } from '@inertiajs/react';
import { toast } from 'react-hot-toast';
import { usePage } from '@inertiajs/react';
import { Page, PageProps as InertiaPageProps } from '@inertiajs/core';

interface CustomPageProps {
  flash?: {
    message?: {
      type: 'success' | 'error';
      text: string;
    } | null;
  };
}

type PageProps = InertiaPageProps & CustomPageProps;

interface FormOptions<TForm> {
  onSuccess?: (data?: any) => void;
  onError?: (errors?: any) => void;
  initialData: TForm;
}

export function useFormWithToast<TForm extends Record<string, any>>(
  { onSuccess, onError, initialData }: FormOptions<TForm>
) {
  const form = useInertiaForm(initialData);
  const { props } = usePage<PageProps>();

  const submit = (
    url: string,
    options: { 
        method: 'post' | 'put' | 'patch' | 'delete';
        onSuccess?: (page: any) => void;
    } = { method: 'post' }
  ) => {
    const { method, onSuccess: optionsOnSuccess } = options;

    form[method](url, {
        onSuccess: (page: Page<PageProps>) => {
            const message = page.props.flash?.message;
            if (message) {
                if (message.type === 'success') {
                    toast.success(message.text);
                } else if (message.type === 'error') {
                    toast.error(message.text);
                }
            }
            onSuccess?.(page);
            optionsOnSuccess?.(page);
        },
        onError: (errors) => {
            if (Object.keys(errors).length > 0) {
                // Show validation errors
                const firstError = Object.values(errors)[0];
                toast.error(Array.isArray(firstError) ? firstError[0] : firstError);
            } else {
                // Show error from controller
                const message = props.flash?.message;
                if (message?.type === 'error') {
                    toast.error(message.text);
                } else {
                    toast.error('An error occurred. Please try again.');
                }
            }
            onError?.(errors);
        },
        preserveScroll: true,
        preserveState: true
    });
  };

  return {
    ...form,
    submit,
  };
}