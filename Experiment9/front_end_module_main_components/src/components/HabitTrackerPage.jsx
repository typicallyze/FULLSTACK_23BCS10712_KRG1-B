import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import HabitGraph from './HabitGraph';

const TIME_DATA_STORAGE_KEY = 'habitTimeData';

/**
 * Main Application Component
 */
export default function HabitTrackerPage() {
    const [habits, setHabits] = useState([]);
    const [newHabitName, setNewHabitName] = useState('');
    const [timeData, setTimeData] = useState(() => {
        try {
            const storedTimeData = localStorage.getItem(TIME_DATA_STORAGE_KEY);
            return storedTimeData ? JSON.parse(storedTimeData) : {};
        } catch (error) {
            console.error("Error loading time data from localStorage:", error);
            return {};
        }
    });
    const navigate = useNavigate();

    // Load habits
    useEffect(() => {
        fetchHabits();
    }, []);

    // Save time data
    useEffect(() => {
        try {
            localStorage.setItem(TIME_DATA_STORAGE_KEY, JSON.stringify(timeData));
        } catch (error) {
            console.error("Error saving time data to localStorage:", error);
        }
    }, [timeData]);

    // --- API Functions ---
    const fetchHabits = async () => {
        try {
            const response = await api.get('/habits');
            setHabits(response.data);
        } catch (error) {
            console.error('Error fetching habits:', error);
            if (error.response && error.response.status === 401) {
                handleLogout();
            }
        }
    };

    const handleAddHabit = async (e) => {
        e.preventDefault();
        if (!newHabitName.trim()) return;
        try {
            const response = await api.post('/habits', { name: newHabitName });
            setHabits([...habits, response.data]);
            setNewHabitName('');
        } catch (error) {
            console.error('Error creating habit:', error);
        }
    };

    const handleCompleteHabit = async (id) => {
        try {
            const response = await api.post(`/habits/${id}/complete`);
            const updatedHabit = response.data;
            setHabits(
                habits.map((habit) => (habit.id === id ? updatedHabit : habit))
            );
        } catch (error) {
            console.error('Error completing habit:', error);
        }
    };

    const handleDeleteHabit = async (id) => {
        try {
            await api.delete(`/habits/${id}`);
            setHabits(habits.filter((habit) => habit.id !== id));
            setTimeData(prevData => {
                const newData = { ...prevData };
                delete newData[id];
                return newData;
            });
        } catch (error) {
            console.error('Error deleting habit:', error);
        }
    };

    const handleAddTime = (habitId, timeInMinutes) => {
        const today = new Date().toISOString().split('T')[0];
        setTimeData(prevData => {
            const habitEntries = prevData[habitId] || [];
            const existingEntryIndex = habitEntries.findIndex(entry => entry.date === today);

            let newEntries;
            if (existingEntryIndex !== -1) {
                newEntries = habitEntries.map((entry, index) =>
                    index === existingEntryIndex ? { ...entry, time: timeInMinutes } : entry
                );
            } else {
                newEntries = [...habitEntries, { date: today, time: timeInMinutes }];
            }

            return {
                ...prevData,
                [habitId]: newEntries,
            };
        });
    };

    const findTodaysEntry = (habitId) => {
        const today = new Date().toISOString().split('T')[0];
        const habitEntries = timeData[habitId] || [];
        return habitEntries.find(entry => entry.date === today);
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem(TIME_DATA_STORAGE_KEY);
        navigate('/login');
    };

    return (
        <div className="bg-black text-gray-200 min-h-screen font-sans">
            <div className="container mx-auto max-w-2xl p-4 pt-12">

                {/* --- Header & Logout --- */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-500">
                        Habit Tracker
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="bg-transparent text-blue-500 border border-blue-800 font-semibold px-4 py-2 rounded-none hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
                    >
                        Log Out
                    </button>
                </div>

                {/* --- New Habit Form --- */}
                <HabitForm
                    newHabitName={newHabitName}
                    setNewHabitName={setNewHabitName}
                    onAddHabit={handleAddHabit}
                />

                {/* --- Habit List --- */}
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold mb-4">Your Habits</h2>
                    {habits.length === 0 ? (
                        <p className="text-gray-500">No habits yet. Add one above!</p>
                    ) : (
                        <ul className="space-y-3">
                            {habits.map((habit) => (
                                <HabitItem
                                    key={habit.id}
                                    habit={habit}
                                    todaysTimeEntry={findTodaysEntry(habit.id)}
                                    onAddTime={handleAddTime}
                                    onComplete={handleCompleteHabit}
                                    onDelete={handleDeleteHabit}
                                />
                            ))}
                        </ul>
                    )}
                </div>

                {/* --- Habit Graph Section --- */}
                {habits.length > 0 && (
                    <HabitGraph habits={habits} timeData={timeData} />
                )}
            </div>
        </div>
    );
}

// --- Sub-component (HabitForm) ---
function HabitForm({ newHabitName, setNewHabitName, onAddHabit }) {
    return (
        <form onSubmit={onAddHabit} className="flex gap-3">
            <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="e.g., Drink Water"
                className="flex-grow p-3 bg-gray-900 border border-blue-700 rounded-none text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="bg-blue-600 text-white font-semibold px-5 py-3 rounded-none hover:bg-blue-500 transition-all duration-200 active:scale-95"
            >
                Add Habit
            </button>
        </form>
    );
}

// --- Sub-component (HabitItem) ---
function HabitItem({ habit, onComplete, onDelete, onAddTime, todaysTimeEntry }) {
    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = habit.lastCompletedDate === today;

    const [timeInput, setTimeInput] = useState('');

    useEffect(() => {
        if (todaysTimeEntry) {
            setTimeInput(String(todaysTimeEntry.time));
        } else {
            setTimeInput('');
        }
    }, [todaysTimeEntry]);

    const handleLogTime = (e) => {
        e.preventDefault();
        const time = parseInt(timeInput, 10);
        if (!isNaN(time) && time >= 0) {
            onAddTime(habit.id, time);
        } else {
            console.warn("Invalid time input");
            setTimeInput(todaysTimeEntry ? String(todaysTimeEntry.time) : '');
        }
    };

    return (
        <li className="flex flex-col bg-gray-900 p-4 rounded-none shadow-md shadow-blue-900/30">
            {/* --- Top Row: Habit Info & Delete --- */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onComplete(habit.id)}
                        disabled={isCompletedToday}
                        className={`flex-shrink-0 w-10 h-10 rounded-none border-2 transition-all duration-200 flex items-center justify-center font-bold text-white
                            ${isCompletedToday
                                ? 'bg-blue-500 border-blue-400'
                                : 'border-blue-700 hover:border-blue-500'
                            }
                        `}
                    >
                        {isCompletedToday ? '✓' : ''}
                    </button>
                    <div>
                        <span className="text-lg font-medium text-gray-100">{habit.name}</span>
                        <div className="text-sm text-gray-400">
                            Current Streak:
                            <span className="font-bold text-blue-400 ml-1">
                                🔥 {habit.currentStreak}
                            </span>
                            <span className="ml-4">
                                (Longest: {habit.longestStreak})
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => onDelete(habit.id)}
                    className="text-blue-800 hover:text-red-500 transition-colors duration-200 text-2xl font-bold"
                    aria-label="Delete habit"
                >
                    &times;
                </button>
            </div>

            {/* --- Bottom Row: Time Logging --- */}
            <div className="mt-4 pt-4 border-t border-blue-900 flex items-center gap-3">
                <label htmlFor={`time-${habit.id}`} className="text-sm text-gray-300">
                    Log Time (mins):
                </label>
                <input
                    type="number"
                    id={`time-${habit.id}`}
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                    placeholder="e.g., 30"
                    min="0"
                    className="w-24 p-2 bg-gray-800 border border-blue-700 rounded-none text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleLogTime}
                    className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-none hover:bg-blue-500 transition-all duration-200 text-sm active:scale-95"
                >
                    {todaysTimeEntry ? 'Update Time' : 'Log Time'}
                </button>
                {todaysTimeEntry && (
                    <span className="text-sm text-blue-400 ml-auto">
                        Logged {todaysTimeEntry.time} mins
                    </span>
                )}
            </div>
        </li>
    );
}