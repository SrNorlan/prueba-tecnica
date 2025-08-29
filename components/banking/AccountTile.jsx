import Card from "../ui/Card";

export default function AccountTile({ title, number, balance, flag = "🇺🇸" }) {
  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="text-[15px] font-semibold">{title}</div>
        <img src={flag} alt="flag" className="h-6 w-6 rounded-full object-cover" />
      </div>

      <div className="mt-1">
        <span className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md text-xs">
          {number}
          <span className="text-gray-400">📋</span>
        </span>
      </div>
      <div className="mt-4 text-xl font-bold">{balance}</div>
    </Card>
  );
}
