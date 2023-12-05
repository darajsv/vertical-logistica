import * as yup from 'yup';

const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

export const importDataRequestValidator = yup.object().shape({
  orderId: yup.number().integer(),
  startDate: yup
    .string()
    .matches(
      dateFormatRegex,
      'A data de início deve estar no formato AAAA-MM-DD',
    ),
  endDate: yup
    .string()
    .matches(dateFormatRegex, 'A data final deve estar no formato AAAA-MM-DD'),
});

export interface ImportDataRequestDTO {
  orderId?: number;
  startDate?: string;
  endDate?: string;
}
