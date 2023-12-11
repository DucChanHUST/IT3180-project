import React, { useEffect, useState, useRef } from "react";
import { Container, Card, CardHeader, CardContent, Typography } from "@mui/material";
import { Chart, DoughnutController, ArcElement, Legend, Tooltip } from "chart.js";
import { useSelector } from "react-redux";

Chart.register(DoughnutController, ArcElement, Legend, Tooltip);

const PieChart = ({ selectedYear }) => {
  const allFee = useSelector(state => state.fee.allFee);
  const allExpense = useSelector(state => state.expense.allExpense);
  const [pieChartData, setPieChartData] = useState([]);

  const generatePieChartData = () => {
    // Filter the expense data for the selected year
    const filteredData = allExpense.filter(expense => new Date(expense.date).getFullYear() === selectedYear);

    // Process the filtered data to get totals for compulsory and voluntary fees
    const compulsoryFeesTotal = allFee
      .filter(fee => fee.type === 1)
      .reduce((total, fee) => {
        const feeExpenses = filteredData.filter(expense => expense.feeId === fee.id);
        const feeTotal = feeExpenses.reduce((feeSum, expense) => feeSum + expense.amount, 0);
        return total + feeTotal;
      }, 0);

    const voluntaryFeesTotal = allFee
      .filter(fee => fee.type === 0)
      .reduce((total, fee) => {
        const feeExpenses = filteredData.filter(expense => expense.feeId === fee.id);
        const feeTotal = feeExpenses.reduce((feeSum, expense) => feeSum + expense.amount, 0);
        return total + feeTotal;
      }, 0);

    setPieChartData([compulsoryFeesTotal, voluntaryFeesTotal]);
  };

  useEffect(() => {
    generatePieChartData();
  }, [allFee, allExpense, selectedYear]);

  const chartData = {
    labels: ["Phí bắt buộc", "Phí tự nguyện"],
    datasets: [
      {
        data: pieChartData,
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  const chartOptions = {
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
  };

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas.chart) {
      canvas.chart.destroy();
    }

    const ctx = canvas.getContext("2d");
    const pieChart = new Chart(ctx, {
      type: "doughnut",
      data: chartData,
      options: chartOptions,
    });

    canvas.chart = pieChart;
  }, [pieChartData]);

  return (
    <Container>
      <Card>
        <CardHeader
          title={<Typography variant="h5" align="center">{`Thống kê số tiền đã đóng năm ${selectedYear} theo loại phí`}</Typography>}
        />

        <CardContent>
          <canvas ref={canvasRef} />
        </CardContent>
      </Card>
    </Container>
  );
};

export default PieChart;
