"use client";
import { formatDate, formatTime } from "@/lib/date-formats";
import { numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { FaDownload } from "react-icons/fa";
import { Button, Preset } from "../button/button";
import { ButtonDownloadGet } from "../button/button-download-get";
import Modal from "../modal/Modal";


export interface CutDetailsModalProps {
  onClose: () => void;
  isShow: boolean;
  record?: any;
}

export function CutDetailsModal(props: CutDetailsModalProps) {
    const { onClose, isShow, record } = props;
    const { system } = useConfigStore();

    if (!record || !isShow) return null;


    const setStatus =(status: number)=> {
      switch (status) {
        case 0: return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">Eliminado</span>;
        case 1: return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">Abierto</span>;
        case 2: return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Cerrado</span>;
        default: return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">Desconocido</span>;
      }
    }


  return (
    <Modal show={isShow} onClose={onClose} size="lg" headerTitle="Detalles del corte" closeOnOverlayClick={false} hideCloseButton={false}>
      <Modal.Body>
        <div className="p-4 space-y-6"> {/* Main padding and spacing */}

          {/* Header Section */}
          <div className="text-center mb-3">
            <p className="text-lg text-gray-700">Cajero: <span className="font-semibold">{record?.employee?.name}</span></p>
            <p className="text-lg text-gray-700 uppercase mb-2">Caja: <span className="font-semibold">{record?.cashdrawer?.name}</span></p>
            <div className="flex justify-center">
              { setStatus(record?.status) }
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-4">
              <span>Apertura: { formatDate(record?.opening)} | {formatTime(record?.opening)}</span>
              <span>Cierre: { formatDate(record?.close)} | {formatTime(record?.close)}</span>
            </div>
          </div>

          {/* Key Metrics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <div className="bg-gray-50 rounded-lg shadow-sm p-2 text-center">
              <div className="text-gray-600 text-sm mb-1">Efectivo Apertura</div>
              <div className="font-bold text-2xl text-gray-900">
                { numberToMoney(record?.inicial_cash ? record?.inicial_cash : 0, system) }
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg shadow-sm p-2 text-center">
              <div className="text-gray-600 text-sm mb-1">Efectivo Cierre</div>
              <div className="font-bold text-2xl text-gray-900">
                { numberToMoney(record?.final_cash ? record?.final_cash : 0, system) }
              </div>
            </div>
          </div>

          {/* Detailed Metrics Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Detalles Financieros</h3>
            <div className="space-y-2">
              {/* Sales */}
              <div className="flex justify-between items-center text-gray-700">
                <span>Ventas Efectivo:</span>
                <span className="font-medium">{ numberToMoney(record?.sales_cash ? record?.sales_cash : 0, system) }</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span>Total ventas:</span>
                <span className="font-medium">{ numberToMoney(record?.sales_total ? record?.sales_total : 0, system) }</span>
              </div>
              {/* Expenses */}
              <div className="flex justify-between items-center text-gray-700">
                <span>Gastos Efectivo:</span>
                <span className="font-medium">{ numberToMoney(record?.bills_cash ? record?.bills_cash : 0, system) }</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span>Total Gastos:</span>
                <span className="font-medium">{ numberToMoney(record?.bills_total ? record?.bills_total : 0, system) }</span>
              </div>
              {/* Remittances */}
              <div className="flex justify-between items-center text-gray-700">
                <span>Remesas:</span>
                <span className="font-medium">{ numberToMoney(record?.remittances ? record?.remittances : 0, system) }</span>
              </div>
              {/* Payments Payable */}
              <div className="flex justify-between items-center text-gray-700">
                <span>Cuentas por pagar Efectivo:</span>
                <span className="font-medium">{ numberToMoney(record?.payments_payable_cash ? record?.payments_payable_cash : 0, system) }</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span>Total Cuentas por pagar:</span>
                <span className="font-medium">{ numberToMoney(record?.payments_payable_total ? record?.payments_payable_total : 0, system) }</span>
              </div>
              {/* Payments Receivable */}
              <div className="flex justify-between items-center text-gray-700">
                <span>Cuentas por cobrar Efectivo:</span>
                <span className="font-medium">{ numberToMoney(record?.payments_receivable_cash ? record?.payments_receivable_cash : 0, system) }</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span>Total Cuentas por cobrar:</span>
                <span className="font-medium">{ numberToMoney(record?.payments_receivable_total ? record?.payments_receivable_total : 0, system) }</span>
              </div>
              {/* Retentions */}
              <div className="flex justify-between items-center text-gray-700">
                <span>Retenciones Efectivo:</span>
                <span className="font-medium">{ numberToMoney(record?.sales_cash_retention ? record?.sales_cash_retention : 0, system) }</span>
              </div>
              <div className="flex justify-between items-center text-gray-700">
                <span>Total Retenciones:</span>
                <span className="font-medium">{ numberToMoney(record?.sales_total_retention ? record?.sales_total_retention : 0, system) }</span>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <div className="bg-gray-50 rounded-lg shadow-sm p-4 text-center">
              <div className="text-gray-600 text-sm mb-1">Efectivo en Caja</div>
              <div className="font-bold text-2xl text-gray-900">
                { numberToMoney(record?.final_cash ? record?.final_cash : 0, system) }
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg shadow-sm p-4 text-center">
              <div className="text-gray-600 text-sm mb-1">Diferencia</div>
              <div className={`font-bold text-2xl ${record && record.cash_diference < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                { numberToMoney(record?.cash_diference ? record?.cash_diference : 0, system) }
              </div>
            </div>
          </div>

        </div>
      </Modal.Body>
      <Modal.Footer>
        <ButtonDownloadGet href={`id=${record.id}&route=download.pdf.cut`}><FaDownload  size={24}/></ButtonDownloadGet>
        <Button onClick={onClose} preset={Preset.close} disabled={false} />
      </Modal.Footer>
    </Modal>
  );

}

