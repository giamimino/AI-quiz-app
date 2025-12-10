import { Children } from "@/app/types/global";
import clsx from "clsx";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  YAxis,
  XAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import colors from "@/data/colors/colors.json";

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

export function AreaChartComponentLined({
  data,
}: {
  data: { startedAt: string; score: number }[];
}) {
  const color = colors[Math.floor(Math.random() * 20)];

  return (
    <ResponsiveContainer width={"100%"} height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="startedAt" stroke="#ccc" />
        <YAxis
          stroke="#ccc"
          dataKey={"score"}
          allowDecimals={false}
          domain={["dataMin", "dataMax + 100"]}
        />
        <Tooltip />
        <Area
          dataKey="score"
          stroke={color}
          fill="transparent"
          type="linear"
          strokeWidth={2}
          dot={false}
          animationDuration={2500}
          animationEasing="ease-in-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CustomTooltip({ payload, label, active }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip border border-orange-10 bg-white p-2.5 rounded-lg orange-box-shadow">
        <p className="label" style={{ margin: '0', fontWeight: '700' }}>{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }
}

export function AreaChartComponentDefault({
  data,
  dataKey,
  xKey
}: {
  data: any;
  dataKey: string;
  xKey: string
}) {
  return (
    <BarChart data={data} width={600} height={300}>
      <YAxis allowDecimals={false} domain={["dataMin", "dataMax"]} />
      <XAxis stroke="white" dataKey={xKey} />
      <Tooltip content={CustomTooltip} defaultIndex={2} cursor={false} />
      <Bar dataKey={dataKey} fill="#c2b4a3" barSize={30} />
    </BarChart>
  );
}
