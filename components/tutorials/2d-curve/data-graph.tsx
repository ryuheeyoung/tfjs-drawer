import { ChartData, ScatterDataPoint } from "chart.js";
import { useEffect, useState } from "react";
import { ChartProps, Scatter } from "react-chartjs-2";
import { CarType } from "../../../pages/tutorials/2d-curve";

type ChartType = ChartProps<"scatter">;

type ChartDataType = ScatterDataPoint & {
  x: number;
  y: number;
};

type PropsType = {
  data: Array<CarType>;
};

const DataGraph = ({ data }: PropsType) => {
  const [chartData, setChartData] = useState<ChartType["data"]>();
  const [chartOpt, setChartOpt] = useState<ChartType["options"]>();

  useEffect(() => {
    if (data) {
      const cleaned = data
        .map((car: CarType) => ({
          x: car.Miles_per_Gallon,
          y: car.Horsepower,
        }))
        .filter((car: ChartDataType) => car.x != null && car.y != null);

      const chOpt: ChartType["options"] = {
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

      const chData: ChartData<"scatter"> = {
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
