<template>
  <div id="prewarningstats" class="w1200">
      <el-row style="margin-bottom: 0px; padding-left: 20px;">
        <el-col :span="6">
          <el-tabs v-model="parameter.activeTab" @tab-click="queryStatistics">
            <el-tab-pane label="今天"   name="today"></el-tab-pane>
            <el-tab-pane label="本周"   name="week"></el-tab-pane>
            <el-tab-pane label="本月"   name="month"></el-tab-pane>
            <el-tab-pane label="本季"   name="quarter"></el-tab-pane>
            <el-tab-pane label="本年"   name="year"></el-tab-pane>
            <el-tab-pane label="自定义" name="other"></el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="9" v-if="parameter.activeTab == 'other'" style="line-height: 50px;">
          <span style="font-size: 14px;">时间：</span>
          <el-date-picker style="width: 35%;" size="small" v-model="parameter.startTime" type="date" placeholder="选择日期"></el-date-picker>
          <span>-</span>
          <el-date-picker style="width: 35%;" size="small" v-model="parameter.endTime" type="date" placeholder="选择日期"></el-date-picker>
          <el-button size="mini" type="primary" class="search-btn" @click="doQuery()">查询</el-button>
        </el-col>
      </el-row>
      <el-rolw>
        <el-col :span="12">
          <el-card class="box-card pws-card">
            <div slot="header" class="clearfix">
              <span>违规预警人员TOP10</span>
            </div>
            <div class="pws-card-first">
              <el-row>
                <el-col :span="12">
                  <ul class="pws-card-first-left">
                    <li v-for="(item, index) in list" :key="item" v-if="index < 5">
                      <span class="pws-card-first-label">NO.{{ index + 1 }}</span>
                      <span class="pws-card-first-name">{{ item.name }}</span>
                      <span class="pws-card-first-times">违规{{ item.times }}次</span>
                    </li>
                  </ul>
                </el-col>
                <el-col :span="12">
                  <ul class="pws-card-first-right">
                    <li v-for="(item, index) in list" :key="item" v-if="index > 4">
                      <span class="pws-card-first-label">NO.{{ index + 1 }}</span>
                      <span class="pws-card-first-name">{{ item.name }}</span>
                      <span class="pws-card-first-times">违规{{ item.times }}次</span>
                    </li>
                  </ul>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card pws-card">
            <div slot="header" class="clearfix">
              <span>违规预警事件统计</span>
            </div>
            <div>
              <el-table :data="tableData" stripe style="width: 100%" height="240">
                <el-table-column prop="warningEvent" label="违规预警事件"></el-table-column>
                <el-table-column label="预警次数"     width="150" align="center">
                  <template slot-scope="scope">
                    <span @click="showVideo(scope.$index, scope.row)" class="num-color" style="cursor: pointer;">{{ scope.row.warningTimes }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="预警人数"     width="150" align="center">
                  <template slot-scope="scope">
                    <span @click="showVideo(scope.$index, scope.row)" class="num-color" style="cursor: pointer;">{{ scope.row.warningCount }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-rolw>
      <el-rolw>
        <el-col :span="12">
          <el-card class="box-card pws-card">
            <div slot="header" class="clearfix">
              <span>监区排名（按预警数）</span>
            </div>
            <div>
              <template>
                <ve-bar height="270px" :legend-visible="false" :extend="option1" :xAxis="option1.xAxis"></ve-bar>
              </template>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="box-card pws-card">
            <div slot="header" class="clearfix">
              <span>预警区域排名TOP5（按预警数）</span>
              <el-select size="mini" style="float: right; padding: 3px 0" v-model="parameter.area" placeholder="请选择" @change="queryAreaOrder()">
                <el-option v-for="item in areas" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div>
              <ve-bar height="270px" :legend-visible="false" :extend="option2" :xAxis="option2.xAxis"></ve-bar>
            </div>
          </el-card>
        </el-col>
      </el-rolw>
  </div>
</template>

<script>
  export default {
    name: 'prewarningstats',
    data() {
      return {
        message: '预警统计',
        parameter: {
          activeTab: 'today',
          startTime: '',
          endTime: '',
          area: '1'
        },
        tableData: [],
        list: [],
        areas: [],
        option1: {
          grid: {
            top:'2%', right:'5%', bottom:'5%', left:'2%'
          },
          tooltip : {
              trigger: 'axis',
              axisPointer : {
                  type : 'shadow'
              }
          },
          xAxis: [{
            show: false,
            splitLine: {
          　  show:false
          　}
          }],
          yAxis: {
            data: []
          },
          series: [{
            name: '预警次数',
            type: 'bar',
            barWidth: '60%',
            data: [],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'right',
                  textStyle: {
                    color: 'black'
                  }
                },
                color: function (params) {
                  var colorList = ['#ff4c79','#00ce94','#2cc2e9', '#ff983b', '#7870fb'];
                  return colorList[params.dataIndex];
                }
              },
            },
          }],
          settings: {
            dataOrder: {
              label: '预警次数',
              order: 'desc'
            }
          }
        },
        option2: {
          grid: {
            top:'2%', right:'5%', bottom:'5%', left:'2%'
          },
          tooltip : {
              trigger: 'axis',
              axisPointer : {
                  type : 'shadow'
              }
          },
          xAxis: [{
            show: false,
            splitLine: {
          　  show:false
          　}
          }],
          yAxis: {
            data: []
          },
          series: [{
            name: '预警次数',
            type: 'bar',
            barWidth: '60%',
            data: [],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'right',
                  textStyle: {
                    color: 'black'
                  }
                },
                color: function (params) {
                  var colorList = ['#ff4c79','#00ce94','#2cc2e9', '#ff983b', '#7870fb'];
                  return colorList[params.dataIndex];
                }
              },
            },
          }],
          settings: {
            dataOrder: {
              label: '预警次数',
              order: 'desc'
            }
          }
        }
      }
    },
    methods: {
      doQuery: function() {
        var _this = this;
        this.$ajxj.get('/getPrewarningstatsDatas').then(function (respnose) {
          _this.list = respnose.data.list;
          _this.tableData = respnose.data.tableData;
          _this.option1.series[0].data = respnose.data.option1.xAxisData;
          _this.option1.yAxis.data = respnose.data.option1.yAxisData;
          _this.option2.series[0].data = respnose.data.option2.xAxisData;
          _this.option2.yAxis.data = respnose.data.option2.yAxisData;
        }).catch(function (error) {
        }).then(function () {
        });
      },
      queryStatistics: function() {
        if (this.parameter.activeTab != 'other') {
          this.doQuery();
        }
      },
      queryAreaOrder: function() {
        alert("查询预警区域排名");
      },
      showVideo: function (index, row) {
        this.$router.push({
          path: "/personnelposition"
        });
      },
    },
    mounted() {
      // 获取区间字典
      var _this = this;
      this.$ajxj.get('/getPrisonDatas').then(function (respnose) {
          _this.areas = respnose.data;
      }).catch(function (error) {
      }).then(function () {
      });

      // 获取预警统计数据
      this.queryStatistics();
    }
  }
</script>

<style scoped>
  .pws-card {
    height: 350px;
    margin: 5px 5px;
  }

  .pws-card span {
    line-height: 34px;
    display: inline-block;
    vertical-align: middle;
  }

  .pws-card-first {
    font-size: 14px;  
  }

  .pws-card-first li {
    margin: 10px 0px;
  }

  .pws-card-first-left {
    border-right: 1px solid #ebeef5; 
    margin-right: 10px; 
    padding: 0px 20px;
  }

  .pws-card-first-right {
    padding: 0px 10px;
  }

  .pws-card-first-label {
    width: 30%;
  }

  .pws-card-first-name {
    width: 30%;
  }

  .pws-card-first-times {
    width: 33%;
    text-align: center;

    color: #FF5809;
    border-radius: 5px;
    border: 1px solid #FF5809; 
  }
</style>

<style>
  #prewarningstats .el-card__header {
    padding: 10px 20px;
  }

  #prewarningstats .el-progress {
    line-height: 3;
  }

  #prewarningstats .pws-card-first-times {
    line-height: 25px;
  }
</style>