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
      //Generate Random RGB color
      generateRandomColor(){
        let r = Math.floor(Math.random()*255);
        let g = Math.floor(Math.random()*255);
        let b = Math.floor(Math.random()*255);
        return "rgb(" + r + "," + g + "," + b + ")"; 
      },
      //Get the Random Color
      getRandomColor(){
        let randColor = [];
        for(let i in this.expdata.data){
          randColor.push(this.generateRandomColor());
        }
        return randColor;
      }
    },
    computed:{
      getExpCat(){
        return this.$store.state.expCat;
      }
    },
    watch:{
      expdata(){
      this.chartdata.labels = this.expdata.labels;
      this.chartdata.datasets[0].data = this.expdata.data;
      this.renderChart(this.chartdata,this.options);
      }
    },
    mounted(){
      this.chartdata.labels = this.expdata.labels;
      this.chartdata.datasets[0].data = this.expdata.data;
      this.renderChart(this.chartdata,this.options);
    },
    props:['expdata'],
  }
</script>
