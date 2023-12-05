import { Request, Response } from 'express';
import importDataService from './importData.service';
import HttpStatus from 'http-status-codes';
import { importDataRequestValidator } from './dtos/request.dto';
import { ValidationError } from 'yup';

export default async (req: Request, res: Response): Promise<Response> => {
  try {
    const validatedQuery = await importDataRequestValidator.validate(
      req.query,
      { abortEarly: false },
    );

    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
    }

    const response = importDataService(req.file, {
      orderId: validatedQuery.orderId,
      startDate: validatedQuery.startDate,
      endDate: validatedQuery.endDate,
    });

    if (response.length === 0) {
      res.setHeader('Content-Length', 0);
      return res.status(HttpStatus.NO_CONTENT).end();
    }

    return res.status(HttpStatus.OK).json(response);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Erro de validação', errors: error.errors });
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Ocorreu um erro ao processar o arquivo',
      error: error.message,
    });
  }
};
