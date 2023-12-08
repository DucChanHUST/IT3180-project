import React, { useEffect, useState } from "react";
import { Container, Card, CardHeader, CardContent } from "@mui/material";
import { Chart, DoughnutController, ArcElement, Legend, Tooltip } from "chart.js";
import { useSelector } from "react-redux";

Chart.register(DoughnutController, ArcElement, Legend, Tooltip);

const PieChart = () => {
  const allFee = useSelector((state) => state.fee.allFee);
  const allExpense = useSelector((state) => state.expense.allExpense);
  const [pieChart, setPieChart] = useState(null);

  const generatePieChartData = () => {
    const compulsoryFeesTotal = allFee
      .filter((fee) => fee.type === 1)
      .reduce((total, fee) => {
        const feeExpenses = allExpense.filter(
          (expense) => expense.feeId === fee.id
        );
        const feeTotal = feeExpenses.reduce(
          (feeSum, expense) => feeSum + expense.amount,
          0
        );
        return total + feeTotal;
      }, 0);

    const voluntaryFeesTotal = allFee
      .filter((fee) => fee.type === 0)
      .reduce((total, fee) => {
        const feeExpenses = allExpense.filter(
          (expense) => expense.feeId === fee.id
        );
        const feeTotal = feeExpenses.reduce(
          (feeSum, expense) => feeSum + expense.amount,
          0
        );
        return total + feeTotal;
      }, 0);

    const data = [compulsoryFeesTotal, voluntaryFeesTotal];

    // Check if a chart instance exists
    if (pieChart) {
      pieChart.destroy(); // Destroy the existing chart
    }

    // Create a new chart
    const ctx = document.getElementById("pieChart").getContext("2d");
    const newPieChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Phí bắt buộc", "Phí tự nguyện"],
        datasets: [
          {
            data: data,
            backgroundColor: ["#FF6384", "#36A2EB"],
            hoverBackgroundColor: ["#FF6384", "#36A2EB"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            position: "bottom",
          },
          tooltip: {
            enabled: true,
          },
        },
      },
    });

    setPieChart(newPieChart); // Save the new chart instance
  };

  useEffect(() => {
    generatePieChartData();
  }, [allFee, allExpense]);

  return (
    <Container>
      <Card>
        <CardHeader title="Số tiền đã đóng theo loại phí" />
        <CardContent>
          <canvas id="pieChart" />
        </CardContent>
      </Card>
    </Container>
  );
};

export default PieChart;
