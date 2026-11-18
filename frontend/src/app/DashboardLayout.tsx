import type { ReactNode } from "react";

type DashboardLayoutProps = {
  statusBar: ReactNode;
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
};

/** Pantalla completa sin scroll en escritorio; en móvil las columnas se apilan. */
export function DashboardLayout({ statusBar, left, center, right }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col gap-3 p-3 md:h-dvh md:overflow-hidden">
      {statusBar}
      <main className="grid min-h-0 flex-1 grid-cols-1 gap-3 md:grid-cols-[220px_minmax(0,1fr)_220px] xl:grid-cols-[260px_minmax(0,1fr)_260px]">
        <div className="order-2 flex min-h-0 flex-col gap-3 md:order-none">{left}</div>
        <div className="order-1 flex min-h-[70dvh] flex-col md:order-none md:min-h-0">{center}</div>
        <div className="order-3 flex min-h-0 flex-col gap-3 md:order-none">{right}</div>
      </main>
    </div>
  );
}
