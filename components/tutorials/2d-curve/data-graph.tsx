import { useEffect, useState } from "react";

import { Scatter } from "react-chartjs-2";

import { CarType } from "../../../pages/tutorials/2d-curve";
import { ScatterDataType, ScatterType } from "../commons/chart-types";

type PropsType = {
  data: Array<CarType>;
};

const DataGraph = ({ data }: PropsType) => {
  const [chartData, setChartData] = useState<ScatterType["data"]>();
  const [chartOpt, setChartOpt] = useState<ScatterType["options"]>();

  useEffect(() => {
    if (data) {
      const cleaned = data
        .map((car: CarType) => ({
          x: car.Miles_per_Gallon,
          y: car.Horsepower,
        }))
        .filter((car: ScatterDataType) => car.x != null && car.y != null);

      const chOpt: ScatterType["options"] = {
        responsive: true,
        scales: {
          x: {
            title: {
              text: "Horsepower",
              display: true,
            },
            min: Math.min(...cleaned.map((x) => x.x)) - 5,
            max: Math.max(...cleaned.map((x) => x.x)) + 5,
          },
          y: {
            title: {
              text: "MPG",
              display: true,
            },
            min: Math.min(...cleaned.map((y) => y.y)) - 5,
            max: Math.max(...cleaned.map((y) => y.y)) + 5,
          },
        },
      };
      setChartOpt(chOpt);

      const chData: ScatterType["data"] = {
        labels: ["car"],
        datasets: [
          {
            label: "car",
            data: cleaned,
          },
        ],
      };
      setChartData(chData);
    }
  }, [data]);

  return (
    <>{chartData && <Scatter options={chartOpt} data={chartData}></Scatter>}</>
  );
};

export default DataGraph;
