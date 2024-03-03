import { Suspense, lazy } from "react";
import { Outlet,useNavigate } from "react-router-dom";
import DashboardLayout from '@/layouts/dashboard'
import {LoadingScreen} from '@/components'
import { Button, Result } from 'antd';
import useCookie from '../../hooks/useCookie';
import CampaignEdit from "../../sections/CampaignEdit/view";

const RouterReportDetail= lazy(()=> import('@/pages/RouteReportDetail'))
const RouterProduct_SKU= lazy(()=> import('@/pages/RouterProduct_SKU'))
const Campaign = lazy(()=> import('@/pages/Campaign'))
const CampaignCreate = lazy(()=> import('@/pages/CampaignCreate'))
const ReportView = lazy(()=> import('@/pages/RouteReportView'))
// Định nghĩa các route của dashboard
export const dashboardRoutes = [
    {
        path: '/',
        element: (
            <DashboardLayout>
                <Suspense fallback={<LoadingScreen />}>
                    <Outlet />
                </Suspense>
            </DashboardLayout>
        ),
        children: [
            {
                index: true, element: <RouterReportDetail />
            },
            {
                path: 'product_sku', element: <RouterProduct_SKU />
            },
            {
                path: 'campaign', element: <Campaign />
            },
            {
                path: 'campaign-create', element: <CampaignCreate />
            },
            {
                path: 'campaign-edit/:name', element: <CampaignEdit />
            },
            {
                path: 'report-view', element: <ReportView />
            }
        ]
    },
    {
        path: 'error', // Đường dẫn cho trang error
        element: <ErrorPage /> // Sử dụng component ProtectedRoute cho trang error
    }
];
function ErrorPage() {
    const navigate = useNavigate();

    // Xử lý sự kiện click trên nút "Trang chủ"
    const handleLoginClick = () => {
        navigate('/login#login');
    };

    return (
        <Result
            status="403"
            title="Error"
            subTitle="Xin lỗi bạn chưa đăng nhập. Vui lòng đăng nhập để sử dụng"
            extra={<Button type="primary" onClick={handleLoginClick}>Đăng nhập</Button>}
        />
    );
}

// Component kiểm tra quyền truy cập và điều hướng đến trang Error nếu cần
export function ProtectedRoute() {
    const navigate = useNavigate();
    const { currentUser } = useCookie();
    console.log("current user", currentUser);
    if (currentUser !== 'Administrator') {
        navigate('/error'); // Nếu không có quyền truy cập, điều hướng đến trang error
    }
    return <RouterReportDetail />;
}
