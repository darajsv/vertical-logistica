import { formatDate } from '../../utils/formatDate';
import { ImportDataRequestDTO } from './dtos/request.dto';
import { ImportDataResponseDTO, ProductDTO } from './dtos/response.dto';

interface OrderAccumulator {
  order_id: number;
  total: number;
  date: string;
  products: ProductDTO[];
}

interface UserAccumulator {
  user_id: number;
  name: string;
  orders: { [key: number]: OrderAccumulator };
}

export default (
  file: Express.Multer.File,
  query: ImportDataRequestDTO,
): ImportDataResponseDTO[] => {
  const content = file.buffer.toString('utf-8');
  const lines = content.split('\n');

  const users: { [key: number]: UserAccumulator } = {};

  lines.forEach((line: string) => {
    const user_id = parseInt(line.substring(0, 10).trim());
    const name = line.substring(10, 55).trim();
    const order_id = parseInt(line.substring(55, 65).trim());
    const product_id = parseInt(line.substring(65, 75).trim());
    const value = parseFloat(line.substring(75, 87).trim());
    const date = line.substring(87).trim()
      ? formatDate(line.substring(87).trim())
      : '';

    if (!users[user_id]) {
      users[user_id] = { user_id, name, orders: {} };
    }

    if (!users[user_id].orders[order_id]) {
      users[user_id].orders[order_id] = {
        order_id,
        total: 0,
        date,
        products: [],
      };
    }

    users[user_id].orders[order_id].products.push({ product_id, value });
    users[user_id].orders[order_id].total += value;
  });

  const result: ImportDataResponseDTO[] = Object.values(users)
    .map((user) => ({
      user_id: user.user_id,
      name: user.name,
      orders: Object.values(user.orders).map((order) => ({
        order_id: order.order_id,
        total: parseFloat(order.total.toFixed(2)),
        date: order.date,
        products: order.products,
      })),
    }))
    .filter((user) => user.user_id);

  const { orderId, startDate, endDate } = query;

  let filteredResult = result;
  if (orderId) {
    filteredResult = result
      .map((user) => ({
        ...user,
        orders: user.orders.filter((order) => order.order_id === orderId),
      }))
      .filter((user) => user.orders.length > 0);
  }

  if (startDate || endDate) {
    filteredResult = result
      .map((user) => ({
        ...user,
        orders: user.orders.filter((order) => {
          const orderDate = new Date(order.date);
          const start = startDate
            ? new Date(startDate)
            : new Date('1970-01-01');
          const end = endDate ? new Date(endDate) : new Date();

          return orderDate >= start && orderDate <= end;
        }),
      }))
      .filter((user) => user.orders.length > 0);
  }

  return filteredResult.filter((item) => item.user_id);
};
