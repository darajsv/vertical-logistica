import HttpStatus from 'http-status-codes';
import request from 'supertest';
import { expect } from 'chai';
import app from '../../config/app';
import path from 'path';

describe('[e2e] import-data endpoint', () => {
  const filePath = path.join(__dirname, '../mock/dataMock.txt');

  const responseBody = [
    {
      user_id: 49,
      name: 'Ken Wintheiser',
      orders: [
        {
          order_id: 523,
          total: 586.74,
          date: '2021-09-03',
          products: [{ product_id: 3, value: 586.74 }],
        },
      ],
    },
    {
      user_id: 70,
      name: 'Palmer Prosacco',
      orders: [
        {
          order_id: 753,
          total: 1836.74,
          date: '2021-03-08',
          products: [{ product_id: 3, value: 1836.74 }],
        },
      ],
    },
    {
      user_id: 75,
      name: 'Bobbie Batz',
      orders: [
        {
          order_id: 798,
          total: 1578.57,
          date: '2021-11-16',
          products: [{ product_id: 2, value: 1578.57 }],
        },
      ],
    },
  ];
  it('should process the file and return the formated data', async () => {
    const response = await request(app)
      .post('/api/v1/import-data')
      .attach('file', filePath)
      .expect(HttpStatus.OK);

    expect(response.body).to.be.eql(responseBody);
  });

  it('should process the file and return the formated data filtered by orderId', async () => {
    const response = await request(app)
      .post('/api/v1/import-data?orderId=798')
      .attach('file', filePath)
      .expect(HttpStatus.OK);

    expect(response.body).to.be.eql([{ ...responseBody[2] }]);
  });

  it('should process the file and return the formated data filtered by startDate', async () => {
    const response = await request(app)
      .post('/api/v1/import-data?startDate=2021-09-03')
      .attach('file', filePath)
      .expect(HttpStatus.OK);

    expect(response.body).to.be.eql([
      { ...responseBody[0] },
      { ...responseBody[2] },
    ]);
  });

  it('should process the file and return the formated data filtered by endDate', async () => {
    const response = await request(app)
      .post('/api/v1/import-data?endDate=2021-09-03')
      .attach('file', filePath)
      .expect(HttpStatus.OK);

    expect(response.body).to.be.eql([
      { ...responseBody[0] },
      { ...responseBody[1] },
    ]);
  });

  it('should process the file and return the formated data filtered by startDate and endDate', async () => {
    const response = await request(app)
      .post('/api/v1/import-data?startDate=2021-09-03&endDate=2021-09-03')
      .attach('file', filePath)
      .expect(HttpStatus.OK);

    expect(response.body).to.be.eql([{ ...responseBody[0] }]);
  });

  it('should process the file and return NO-CONTENT when no match is found for query', async () => {
    const response = await request(app)
      .post('/api/v1/import-data?orderId=1')
      .attach('file', filePath)
      .expect(HttpStatus.NO_CONTENT);

    expect(response.body).to.be.eql({});
  });

  it('should throw bad request when file is not attached', async () => {
    const response = await request(app)
      .post('/api/v1/import-data')
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).to.be.eql({ message: 'Nenhum arquivo foi enviado.' });
  });

  it('should throw bad request with validation errors', async () => {
    const response = await request(app)
      .post('/api/v1/import-data?orderId=a&startDate=123&endDate=01-01-2023')
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).to.be.eql({
      message: 'Erro de validação',
      errors: [
        'orderId must be a `number` type, but the final value was: `NaN` (cast from the value `"a"`).',
        'A data de início deve estar no formato AAAA-MM-DD',
        'A data final deve estar no formato AAAA-MM-DD',
      ],
    });
  });
});
