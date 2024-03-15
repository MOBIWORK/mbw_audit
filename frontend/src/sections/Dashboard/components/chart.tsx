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
    const dataone = [data.data.tyle];
    const total = dataone.reduce((acc, curr) => acc + curr, 0);
    const totalText = `${total}/${data.data.tong}`;
    
    const dataChart = {
        datasets: [{
            data: [total, data.data.tong - total],
            backgroundColor: [
                 data.data.color, // Màu cho số đã hoàn thành
                'rgba(196, 205, 213, 1)', // Màu cho số còn lại
            ],
            borderColor: [
                data.data.color,
                'rgba(196, 205, 213, 1)',
            ],
            borderWidth: 2,
        }],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            datalabels: {
                display: false, // Tắt hiển thị nhãn trên các phần tử dữ liệu
            },
        },
        hover: {
            enabled: false, // Tắt tính năng hover
        },
        cutout: '85%',
        cornerRadius: 10,
    };

    const chartContainerStyle = {
        position: 'relative',
        width: '135px',
        height: '135px',
        padding: '10px',
    };

    const totalTextStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '16px',
        fontWeight:'700'
    };

    return (
        <div style={chartContainerStyle}>
            <Doughnut data={dataChart} options={options} plugins={[ChartDataLabels]} />
            <div style={totalTextStyle}>{totalText}</div>
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
                backgroundColor: 'rgba(24, 119, 242, 1)', // Màu nền cột
                borderColor: 'rgba(24, 119, 242, 1)', // Màu viền cột
                borderWidth: 0.5, // Giảm kích thước của các cột
                hoverBackgroundColor: 'rgba(24, 119, 242, 1)', // Màu nền cột khi hover
                hoverBorderColor: 'rgba(24, 119, 242, 1)', // Màu viền cột khi hover
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