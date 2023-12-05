## vertical_logistica

## Executando o projeto

- `npm install`
- `npm run start:dev`

### Execução de Testes

- `npm run test`

## Informações sobre o endpoint

**URL**: `[POST] /api/v1/import-data`

**Descrição**: Passado um arquivo no formato csv retorna um json dos dados do arquivo

---

## Querys

| Nome        | Valor Padrão | Valores Aceitos           | Descrição      |
| ----------- | ------------ | ------------------------- | -------------- |
| `orderId`   | null         | number                    | id do pedido   |
| `startDate` | null         | string formato yyyy-mm-dd | data de inicio |
| `endDate`   | null         | string formato yyyy-mm-dd | data final     |

---

## Corpo da Requisição form-data

| key    | Value   | Descrição               |
| ------ | ------- | ----------------------- |
| `file` | arquivo | arquivo a ser importado |

---

## Respostas

### Sucesso

**Código**: 200 OK

```json
[
  {
    "user_id": 11,
    "name": "Dorsey Bauch",
    "orders": [
      {
        "order_id": 100,
        "total": 1260.54,
        "date": "2021-10-22",
        "products": [
          {
            "product_id": 3,
            "value": 1260.54
          }
        ]
      }
    ]
  }
]
```

**Código**: 204 NO-CONTENT

```json
[]
```

### Erros

**Código**: 400 Bad Request

```json
{
  "message": "Erro de validação",
  "errors": ["A data final deve estar no formato AAAA-MM-DD"]
}
```

---

## Exemplos de Uso

- Passando startDate e endDate: `http://localhost:3000/api/v1/import-data?startDate=2021-09-28&endDate=2021-10-02`
- Passando orderId: `http://localhost:3000/api/v1/import-data?orderId=500`

Obs:. Passando apenas startDate retorna todos os pedidos a partir da data. Passando apenas endDate retorna todos os pedidos ate a data. Passando as duas querys retorna os pedidos no intervalo das Datas.
