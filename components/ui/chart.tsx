import * as React from "react";
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";

type ChartSeriesConfig = {
  label?: string;
  color?: string;
};

export type ChartConfig = Record<string, ChartSeriesConfig>;

type ChartContextValue = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextValue | null>(null);

function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error("Chart components must be used within <ChartContainer>.");
  return ctx;
}

export function ChartContainer({
  config,
  className,
  children,
}: {
  config: ChartConfig;
  className?: string;
  children: React.ReactNode;
}) {
  const style = React.useMemo(() => {
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(config)) {
      if (value.color) vars[`--chart-${key}`] = value.color;
    }
    return vars as React.CSSProperties;
  }, [config]);

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        className={cn(
          "h-[260px] w-full [&_.recharts-cartesian-grid_line]:stroke-zinc-200 [&_.recharts-text]:fill-zinc-500",
          className,
        )}
        style={style}
      >
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

export function ChartGrid({ className }: { className?: string }) {
  return (
    <CartesianGrid
      className={cn("stroke-zinc-200/70", className)}
      vertical={false}
    />
  );
}

export function ChartTooltip({
  className,
  ...props
}: React.ComponentProps<typeof Tooltip> & { className?: string }) {
  return (
    <Tooltip
      cursor={{ fill: "rgba(24,24,27,0.04)" }}
      content={<ChartTooltipContent className={className} />}
      {...props}
    />
  );
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
}: {
  active?: boolean;
  payload?: Array<any>;
  label?: unknown;
  className?: string;
}) {
  const { config } = useChart();

  if (!active || !payload?.length) return null;

  return (
    <div
      className={cn(
        "rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-950 shadow-sm",
        className,
      )}
    >
      {label ? <div className="mb-2 font-medium">{String(label)}</div> : null}
      <div className="space-y-1">
        {payload.map((item) => {
          const key = String(item.dataKey ?? "");
          const series = config[key];
          const color =
            series?.color ??
            (typeof item.color === "string" ? item.color : "currentColor");
          const display = series?.label ?? key;

          return (
            <div key={key} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-[3px]"
                  style={{ backgroundColor: color }}
                />
                <span className="text-zinc-600">{display}</span>
              </div>
              <span className="font-medium tabular-nums text-zinc-950">
                {typeof item.value === "number" ? item.value : String(item.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ChartLegend({ className }: { className?: string }) {
  return (
    <Legend
      verticalAlign="bottom"
      height={30}
      content={<ChartLegendContent className={className} />}
    />
  );
}

export function ChartLegendContent({
  payload,
  className,
}: {
  payload?: Array<{ dataKey?: string; color?: string; value?: string }>;
  className?: string;
}) {
  const { config } = useChart();
  if (!payload?.length) return null;

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-4", className)}>
      {payload.map((item) => {
        const key = String(item.dataKey ?? "");
        const series = config[key];
        const color = series?.color ?? item.color ?? "currentColor";
        const label = series?.label ?? item.value ?? key;
        return (
          <div key={key} className="flex items-center gap-2 text-xs text-zinc-600">
            <span
              className="h-2 w-2 rounded-[3px]"
              style={{ backgroundColor: color }}
            />
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

