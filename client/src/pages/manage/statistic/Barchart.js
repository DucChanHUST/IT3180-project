import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  FormControl,
  TextField,
  Button,
} from "@mui/material";
import { Chart, BarController, CategoryScale, LinearScale, BarElement } from "chart.js";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useSelector } from "react-redux";

// Register the necessary components with Chart.js
Chart.register(BarController, CategoryScale, LinearScale, BarElement);

const BarChart = () => {
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [barChartData, setBarChartData] = useState({ labels: [], values: [] });
  const expenseData = useSelector(state => state.expense.allExpense);
  
  const handleYearChange = (date) => {
    setSelectedYear(date.year());
  };

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
          title={`Số tiền đã nộp năm ${selectedYear}`}
        />
        <CardContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Chọn năm"
              views={["year"]}
              value={dayjs(selectedYear.toString())}
              onChange={handleYearChange}
              renderInput={(params) => (
                <TextField {...params} variant="standard" fullWidth />
              )}
            />
          </LocalizationProvider>

          <canvas id="myChart" />
        </CardContent>
      </Card>

    </Container>
  );
};

export default BarChart;
