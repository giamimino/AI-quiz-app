import { Children } from "@/app/types/global";
import clsx from "clsx";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, YAxis, XAxis, Tooltip } from "recharts";
import colors from "@/data/colors/colors.json"

export function StatisticContianer({
  children,
  wFit,
}: Children & { wFit?: boolean }) {
  return (
    <main
      className={clsx(
        "bg-neutral-900 border border-white/7 rounded-lg p-2.5",
        wFit ? "w-fit" : "w-full"
      )}
    >
      {children}
    </main>
  );
}

export function AreaChartComponent({ data }: { data: { startedAt: string; score: number}[] }) {
  const color = colors[Math.floor(Math.random() * 20)]
  
  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="startedAt" stroke="#ccc" />
        <YAxis stroke="#ccc" dataKey={"score"} allowDecimals={false} domain={['dataMin', 'dataMax + 100']} />
        <Tooltip />
        <Area dataKey="score" stroke={color} fill="transparent" type="linear" strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  )
}