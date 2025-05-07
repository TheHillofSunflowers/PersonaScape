'use client';

import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-xl shadow bg-white">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Welcome to your dashboard!</p>
      </div>
    </ProtectedRoute>
  );
}
