import Head from "next/head";
import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartData,
  ScatterDataPoint,
  ChartDataset,
} from "chart.js";
import { ChartProps, Scatter } from "react-chartjs-2";

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

type ChartType = ChartProps<"scatter">;

type CarType = {
  Name: string;
  Miles_per_Gallon?: number;
  Cylinders?: number;
  Displacement?: number;
  Horsepower?: number;
  Weight_in_lbs?: number;
  Acceleration?: number;
  Year?: string;
  Origin?: string;
};

type ChartDataType = ScatterDataPoint & {
  x: number;
  y: number;
};

const TwoDCurvePage = () => {
  const [data, setData] = useState<ChartDataType[]>();
  const [chartData, setChartData] = useState<ChartType["data"]>();
  const [chartOpt, setChartOpt] = useState<ChartType["options"]>();

  const getData = async () => {
    await fetch("https://storage.googleapis.com/tfjs-tutorials/carsData.json")
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          const cleaned = res
            .map((car: CarType) => ({
              x: car.Miles_per_Gallon,
              y: car.Horsepower,
            }))
            .filter((car: ChartDataType) => car.x != null && car.y != null);
          setData(cleaned);
        }
      });
  };

  useEffect(() => {
    getData();
    console.log("Hello TensorFlow");
  }, []);

  useEffect(() => {
    if (data) {
      const chOpt: ChartType["options"] = {
        responsive: true,
        scales: {
          x: {
            title: {
              text: "Horsepower",
              display: true,
            },
            min: Math.min(...data.map((x) => x.x)) - 5,
            max: Math.max(...data.map((x) => x.x)) + 5,
          },
          y: {
            title: {
              text: "MPG",
              display: true,
            },
            min: Math.min(...data.map((y) => y.y)) - 5,
            max: Math.max(...data.map((y) => y.y)) + 5,
          },
        },
      };
      setChartOpt(chOpt);

      const chData: ChartData<"scatter"> = {
        labels: ["car"],
        datasets: [
          {
            label: "car",
            data,
          },
        ],
      };
      setChartData(chData);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>2D 데이터로 예측하기(튜토리얼)</title>
      </Head>
      <div
        style={{
          width: "90vw",
          height: "80vh",
          margin: "0 auto",
          background: "#ddd",
        }}
      >
        {chartData && <Scatter options={chartOpt} data={chartData}></Scatter>}
      </div>
    </>
  );
};

export default TwoDCurvePage;
