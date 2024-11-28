'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { SubmitHandler } from 'react-hook-form';
import { PiArrowRightBold } from 'react-icons/pi';
import { Checkbox, Password, Button, Input, Text } from 'rizzui';
import { Form } from '@ui/form';
import { routes } from '@/config/routes';
// import { loginSchema, LoginSchema } from '@/validators/login.schema';
import { useTranslation } from '@/app/i18n/client';
import { AdminLoginSchema, getAdminLoginSchema } from '@/validators/adminLogin.schema';

const initialValues: AdminLoginSchema = {
  email: '',
  password: '',
};

export default function SignInForm({lang}:{lang?: string;}) {
  //TODO: why we need to reset it here
  const [reset, setReset] = useState({});
  const { t } = useTranslation(lang!, 'auth');

  const onSubmit: SubmitHandler<AdminLoginSchema> = (data) => {
    console.log(data);
  };

  const validationSchema = getAdminLoginSchema(lang);
  return (
    <>
      <Form<AdminLoginSchema>
        validationSchema={validationSchema}
        resetValues={reset}
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: initialValues,
        }}
      >
        {({ register, formState: { errors } }) => (
          <div className="space-y-5">
            <Input
              type="email"
              size="lg"
              label={t('auth-email')}
              placeholder={t('auth-email-placeholder')}
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('email')}
              error={errors.email?.message}
            />
            <Password
              label={t('auth-password-input')}
              placeholder={t('auth-password-placeholder')}
              size="lg"
              className="[&>label>span]:font-medium"
              inputClassName="text-sm"
              {...register('password')}
              error={errors.password?.message}
            />
            <div className="flex items-center justify-between pb-2">
              <Link
                href={routes.auth.forgotPassword1}
                className="h-auto p-0 text-sm font-semibold text-blue underline transition-colors hover:text-gray-900 hover:no-underline"
              >
                {t('auth-forget-password')}
              </Link>
            </div>
            <Button className="w-full bg-[#e11d48] hover:bg-[#be123c]" type="submit" size="lg">
              <span>{t('auth-login')}</span>{' '}
              <PiArrowRightBold className="ms-2 mt-0.5 h-5 w-5 rtl:rotate-180" />
            </Button>
          </div>
        )}
      </Form>
    </>
  );
}
