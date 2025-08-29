import Select from "../ui/Select";

export default function AccountPicker({ accounts=[], value, onChange }) {
  // formato utilizando con alias + número + balance a como se mostro en el diseño de figma
  return (
    <div className="relative">
      <Select
        label="Cuenta"
        value={value}
        onChange={e=>onChange(e.target.value)}
        options={accounts.map(a=>({ value: a.id, label: `${a.alias}  •  ${a.account_number}  •  ${a.currency} ${a.balance.toLocaleString()}` }))}
      />
      <span className="absolute right-3 top-[38px] text-gray-500">▾</span>
    </div>
  );
}
