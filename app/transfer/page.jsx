"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Panel from "../../components/ui/Panel";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import StepIndicator from "../../components/banking/StepIndicator";
import AccountRadioGroup from "../../components/banking/AccountRadioGroup";
import { useBank } from "../../context/BankContext";

function findAccount(accounts, id) {
  return accounts.find(a => String(a.id) === String(id));
}

export default function TransferPage() {
  const router = useRouter();
  const { loading, error, accounts, makeTransfer } = useBank();

  const [step, setStep] = useState(1); // 1 Origen, 2 Destino, 3 Monto+Datos, 4 Resumen
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [form, setForm] = useState({
    origen: "",
    destino: "",
    monto: "",
    conceptoDebito: "",
    conceptoCredito: "",
    referencia: "",
    emailConfirm: "",
  });

  const origenObj  = useMemo(() => findAccount(accounts, form.origen), [accounts, form.origen]);
  const destinoObj = useMemo(() => findAccount(accounts, form.destino), [accounts, form.destino]);
  const balanceOrigen = Number(origenObj?.balance || 0);
  const montoNum = Number(form.monto || 0);

  // Validaciones
  const origenError  = step === 1 && !form.origen ? "Selecciona una cuenta de origen." : "";
  const destinoError = step === 2 && (
    !form.destino ? "Selecciona una cuenta de destino." :
    form.destino === form.origen ? "No puedes transferir a la misma cuenta." : ""
  );
  const montoError = step === 3 && (() => {
    if (form.monto === "") return "Ingresa un monto.";
    if (Number.isNaN(montoNum)) return "Monto inválido.";
    if (montoNum <= 0) return "El monto debe ser mayor que 0.";
    if (montoNum > balanceOrigen) return "El monto excede el saldo disponible.";
    return "";
  })();
  const datosError = step === 3 && (() => {
    if (!form.conceptoDebito) return "Ingresa un motivo de débito.";
    if (form.emailConfirm && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailConfirm)) {
      return "Correo de confirmación inválido.";
    }
    return "";
  })();

  const canNext =
    (step === 1 && !origenError) ||
    (step === 2 && !destinoError) ||
    (step === 3 && !montoError && !datosError) ||
    (step === 4);

  const next = () => setStep(s => Math.min(4, s + 1));
  const prev = () => setStep(s => Math.max(1, s - 1));

  async function onSubmit() {
    if (hasSubmitted) return;
    if (montoError || destinoError || origenError || datosError) {
      setErrorMsg(montoError || destinoError || origenError || datosError || "Revisa los datos del formulario.");
      return;
    }
    try {
      setErrorMsg(""); setSubmitting(true);
      const res = await makeTransfer({ originId: origenObj.id, destId: destinoObj.id, amount: Number(montoNum) });
      setSuccess(res); setHasSubmitted(true);

      // Aviso rápido y redirigir al Dashboard (para evitar errores)
      setTimeout(() => { router.push("/?tx=ok"); }, 1200);
    } catch (e) {
      setErrorMsg(e.message || "Ocurrió un error al crear la transferencia.");
    } finally {
      setSubmitting(false);
    }
  }

  const cuentasOrigen  = accounts;
  const cuentasDestino = accounts.filter(a => String(a.id) !== String(form.origen));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Transferir</h1>

      {error && (
        <div className="rounded-2xl bg-red-50 text-red-700 p-4">
          Error al cargar: {error}
        </div>
      )}

      <Panel>
        <StepIndicator step={step} total={4} />
        <div className="h-px bg-gray-100 mt-6" />

        <div className="p-6 space-y-6">
          {errorMsg && <div className="rounded-xl bg-red-50 text-red-700 text-sm p-3">{errorMsg}</div>}

          {/* Paso 1: Origen */}
          {step === 1 && (
            <>
              {loading ? (
                <div className="h-24 bg-gray-200 rounded-xl animate-pulse" />
              ) : (
                <AccountRadioGroup
                  label="Selecciona la cuenta a debitar"
                  accounts={cuentasOrigen}
                  value={form.origen}
                  onChange={(id)=>setForm({...form, origen: id, destino: form.destino === id ? "" : form.destino})}
                />
              )}
              {origenError && <div className="text-xs text-red-600">{origenError}</div>}
            </>
          )}

          {/* Paso 2: Destino */}
          {step === 2 && (
            <>
              {loading ? (
                <div className="h-24 bg-gray-200 rounded-xl animate-pulse" />
              ) : (
                <AccountRadioGroup
                  label="Selecciona la cuenta a acreditar"
                  accounts={cuentasDestino}
                  value={form.destino}
                  onChange={(id)=>setForm({...form, destino: id})}
                />
              )}
              {destinoError && <div className="text-xs text-red-600">{destinoError}</div>}
            </>
          )}

          {/* Paso 3: Monto + Datos */}
          {step === 3 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Monto a transferir"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.monto}
                  onChange={e=>setForm({...form, monto: e.target.value})}
                />
                {montoError && <div className="mt-1 text-xs text-red-600">{montoError}</div>}
                {origenObj && (
                  <div className="mt-2 text-xs text-gray-500">
                    Saldo disponible: <b>{balanceOrigen.toLocaleString("es-NI")} {origenObj.currency === "NIO" ? "C$" : origenObj.currency}</b>
                  </div>
                )}
              </div>

              <Input
                label="Motivo / Concepto de débito"
                placeholder="Ej: Cancelación de préstamo"
                value={form.conceptoDebito}
                onChange={e=>setForm({...form, conceptoDebito: e.target.value})}
              />
              <Input
                label="Concepto de crédito"
                placeholder="(opcional)"
                value={form.conceptoCredito}
                onChange={e=>setForm({...form, conceptoCredito: e.target.value})}
              />
              <Input
                label="Referencia"
                placeholder="(opcional)"
                value={form.referencia}
                onChange={e=>setForm({...form, referencia: e.target.value})}
              />
              <Input
                label="Enviar confirmación a:"
                type="email"
                placeholder="correo@ejemplo.com (opcional)"
                value={form.emailConfirm}
                onChange={e=>setForm({...form, emailConfirm: e.target.value})}
              />

              {datosError && <div className="text-xs text-red-600 sm:col-span-2">{datosError}</div>}
            </div>
          )}

          {/* Paso 4: Resumen + Confirmar */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-sm text-gray-500">Cuenta origen</div>
                  <div className="font-medium">
                    {origenObj ? `${origenObj.alias || "Cuenta"} • ${origenObj.display_number || origenObj.account_number || origenObj.id}` : "—"}
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-sm text-gray-500">Cuenta destino</div>
                  <div className="font-medium">
                    {destinoObj ? `${destinoObj.alias || "Cuenta"} • ${destinoObj.display_number || destinoObj.account_number || destinoObj.id}` : "—"}
                  </div>
                </div>
                <div className="rounded-xl bg-gray-50 p-4">
                  <div className="text-sm text-gray-500">Monto</div>
                  <div className="font-medium">
                    {Number(montoNum || 0).toLocaleString()} {origenObj?.currency === "NIO" ? "C$" : (origenObj?.currency || "")}
                  </div>
                </div>
                {form.conceptoDebito && (
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="text-sm text-gray-500">Motivo</div>
                    <div className="font-medium">{form.conceptoDebito}</div>
                  </div>
                )}
                {form.referencia && (
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="text-sm text-gray-500">Referencia</div>
                    <div className="font-medium">{form.referencia}</div>
                  </div>
                )}
                {form.emailConfirm && (
                  <div className="rounded-xl bg-gray-50 p-4">
                    <div className="text-sm text-gray-500">Confirmación a</div>
                    <div className="font-medium">{form.emailConfirm}</div>
                  </div>
                )}
              </div>

              {success && (
                <div className="rounded-xl bg-emerald-50 text-emerald-800 p-4 text-sm">
                  ✅ Transferencia creada. N.º de transacción: <b>{success.transaction_number}</b>
                </div>
              )}
            </div>
          )}

          {/* Botonera */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={prev} disabled={step===1 || submitting || hasSubmitted}>Atrás</Button>
            {step < 4 ? (
              <Button onClick={next} disabled={!canNext || submitting || hasSubmitted}>Continuar</Button>
            ) : (
              <Button onClick={onSubmit} disabled={submitting || hasSubmitted || !!montoError || !!destinoError || !!origenError || !!datosError}>
                {submitting ? "Procesando..." : hasSubmitted ? "Confirmado" : "Confirmar"}
              </Button>
            )}
          </div>
        </div>
      </Panel>
    </div>
  );
}
