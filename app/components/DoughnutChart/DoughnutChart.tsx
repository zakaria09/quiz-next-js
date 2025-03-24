'use client';
import React from 'react';
import {Doughnut} from 'react-chartjs-2';

type QuizResultChartProps = {
  correct: number;
  incorrect: number;
  questionsTotal: number;
};

export default function DoughnutChart({
  correct,
  incorrect,
  questionsTotal,
}: QuizResultChartProps) {
  const chartData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [
          Math.round((correct / questionsTotal) * 100),
          Math.round((incorrect / questionsTotal) * 100),
        ],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#4caf50', '#f44336'],
        borderWidth: 1,
      },
    ],
  };

  const chartConfig = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        enabled: true,
      },
    },
  };
  return <Doughnut data={chartData} options={chartConfig} />;
}
