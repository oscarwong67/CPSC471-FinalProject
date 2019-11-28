import React from 'react';
import DriverDashboard from './Employee/Driver/DriverDashboard';
import ChargerDashboard from './Employee/Charger/ChargerDashboard';
import CustomerDashboard from './Customer/CustomerDashboard';

function chooseDashboard() {
    const accountType = localStorage.getItem('accountType');
    switch (accountType) {
        case 'Driver':
            return <DriverDashboard />;
        case 'Charger':
            return <ChargerDashboard />;
        case 'Customer':
            return <CustomerDashboard />;
        default:
            return (
                <div>
                    Error!
                </div>
            );
    }
}

const DashboardPicker = () => chooseDashboard();

export default DashboardPicker;