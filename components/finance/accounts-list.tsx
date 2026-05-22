import { Banknote, CircleDollarSign, Coins, CreditCard, Landmark, PiggyBank, Smartphone, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { accounts } from "@/lib/mock/accounts";
import { getMemberName } from "@/lib/mock/members";
import type { Account, AccountKind } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

const ICON_MAP: Record<AccountKind, React.ComponentType<{ className?: string }>> = {
  efectivo: Banknote,
  "caja-ahorro": Landmark,
  "cuenta-remunerada": PiggyBank,
  billetera: Smartphone,
  dolares: CircleDollarSign,
  fci: Wallet,
  "plazo-fijo": Coins,
  cripto: CreditCard,
};

const LABEL_MAP: Record<AccountKind, string> = {
  efectivo: "Efectivo",
  "caja-ahorro": "Caja de ahorro",
  "cuenta-remunerada": "Cuenta remunerada",
  billetera: "Billetera virtual",
  dolares: "Dólares",
  fci: "Fondo común",
  "plazo-fijo": "Plazo fijo",
  cripto: "Cripto",
};

export function AccountsList({ title = "Cuentas y bolsillos" }: { title?: string }) {
  const total = accounts.reduce((acc, a) => acc + a.balance, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        <p className="text-xs text-muted-foreground">
          Saldo total: <span className="font-medium text-foreground">{formatCurrency(total)}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {accounts.map((a) => (
          <AccountRow key={a.id} account={a} />
        ))}
      </CardContent>
    </Card>
  );
}

function AccountRow({ account }: { account: Account }) {
  const Icon = ICON_MAP[account.kind];
  return (
    <div className="flex items-center gap-3 rounded-xl border p-3">
      <div
        className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0")}
        style={{ backgroundColor: `${account.color ?? "#0d9488"}1A`, color: account.color ?? "#0d9488" }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium truncate">{account.name}</p>
          {account.isSaving && (
            <Badge variant="success" className="text-[10px]">Ahorro</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {LABEL_MAP[account.kind]}
          {account.memberId && ` · ${getMemberName(account.memberId)}`}
          {account.currency === "USD" && " · USD"}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold tabular-nums">{formatCurrency(account.balance)}</p>
        {account.notes && (
          <p className="text-[10px] text-muted-foreground max-w-[160px] truncate">{account.notes}</p>
        )}
      </div>
    </div>
  );
}
