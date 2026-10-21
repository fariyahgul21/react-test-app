export default function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        {Icon && (
          <span className="rounded-lg bg-brand-50 p-2 text-brand-700">
            <Icon size={18} />
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
