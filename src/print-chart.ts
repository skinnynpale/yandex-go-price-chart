import { exec } from 'child_process';
/* eslint-disable @typescript-eslint/ban-ts-comment */
import fs from 'fs';
// @ts-ignore
import path from 'path';


(async () => {
  const timetable = fs.readFileSync('src/timetable.json').toString()

  const HTML = `
  <html>
  <body>
  <div>
  <canvas id="myChart"></canvas>
</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
  const timetable = ${timetable};

  const labels = timetable.map((i) => new Date(i.timestamp).toLocaleTimeString());

  const data = {
    labels: labels,
    datasets: [{
      label: 'My First dataset',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: timetable.map((i) => parseInt(i.price))
    }]
  };

  const config = {
    type: 'line',
    data: data,
    options: {}
  };
</script>

<script>
  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
</script>
  </body>
</html>

`;

  fs.writeFileSync('src/index.html', HTML);
  exec('open ' + 'file:///' + path.resolve('src/index.html'))
})()
