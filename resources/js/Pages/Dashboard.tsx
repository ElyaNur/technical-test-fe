import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from '@inertiajs/react';
import {PageProps} from '@/types';
import Chart from "react-apexcharts";

interface DashboardProps extends PageProps {
    data: any;
}

export default function Dashboard({auth, data}: DashboardProps) {
    const initial = {
        options: {
            chart: {
                id: "basic-bar"
            },
            xaxis: {
                categories: data.categories
            },
            yaxis: {
                title: {
                    text: 'Penonton',
                    style: {
                        fontSize: '14px'
                    }
                }
            }
        },
        series: [
            {
                name: "Penonton",
                data: data.series
            },
        ]
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard"/>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <Chart
                            options={initial.options}
                            series={initial.series}
                            type="bar"
                            height={500}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
