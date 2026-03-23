"use client"
import { Bar } from "react-chartjs-2"
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 BarElement,
 Tooltip,
 Legend
} from "chart.js"
ChartJS.register(
 CategoryScale,
 LinearScale,
 BarElement,
 Tooltip,
 Legend
)
export default function Chart({data}){
 const chartData = {
  labels: data.map(d=>d.month),
  datasets:[
   {
    label: "Monthly Collection (Rs.)",
    data: data.map((d) => d.amount),
    backgroundColor: "#0d9488",
    borderRadius: 6
   }
  ]
 }
 const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
   legend: { display: true }
  }
 }
 return <Bar data={chartData} options={options} height={400} />
}