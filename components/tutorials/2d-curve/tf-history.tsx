import { useEffect, useState } from "react";

import * as tf from "@tensorflow/tfjs";
import { Line } from "react-chartjs-2";

import { CarType } from "../../../pages/tutorials/2d-curve";
import { LineType } from "../commons/chart-types";

type PropsType = {
  data: Array<CarType>;
};

const TfHistory = ({ data }: PropsType) => {
  const [hist, setHist] = useState<tf.History>();

  const [chartData, setChartData] = useState<LineType["data"]>();
  const [chartOpt, setChartOpt] = useState<LineType["options"]>();

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

  useEffect(() => {
    if (data) {
      training();
    }
  }, [data]);

  useEffect(() => {
    if (hist) {
      const opt: LineType["options"] = {
        scales: {
          x: {
            title: {
              display: true,
              text: "Epoch",
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Value",
            },
            ticks: {
              format: {
                minimumFractionDigits: 1,
              },
            },
          },
        },
      };
      setChartOpt(opt);

      console.log(hist.history.mse);
      const chData: LineType["data"] = {
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

  return <>{chartData && <Line options={chartOpt} data={chartData} />}</>;
};

export default TfHistory;
