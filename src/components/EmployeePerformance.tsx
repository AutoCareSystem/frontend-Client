interface HourData {
  date: string;
  hoursWorked: number;
  tasksCompleted: number;
}

export default function EmployeePerformance() {
  const hoursData: HourData[] = [
    { date: "Mon", hoursWorked: 8, tasksCompleted: 3 },
    { date: "Tue", hoursWorked: 8.5, tasksCompleted: 4 },
    { date: "Wed", hoursWorked: 7.5, tasksCompleted: 2 },
    { date: "Thu", hoursWorked: 9, tasksCompleted: 5 },
    { date: "Fri", hoursWorked: 8, tasksCompleted: 3 },
  ];

  const maxHours = Math.max(...hoursData.map((d) => d.hoursWorked));
  const totalHours = hoursData.reduce((sum, d) => sum + d.hoursWorked, 0);
  const totalTasks = hoursData.reduce((sum, d) => sum + d.tasksCompleted, 0);

  return (
    <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg overflow-hidden hover:border-gray-600 hover:shadow-lg hover:shadow-gray-700/20 transition">
      <div className="p-6 border-b border-gray-700/50">
        <h3 className="text-xl font-bold text-white">Weekly Performance</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-700/50 hover:border-gray-600 hover:shadow-md hover:shadow-gray-700/10 transition">
            <p className="text-gray-400 text-xs font-medium mb-1">
              Total Hours
            </p>
            <p className="text-2xl font-bold text-red-500">
              {totalHours.toFixed(1)}h
            </p>
          </div>
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-700/50 hover:border-gray-600 hover:shadow-md hover:shadow-gray-700/10 transition">
            <p className="text-gray-400 text-xs font-medium mb-1">
              Tasks Completed
            </p>
            <p className="text-2xl font-bold text-green-500">{totalTasks}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="space-y-3">
          {hoursData.map((data) => (
            <div key={data.date} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-gray-300 group-hover:text-white transition">
                  {data.date}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-gray-400 transition">
                  {data.hoursWorked}h • {data.tasksCompleted} tasks
                </span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden group-hover:bg-gray-700 transition">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(data.hoursWorked / maxHours) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Rating */}
        <div className="pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">Rating</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i <= 4 ? "bg-yellow-500" : "bg-gray-700/50"
                  }`}
                ></div>
              ))}
              <span className="ml-2 font-bold text-white text-sm">4.0/5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
