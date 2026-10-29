'use client'

import { Alert } from "@/components/Alert/Alert";
import { formatDateAsDMY } from "@/lib/date-formats";
import useConfigStore from "@/stores/configStore";
import productRemovedStore from "@/stores/products/productRemovedStore";

const types: Record<number, string> = { 1: 'averías', 2: 'traslados', 3: 'devoluciones', 4: 'cambios', 5: 'otros' };

/** Avisa que otros empleados tienen un registro de salida abierto sin guardar (solo su dueño puede terminarlo) */
export function OpenRegistersNotice() {
    const { openRegisters } = productRemovedStore();
    const { user } = useConfigStore();

    const others = (openRegisters ?? []).filter((register: any) => register.employee_id !== user?.id);
    if (others.length === 0) return null;

    const text = others
        .map((register: any) => `${register.employee?.name ?? 'Un empleado'} tiene un registro de ${types[register.type] ?? 'salida'} sin terminar desde el ${formatDateAsDMY(register.created_at)}`)
        .join('. ');

    return <Alert type="warning" title="Registros sin terminar" text={`${text}. Solo quien lo abrió puede guardarlo o cancelarlo.`} />;
}
