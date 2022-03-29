import Head from "next/head";
import { useEffect, useState } from "react";

import * as tf from "@tensorflow/tfjs";

import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartData,
  ScatterDataPoint,
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

const dataUrl = "https://storage.googleapis.com/tfjs-tutorials/carsData.json";

const TwoDCurvePage = () => {
  const [data, setData] = useState<Array<CarType>>();
  const [chartData, setChartData] = useState<ChartType["data"]>();
  const [chartOpt, setChartOpt] = useState<ChartType["options"]>();

  /**
   *
   * @returns {tf.Sequential} model
   */
  const createModel = () => {
    // Create a sequential model
    const model = tf.sequential();

    // Add a single input layer
    model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));

    // Add an output layer
    model.add(tf.layers.dense({ units: 1, useBias: true }));

    model.summary();
    return model;
  };

  const getData = async () => {
    await fetch(dataUrl)
      .then((res) => res.json())
      .then((res) => {
        if (res) {
          setData(res);
        }
      });
  };

  useEffect(() => {
    getData();
    console.log("Hello TensorFlow");
  }, []);

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
      console.log("@@@@@ summary");
      const model = createModel();
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
          height: "40vh",
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
