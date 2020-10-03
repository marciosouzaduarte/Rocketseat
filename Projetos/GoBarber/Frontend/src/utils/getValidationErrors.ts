import { ValidationError } from 'yup';

interface MyErrors {
  [key: string]: string;
}

export default function getValidationErrors(errs: ValidationError): MyErrors {
  const validationErrors: MyErrors = {};

  errs.inner.forEach(err => {
    validationErrors[err.path] = err.message;
  });

  return validationErrors;
}
