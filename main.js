let maxOfTheDay = [];
let maxOfHour = [];

function arrayOfMaxPerPeriod(tab, divider, ouputTab) {
  // Je crée un tableau du temps passé depuis le le 1 janvier 1970
  const date = [
    ...new Set(tab.map((t) => Math.trunc(t.date.getTime() / divider))),
  ];
  // Pour chaque date
  date.forEach((hour) => {
    // Je filtre tab de façon a regrouper les enregitrement par correspondance a ce temps passé
    const hourJson = tab.filter(
      (element) => Math.trunc(element.date.getTime() / divider) === hour
    );
    // Je cherche  dans ce tableau la valeur max
    const downloadMax = Math.max.apply(
      null,
      hourJson.map((down) => +down.download)
    );
    // J'en recherche l'index
    const indexMax = hourJson.findIndex((t) => +t.download === downloadMax);
    // me reste plus qu'a remplir le tableau des correspondance a ce temps passé
    ouputTab.push(hourJson[indexMax]);
  });
}
// je rempli maxofhour avec le $json filtrer par heure
arrayOfMaxPerPeriod($json, 3600000, maxOfHour);

// je rempli maxofday avec le $json filtrer par jour
arrayOfMaxPerPeriod($json, 3600000 * 24, maxOfTheDay);

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

//options pour le chart
let options = {
  chart: {
    type: "line",
    height: 600,
    dropShadow: {
      enabled: true,
      color: "#000",
      top: 18,
      left: 7,
      blur: 10,
      opacity: 0.2,
    },
  },

  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  series: [
    {
      name: "download (Mbit/s)",
      data: maxOfTheDay.map((e) => (e = +e.download)),
    },

    {
      name: "upload (Mbit/s)",
      data: maxOfTheDay.map((e) => (e = +e.upload)),
    },
    {
      name: "ping (ms)",
      type: "area",
      data: maxOfTheDay.map((e) => (e = +e.ping)),
    },
  ],
  xaxis: {
    enabled: true,
    labels: {
      show: false,
    },
  },

  yaxis: [
    {
      title: { text: "Download/Upload (Mbis/s)" },
    },
    {
      show: false,
      seriesName: "download (Mbit/s)",
    },
    {
      title: { text: "Ping (ms)" },
      opposite: true,
      max: 200,
    },
  ],

  zoom: {
    type: "x",
    enabled: true,
    autoScaleYaxis: true,
  },
  title: {
    text: "Suivi des débits Internet global",
    align: "left",
    margin: 10,
    offsetX: 0,
    offsetY: 0,
    floating: false,
    style: {
      fontSize: "14px",
      fontWeight: "bold",
      fontFamily: undefined,
      color: "#263238",
    },
  },
};
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

const chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();
updateOptionsAndSeries(maxOfTheDay);

document.querySelectorAll("input[type=radio]").forEach((element) => {
  element.addEventListener("click", function () {
    switch (element.value) {
      case "maxOfTheDay":
        updateOptionsAndSeries(maxOfTheDay);

        break;
      case "maxOfHour":
        updateOptionsAndSeries(maxOfHour);

        break;
      case "last24":
        const last24 = maxOfHour.filter(
          (e) => e.date.getTime() >= new Date().getTime() - 24 * 3600000
        );

        updateOptionsAndSeries(last24);
        break;
    }
  });
});

function updateOptionsAndSeries(tab) {
  chart.updateOptions({
    xaxis: {
      categories: tab.map(
        (e) =>
          (e = new Date(
            Math.trunc(e.date.getTime() / 3600000) * 3600000
          ).toLocaleString())
      ),
    },
    annotations: {
      position: 'front' ,
      yaxis: [
        {
          y:
            tab.map((e) => (e = +e.download)).reduce((a, c) => a + c) /
            tab.length,
            borderColor: '#229af5',  
            strokeDashArray: 30,
            label: {
              text:  "Moyenne : " +Math.round(tab.map((e) => (e = +e.download)).reduce((a, c) => a + c) /
              tab.length)+" Mbit/s",
              textAnchor: 'start',
              position: 'left',
             style: {
              fontSize: '1rem',
                color: '#FFF',
                background: '#229af5',
              },}},
        {
          y:
            tab.map((e) => (e = +e.upload)).reduce((a, c) => a + c) /
            tab.length,
            borderColor: '#21e19b',
            strokeDashArray: 30,
            label: {
              text:  "Moyenne : " +Math.round(tab.map((e) => (e = +e.upload)).reduce((a, c) => a + c) /
              tab.length)+" Mbit/s",
              textAnchor: 'start',
              position: 'left',
             style: {
              fontSize: '1rem',
                color: '#FFF',
                background: '#21e19b',
              },}
        },
      ],
    },
  });
  chart.updateSeries([
    {
      data: tab.map((e) => (e = +e.download)),
    },

    {
      data: tab.map((e) => (e = +e.upload)),
    },
    {
      data: tab.map((e) => (e = +e.ping)),
    },
  ]);
}
