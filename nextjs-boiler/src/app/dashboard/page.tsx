"use client";

import { useEffect, useState } from "react";

interface HealthStatus {
  status: string;
  timestamp: string;
}

export default function DashboardPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-3">API Health</h2>
        {health ? (
          <div className="space-y-2">
            <p>
              Status:{" "}
              <span className="text-green-600 font-medium">{health.status}</span>
            </p>
            <p className="text-sm text-gray-500">{health.timestamp}</p>
          </div>
        ) : (
          <p className="text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
}
