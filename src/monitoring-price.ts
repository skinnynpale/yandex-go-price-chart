/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import ora from 'ora';
import fs from 'fs';
import simpleGit from 'simple-git';

type ServiceLevelDetails = {
  price: string
}

type ServiceLevel = {
  details: ServiceLevelDetails[]
}

type RouteStatsResponse = {
  service_levels: ServiceLevel[]
}

const spinner = ora();

(async () => {
  spinner.start('караулим яндексGO..')

  let isRunning = false;
  const crawl = async () => {
    if (isRunning) return;
    isRunning = true;

    const timetable = JSON.parse(fs.readFileSync('src/timetable.json').toString());

    const routeStat = await axios.post<RouteStatsResponse>("https://ya-authproxy.taxi.yandex.ru/3.0/routestats", {
      "route": [
        [
          55.794034,
          49.111878
        ],
        [
          55.821857,
          49.113100
        ]
      ]
    }).then((res) => res.data);

    const price = routeStat.service_levels[0].details[0].price;
    timetable.push({
      timestamp: Date.now(),
      price: price
    });
    fs.writeFileSync('src/timetable.json', JSON.stringify(timetable, null, 2));

    spinner.prefixText = price;
    isRunning = false;
  }

  const commit = () => {
    simpleGit().add('./*').commit('UPD: timetable').push();
  }

  setInterval(crawl, 1 * 60 * 1000);
  setInterval(commit, 1 * 60 * 60 * 1000);
})()
