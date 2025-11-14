import React, { useState, useMemo, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
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

// Register the components Chart.js needs
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function HabitGraph({ habits, timeData }) {
    const [selectedHabitId, setSelectedHabitId] = useState('');

    // Find the selected habit's data and prepare it for the chart
    const chartData = useMemo(() => {
        if (!selectedHabitId || !timeData[selectedHabitId]) {
            return null;
        }

        const entries = [...timeData[selectedHabitId]].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );
        const recentEntries = entries.slice(-30);
        const labels = recentEntries.map((entry) => entry.date);
        const data = recentEntries.map((entry) => entry.time);

        return {
            labels,
            datasets: [
                {
                    label: 'Time Spent (minutes)',
                    data: data,
                    fill: true, // Fill the area under the line
                    borderColor: 'rgb(59, 130, 246)', // blue-500
                    backgroundColor: 'rgba(59, 130, 246, 0.3)', // blue-500 with alpha
                    tension: 0.1,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#fff',
                    pointHoverRadius: 7,
                },
            ],
        };
    }, [selectedHabitId, timeData]);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#E5E7EB' // gray-200
                }
            },
            title: {
                display: true,
                text: 'Time Logged Over Time',
                color: '#E5E7EB', // gray-200
                font: {
                    size: 16
                }
            },
        },
        scales: {
            x: {
                ticks: { color: '#9CA3AF' }, // gray-400
                grid: { color: '#374151' } // gray-700
            },
            y: {
                ticks: { color: '#9CA3AF' }, // gray-400
                grid: { color: '#374151' } // gray-700
            }
        }
    };

    // Set default selected habit
    useEffect(() => {
        if (!selectedHabitId && habits.length > 0) {
            setSelectedHabitId(habits[0].id);
        }
    }, [habits, selectedHabitId]);

    return (
        <div className="mt-12 p-6 bg-gray-900 rounded-none shadow-md shadow-blue-900/30">
            <h2 className="text-2xl font-semibold mb-4 text-gray-100">Habit Progress</h2>

            {/* --- Habit Selector Dropdown --- */}
            <div className="mb-4">
                <label htmlFor="habit-select" className="block text-sm font-medium text-gray-300 mb-1">
                    Select a habit to view progress:
                </label>
                <select
                    id="habit-select"
                    value={selectedHabitId}
                    onChange={(e) => setSelectedHabitId(e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-blue-700 rounded-none text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="" disabled>-- Select a habit --</option>
                    {habits.map((habit) => (
                        <option key={habit.id} value={habit.id}>
                            {habit.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* --- Chart --- */}
            <div className="min-h-[300px]">
                {chartData ? (
                    <Line options={chartOptions} data={chartData} />
                ) : (
                    <p className="text-gray-500 text-center pt-10">
                        {selectedHabitId
                            ? 'No time logged for this habit yet.'
                            : 'Please select a habit.'}
                    </p>
                )}
            </div>
        </div>
    );
}