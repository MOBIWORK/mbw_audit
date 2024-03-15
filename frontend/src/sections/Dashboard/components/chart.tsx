// import { Line } from "@ant-design/charts";
import React from 'react';
import {Chart,registerables, ArcElement} from 'chart.js'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Doughnut} from 'react-chartjs-2';
// import { faker } from '@faker-js/faker';
import { WrapperCard } from './card';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(
 ...registerables,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const ChartCustom = ({ data }: { data: any[] }) => {  
    const dataChart = {
        datasets: [{
            label: 'My First Dataset',
            data: [15, 25 - 15],
            backgroundColor: [
                'rgba(24, 119, 242, 1)', // Màu cho số đã hoàn thành
                'rgba(196, 205, 213, 1)', // Màu cho số còn lại
            ],
            borderColor: [
                'rgba(24, 119, 242, 1)',
                'rgba(196, 205, 213, 1)',
            ],
            borderWidth: 2,
        }],
    };
    const total = dataChart.datasets && dataChart.datasets[0] && dataChart.datasets[0].data
    ? dataChart.datasets[0].data.reduce((acc, curr) => acc + curr, 0)
    : 0;
    // Kiểm tra nếu dataChart.labels không tồn tại hoặc là undefined, thì gán cho nó là một mảng rỗng
dataChart.labels = dataChart.labels || [];

// Thêm nhãn tổng vào mảng labels
dataChart.labels.push(`Total: ${total}`);
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                color: '#ffffff',
                formatter: (value, context) => {
                    if (context.chart.data.labels.indexOf(context.label) === context.chart.data.labels.length - 1) {
                        return value;
                    }
                    return '';
                },
                anchor: 'center',
                align: 'center',
                font: {
                    size: 16,
                }
            },
        },
        cutout: '70%',
    };

    return (
        <div style={{ width: '100px', height: '100px', padding: '10px' }}>
            <Doughnut data={dataChart} options={options} />
        </div>
    );
  
  }

  export const HorizontalBarChart = ({ data }) => {
    // Dữ liệu mẫu
    const sampleData = {
        labels: ['Chiến dịch 1', 'Chiến dịch 1', 'Chiến dịch 1', 'Chiến dịch 1', 'Chiến dịch 1', 'Chiến dịch 1', 'Chiến dịch 1'],
        datasets: [
            {
                label: 'Chiến dịch',
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Màu nền cột
                borderColor: 'rgba(54, 162, 235, 1)', // Màu viền cột
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)', // Màu nền cột khi hover
                hoverBorderColor: 'rgba(54, 162, 235, 1)', // Màu viền cột khi hover
                data: [65, 59, 80, 81, 56, 55, 40], // Dữ liệu cột
            },
        ],
    };

    return (
        <div style={{ width: '100%', height: '400px' }}> {/* Đặt kích thước cho biểu đồ */}
            <Bar
                data={sampleData}
                options={{
                    indexAxis: 'y', // Chuyển biểu đồ sang nằm ngang
                    maintainAspectRatio: false, // Cho phép thay đổi kích thước không tự động duy trì tỷ lệ
                    scales: {
                        x: {
                            beginAtZero: true // Bắt đầu từ 0 trên trục x
                        }
                    }
                }}
            />
        </div>
    );
};

// export const ChartCustom = ({ data }: { data: any[] }) => {  
//   const dataChart = {
//     labels:[...data.length > 0 ? data.map(dt => dt.thoi_gian) : labels ,"Giờ"],
//     datasets: [{
//       data: data.map(dt => dt.doanh_so),
//       fill: false,
//       borderColor: '#5BE49B',
//       tension: 0.1
//     }]
//   }
//   return <WrapperCard >
//    <div className='h-[415px]'>
//       <p className="text-lg font-bold ">Biểu đồ  doanh số</p>
//       <div className='mt-12'><Line options={options} data={dataChart} /></div>
//    </div>
//   </WrapperCard>
// }