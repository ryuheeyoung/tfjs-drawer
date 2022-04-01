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
  CategoryScale,
} from "chart.js";
import { History } from "@tensorflow/tfjs";
import DataGraph from "../../components/tutorials/2d-curve/data-graph";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export type CarType = {
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

const dataUrl = "https://storage.googleapis.com/tfjs-tutorials/carsData.json";

const TwoDCurvePage = () => {
  const [data, setData] = useState<Array<CarType>>();
  const [hist, setHist] = useState<History>();

  const [chartData, setChartData] = useState<ChartData<"line">>();

  /**
   * create sequence model
   */
  const createModel = (): tf.Sequential => {
    // Create a sequential model
    const model = tf.sequential();

    // Add a single input layer
    model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));

    // Add an output layer
    model.add(tf.layers.dense({ units: 1, useBias: true }));

    model.summary();
    return model;
  };

  /**
   * Convert the input data to tensors that we can use for machine
   * learning. We will also do the important best practices of _shuffling_
   * the data and _normalizing_ the data
   * MPG on the y-axis.
   */
  const convertToTf = (data: Array<CarType>) => {
    // Wrapping these calculations in a tidy will dispose any
    // intermediate tensors.
    return tf.tidy(() => {
      // Step 1. Shuffle the data
      tf.util.shuffle(data);

      // Step 2. Convert data to Tensor
      const inputs = data.map((d) => d.Horsepower);
      const labels = data.map((d) => d.Miles_per_Gallon);

      const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
      const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

      //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
      const inputMax = inputTensor.max();
      const inputMin = inputTensor.min();
      const labelMax = labelTensor.max();
      const labelMin = labelTensor.min();

      const normalizedInputs = inputTensor
        .sub(inputMin)
        .div(inputMax.sub(inputMin));
      const normalizedLabels = labelTensor
        .sub(labelMin)
        .div(labelMax.sub(labelMin));

      return {
        inputs: normalizedInputs,
        labels: normalizedLabels,
        // Return the min/max bounds so we can use them later.
        inputMax,
        inputMin,
        labelMax,
        labelMin,
      };
    });
  };

  const trainModel = async (
    model: tf.Sequential,
    inputs: tf.Tensor<tf.Rank>,
    labels: tf.Tensor<tf.Rank>
  ) => {
    // Prepare the model for training.
    model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
      metrics: ["mse"],
    });

    const batchSize = 32;
    const epochs = 50;

    return await model.fit(inputs, labels, {
      batchSize,
      epochs,
      shuffle: true,
      // callbacks: tfvis.show.fitCallbacks(
      //   { name: 'Training Performance' },
      //   ['loss', 'mse'],
      //   { height: 200, callbacks: ['onEpochEnd'] }
      // )
    });
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

  const training = async () => {
    console.log("@@@@@ summary");
    const model = createModel();

    console.log("@@@@@ Training Performance");
    const tensorData = convertToTf(data);
    const { inputs, labels } = tensorData;

    const h = await trainModel(model, inputs, labels);

    if (h) {
      setHist(h);
    }
  };

  useEffect(() => {
    getData();
    console.log("Hello TensorFlow");
  }, []);

  useEffect(() => {
    if (data) {
      training();
    }
  }, [data]);

  useEffect(() => {
    if (hist) {
      const chData: ChartData<"line"> = {
        labels: hist.epoch,
        datasets: [
          {
            label: "epoch",
            data: hist.history.mse as Array<number>,
          },
        ],
      };

      setChartData(chData);
    }
  }, [hist]);

  return (
    <>
      <Head>
        <title>2D 데이터로 예측하기(튜토리얼)</title>
      </Head>
      <div
        style={{
          width: "90vw",
          height: "fit-content",
          margin: "0 auto",
          background: "#ddd",
        }}
      >
        <DataGraph data={data} />
      </div>
      <div
        style={{
          width: "90vw",
          height: "fit-content",
          margin: "0 auto",
          background: "#ddd",
        }}
      >
        {chartData && <Line data={chartData} />}
      </div>
      <div>loss : {hist && hist.history.loss[0]}</div>
      <div>mse : {hist && hist.history.mse[0]}</div>
    </>
  );
};

export default TwoDCurvePage;
