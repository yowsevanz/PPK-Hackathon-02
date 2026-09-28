"use client";

type MonthPickerProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export default function MonthPicker({ value, onChange, disabled = false }: MonthPickerProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      Bulan anggaran
      <input
        aria-label="Pilih bulan dan tahun anggaran"
        className="h-11 rounded-xl border border-slate-200 bg-white px-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        type="month"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />
    </label>
  );
}
