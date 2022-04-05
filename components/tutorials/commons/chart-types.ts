import { ScatterDataPoint } from "chart.js";
import { ChartProps } from "react-chartjs-2";

/**
 * #1. scatter chart types
 */
export type ScatterType = ChartProps<"scatter">;
export type ScatterDataType = ScatterDataPoint & {
  x: number;
  y: number;
};

/**
 * #2. line chart types
 */
export type LineType = ChartProps<"line">;
