import mockUtil from '/@/api/base';
import { Random } from 'mockjs';

const options = {
  name: 'monitor',
  idGenerator: 0,
  list: {},
  copyTimes: 0,
};

const consoleInfo = {
  //访问量
  visits: {
    dayVisits: Random.float(10000, 99999, 2, 2),
    rise: Random.float(10, 99),
    decline: Random.float(10, 99),
    amount: Random.float(99999, 999999, 3, 5),
  },
  //销售额
  saleroom: {
    weekSaleroom: Random.float(10000, 99999, 2, 2),
    amount: Random.float(99999, 999999, 2, 2),
    degree: parseInt(Random.float(10, 99)),
  },
  //订单量
  orderLarge: {
    weekLarge: Random.float(10000, 99999, 2, 2),
    rise: Random.float(10, 99),
    decline: Random.float(10, 99),
    amount: Random.float(99999, 999999, 2, 2),
  },
  //成交额度
  volume: {
    weekLarge: Random.float(10000, 99999, 2, 2),
    rise: Random.float(10, 99),
    decline: Random.float(10, 99),
    amount: Random.float(99999, 999999, 2, 2),
  },
};

options.list = consoleInfo;
const mock = mockUtil.buildMock(options);
export default mock;

// export default [
//   //主控台 卡片数据
//   {
//     url: '/mock/dashboard/console',
//     timeout: parseInt(Random.float(300, 1000)),
//     method: 'get',
//     response: () => {
//       return resultSuccess(consoleInfo);
//     },
//   },
// ];
