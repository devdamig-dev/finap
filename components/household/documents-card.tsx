import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { documents } from "@/lib/mock/documents";
import { daysUntil, formatDate } from "@/lib/utils";

export function DocumentsCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Documentos importantes
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Carnés, pólizas y comprobantes al alcance
            </p>
          </div>
          <Button size="sm" variant="soft" className="text-xs">
            <Upload className="h-3.5 w-3.5" /> Subir
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {documents.map((d) => {
          const days = d.expiresAt ? daysUntil(d.expiresAt) : null;
          const expiring = days !== null && days >= 0 && days <= 60;
          return (
            <div key={d.id} className="flex items-center gap-3 rounded-xl border p-3">
              <div className="h-9 w-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{d.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {d.category} · {d.fileName}
                </p>
              </div>
              {d.expiresAt && (
                <Badge variant={expiring ? "warning" : "outline"} className="text-[10px]">
                  Vence {formatDate(d.expiresAt, { day: "2-digit", month: "short", year: "2-digit" })}
                </Badge>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
