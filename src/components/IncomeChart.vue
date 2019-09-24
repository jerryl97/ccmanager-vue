<script>

  import {Doughnut} from 'vue-chartjs'

  export default{
    extends: Doughnut,
    data(){
      return{
        chartdata:{
          labels:[],
          datasets:[{
            backgroundColor:this.getRandomColor(),
            data:[],
          }],
        },
      }
    },
    methods:{
      generateRandomColor(){
        let r = Math.floor(Math.random()*255);
        let g = Math.floor(Math.random()*255);
        let b = Math.floor(Math.random()*255);
        return "rgb(" + r + "," + g + "," + b + ")"; 
      },
      getRandomColor(){
        let randColor = [];
        for(let i in this.incdata.data){
          randColor.push(this.generateRandomColor());
        }
        return randColor;
      }
    },
    computed:{
      getIncCat(){
        return this.$store.state.incCat;
      }
    },
    watch:{
      incdata(){
      this.chartdata.labels = this.incdata.labels;
      this.chartdata.datasets[0].data = this.incdata.data;
      this.renderChart(this.chartdata,this.options);
      }
    },
    mounted(){
      this.chartdata.labels = this.incdata.labels;
      this.chartdata.datasets[0].data = this.incdata.data;
      this.renderChart(this.chartdata,this.options);
    },
    props:['incdata'],
  }
</script>
