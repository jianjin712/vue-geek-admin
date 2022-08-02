import mockUtil from '/@/api/base';
import Mock, { Random } from 'mockjs';

const options = {
  name: 'user',
  idGenerator: 0,
  list: {},
  copyTimes: 0,
};

// const data = Mock.mock({
//   'list|300': [
//     {
//       id: '@id',
//       createdBy: 0,
//       createdName: null,
//       createdTime: '@datetime',
//       lastModifiedTime: '@datetime',
//       lastModifiedBy: 1,
//       lastModifiedName: '',
//       username: Mock.mock('@cname()'),
//       tenantId: 3,
//       password: '{bcrypt}$2a$10$R2AdNVf402GnqcJejdjY..wOHP5hFt5x0vz5qXdTVG.udcdFmqu.K',
//       nickName: '@name',
//       description: '12323',
//       idCard: '111111111',
//       email: Mock.mock('@email'),
//       mobile: Mock.mock('@id'),
//       avatar: '@image',
//       readonly: false,
//       status: true,
//       nation: 'mz_daiz',
//       education: 'SUOSHI',
//       birthday: '2020-11-05',
//       orgId: 100,
//       stationId: 100,
//       positionStatus: 'QUIT',
//     },
//   ],
// });
//const key = ''; //(pageNo - 1) * pageSize
const result: any = [];
for (let i = 1; i < 123; i++) {
  //const tmpKey = key + i;
  result.push({
    id: Mock.mock('@id'),
    createdBy: 0,
    createdName: null,
    createdTime: Random.datetime(),
    lastModifiedTime: Random.datetime(),
    lastModifiedBy: 1,
    lastModifiedName: '',
    username: Mock.mock('@name'),
    tenantId: 3,
    password: '{bcrypt}$2a$10$R2AdNVf402GnqcJejdjY..wOHP5hFt5x0vz5qXdTVG.udcdFmqu.K',
    nickName: Mock.mock('@cname'),
    description: '12323',
    idCard: '111111111',
    email: Mock.mock('@email'),
    mobile: '1380013' + Mock.mock('@integer(1000, 9999)'),
    avatar: Random.image('80x100'),
    readonly: false,
    sex: Mock.mock('@integer(1, 2)'),
    status: Mock.mock('@boolean()'),
    nation: 'mz_daiz',
    education: 'SUOSHI',
    birthday: Random.date(),
    orgId: 100,
    stationId: 100,
    positionStatus: 'QUIT',
  });
}

//console.log(data.list);
options.list = result;
const mock = mockUtil.buildMock(options);
export default mock;
