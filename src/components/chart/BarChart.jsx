import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import _, { forEach } from "lodash";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({ tasks, members }) {
  console.log(members);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const prjMem = members.map((member) => {
    let count = 0;
    tasks.forEach((task) => {
      if (_.find(task.assignees, (o) => o._id === member.userId)) {
        count++;
      }
    });
    return { ...member, taskCount: count };
  });
  console.log(prjMem);

  const labels = prjMem.map((member) => member.name);
  const dataset = prjMem.map((member) => member.taskCount);

  const data = {
    labels,
    datasets: [
      {
        label: "Task load",
        data: dataset,
        backgroundColor: "rgba(75, 192, 90, 0.8)",
      },
    ],
  };

  // @ts-ignore
  return <Bar options={options} data={data} />;
}
