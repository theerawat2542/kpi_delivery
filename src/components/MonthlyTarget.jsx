import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  CartesianGrid,
} from 'recharts';

function MonthlyTarget() {
  const [data, setData] = useState([]);
  const monthName = new Date().toLocaleString('default', { month: 'long' });

  useEffect(() => {
    const now = new Date();
    const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    // const startDate = `2025-07-01`;
    // const endDate = `2025-07-31`;

    fetch(`http://10.35.10.47:2007/api/HtcKpi/KpiDelivery/Delivery/ByModel?Plant=9771&StartDate=${startDate}&EndDate=${endDate}`)
      .then((res) => res.json())
      .then((json) => {
        // ✅ กรองเฉพาะข้อมูลที่ target ไม่เป็น null
        const filtered = json.filter(item => item.target !== null);

        const map = {};
        filtered.forEach((item) => {
          const day = item.postDate.slice(0, 10);
          if (!map[day]) {
            map[day] = { date: day, actual: 0, target: 0 };
          }
          map[day].actual += item.actualDelivery;
          map[day].target += item.target;
        });

        const result = [];
        const sd = new Date(startDate);
        const ed = new Date(endDate);
        for (let d = new Date(sd); d <= ed; d.setDate(d.getDate() + 1)) {
          const key = d.toISOString().slice(0, 10);
          if (map[key]) {
            result.push(map[key]);
          }
        }

        setData(result);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div
      style={{
        width: '100%',
        padding: '15px 14px',
        color: '#ffffff',
        fontFamily: 'Segoe UI, sans-serif',
        animation: 'fadeIn 0.8s ease-out',
      }}
    >
      <div style={{
        width: '100%',
        height: 950,
        background: 'linear-gradient(145deg, #22334c, #1c273a)',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        transition: '0.3s',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <p style={{
          fontWeight: 600,
          fontSize: '18px',
          letterSpacing: '0.5px',
          textAlign: 'center',
          marginBottom: '12px',
          color: '#ffffff',
        }}>
          🎯 Monthly Actual with Target ({monthName})
        </p>

        <div style={{ flex: 1 }}>
          <ResponsiveContainer>
            <ComposedChart data={data}>
              <CartesianGrid stroke="#334156" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => d.slice(-2)}
                tick={{ fill: '#ffffffcc', fontSize: 12 }}
              />
              <YAxis tick={{ fill: '#ffffffcc', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e2a3a',
                  border: '1px solid #334156',
                  color: '#fff',
                  borderRadius: 6,
                }}
                labelStyle={{ color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend wrapperStyle={{ color: '#ffffffdd', fontSize: 12 }} />
              <Bar
                dataKey="actual"
                name="Actual Delivery"
                barSize={20}
                fill="#69c0ff"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="#ff4d4f"
                strokeWidth={2}
                dot={{ r: 3, stroke: '#ffccc7', strokeWidth: 1.5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default MonthlyTarget;
