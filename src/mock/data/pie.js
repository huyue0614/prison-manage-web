import Mock from 'mockjs';
let resPieData = {};
let labelMap = {
    level: '级别',
    pNumber: '人数'
  };
let pieData = Mock.mock({
  "columns": ['level', 'pNumber'],
  "rows|3-10": [function () {
    return {
      "level": Mock.mock('@cword(3, 5)'),
      'pNumber': Mock.mock('@natural(60, 2000)'),
    }
  }]
})
resPieData = {
    labelMap,
    pieData
}

export default resPieData;
