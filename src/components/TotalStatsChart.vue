<script>
import {Bar} from 'vue-chartjs'

export default{
  extends: Bar,
  data(){
    return{
      chartdata:{
        labels:[],
        datasets:[{
          label:'',
          backgroundColor:'#f87979',
          data:[],
        }],
      }
    }
  },
  watch:{
    totaldata(){
      this.chartdata.labels = this.totaldata.labels;
      this.chartdata.datasets[0].data = this.totaldata.data;
      this.chartdata.label = this.totaldata.label;
      this.renderChart(this.chartdata,this.options);
    }
  },
  mounted(){
    this.chartdata.labels = this.totaldata.labels;
    this.chartdata.datasets[0].data = this.totaldata.data;
    this.chartdata.datasets[0].label = this.totaldata.label;
    if(this.totaldata.label=='Expense'){
      this.chartdata.datasets[0].backgroundColor = '#f87979';
    }else if(this.totaldata.label=='Income'){
      this.chartdata.datasets[0].backgroundColor = '#00b5e4';
    }
    this.renderChart(this.chartdata,this.options);
  },
  props:['totaldata']
}
</script>
