"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const SEASONS = ["Winter", "Spring", "Fall"] as const;
const YEARS = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() - 2 + i,
);

type Props = {
  startTerm: { season: string; year: number };
  endTerm: { season: string; year: number };
  onStartTermChange: (term: { season: string; year: number }) => void;
  onEndTermChange: (term: { season: string; year: number }) => void;
};

export function TermRangeSelector({
  startTerm,
  endTerm,
  onStartTermChange,
  onEndTermChange,
}: Props) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">From:</span>
        <Select
          value={startTerm.season}
          onValueChange={(season) =>
            onStartTermChange({ ...startTerm, season })
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SEASONS.map((season) => (
              <SelectItem key={season} value={season}>
                {season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={startTerm.year.toString()}
          onValueChange={(year) =>
            onStartTermChange({ ...startTerm, year: parseInt(year) })
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">To:</span>
        <Select
          value={endTerm.season}
          onValueChange={(season) => onEndTermChange({ ...endTerm, season })}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SEASONS.map((season) => (
              <SelectItem key={season} value={season}>
                {season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={endTerm.year.toString()}
          onValueChange={(year) =>
            onEndTermChange({ ...endTerm, year: parseInt(year) })
          }
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {YEARS.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}