import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Chart, BarController, CategoryScale, LinearScale, BarElement } from "chart.js";
import dayjs from "dayjs";

// Register the necessary components with Chart.js
Chart.register(BarController, CategoryScale, LinearScale, BarElement);

const BarChart = ({ selectedYear }) => {
  const [barChartData, setBarChartData] = useState({ labels: [], values: [] });
  const expenseData = useSelector(state => state.expense.allExpense);

  const handleGenerateChart = () => {
    // Filter the expense data for the selected year
    const filteredData = expenseData.filter(
      (expense) =>
        dayjs(expense.date).year() === selectedYear
    );

    // Process the filtered data to get totals per month
    const monthlyTotals = Array.from({ length: 12 }, (_, monthIndex) => {
      const monthExpenses = filteredData.filter(
        (expense) => dayjs(expense.date).month() === monthIndex
      );

      return monthExpenses.reduce((total, expense) => total + expense.amount, 0);
    });

    // Convert the totals array to labels and values arrays for the chart
    const labels = Array.from({ length: 12 }, (_, index) => (index + 1).toString());
    const values = monthlyTotals;

    setBarChartData({ labels, values });

    // Get the canvas element
    const canvas = document.getElementById("myChart");

    // If a Chart instance already exists, destroy it
    if (canvas.chart) {
      canvas.chart.destroy();
    }

    // Create a new Chart instance
    const ctx = canvas.getContext("2d");
    const myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Số tiền đã nộp",
            data: values,
            backgroundColor: "rgba(75, 192, 192, 0.5)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "Tháng",
            },
          },
          y: {
            title: {
              display: true,
              text: "Số tiền (VND)",
            },
          },
        },
        title: {
          display: true,
          text: `Thống kê số tiền đã nộp năm ${selectedYear}`,
          fontSize: 20,
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: true,
        },
      },
    });

    // Attach the chart instance to the canvas
    canvas.chart = myChart;
  };

  useEffect(() => {
    handleGenerateChart();
  }, [expenseData, selectedYear]);

  return (
    <Container>
      <Card>
        <CardHeader
          title={`Số tiền đã nộp năm ${selectedYear} theo tháng`}
        />
        <CardContent>
          <canvas id="myChart" />
        </CardContent>
      </Card>

    </Container>
  );
};

export default BarChart;
