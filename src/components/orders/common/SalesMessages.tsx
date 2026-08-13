
import { Alert } from "@/components/Alert/Alert";
import { getCountryProperty, isRestaurant } from "@/lib/utils";
import { requiredFieldsCCF, validateInvoiceFields } from "@/lib/validator-functions";
import useConfigStore from "@/stores/configStore";
import ordersStore from "@/stores/orders/ordersStore";
import useTempStorage from "@/stores/useTempStorage";
import { sumarSubtotal, sumarTotalRetentionRenta, sumarTotalRetentionSujetoExcluido } from "../utils";



export function SalesMessages() {
  const { order } = ordersStore();
  const { cashdrawer, tenant, system } = useConfigStore();
  const { getElement} = useTempStorage();
  const payMethod = getElement('payMethod') ?? 1;

  if (!order) return <></>
  
  const validateFields = ()=>{
      if (order?.client_id && order?.invoice_assigned?.type == 3) {
        return validateInvoiceFields(order?.client, requiredFieldsCCF) 
      }
    }
  let fieldsRequired = validateFields();
  let isSuspended = tenant?.status == 2 ? true : false;
  const isCreditActive = payMethod == 5 && !order?.client_id;

  const retentionSujetoExcluido = sumarTotalRetentionSujetoExcluido(order);
  const retentionRenta = sumarTotalRetentionRenta(order);

  return (
    <div className="">

            <div className="space-y-2 text-sm">
              {order?.invoice_assigned?.type === 4 && retentionSujetoExcluido > 0 && (
                <div className="rounded-md bg-danger/10 p-2 text-center font-semibold text-danger">
                  Retención Sujeto Excluido: {getCountryProperty(parseInt(system?.country)).currency} {retentionSujetoExcluido.toFixed(2)}
                </div>
              )}
              
              {(order?.retention_rent ?? 0) > 0 && retentionRenta > 0 && (
                <div className="rounded-md bg-danger/10 p-2 text-center font-semibold text-danger">
                  Retención Renta: {getCountryProperty(parseInt(system?.country)).currency} {retentionRenta.toFixed(2)}
                </div>
              )}
            </div>
        
        { (payMethod == 7 && isRestaurant(tenant?.system)) && 
          <Alert type="danger" text="Ingrese el monto en efectivo el resto se cobrara con tarjeta" isDismissible={false} className='my-1' />
        }

        { (order?.client?.taxpayer_type == 2 && sumarSubtotal(order?.invoiceproducts) >= 100) && 
          <Alert type="info" title="Atención" text="Factura con retención del 1%" isDismissible={false} className='my-1' />
           }

        { (order?.invoice_assigned?.type == 8) && 
          <Alert type="info" title="Atención" text="Las notas de envío no afectan el efectivo" isDismissible={false} className='my-1' />
        }

        { (order?.client?.excluded == 1) && 
          <Alert type="info" title="Atención" text="Cliente Exento de impuestos" isDismissible={false} className='my-1' />
        }

        { !cashdrawer && 
        <Alert type="danger" title="Error" text="Debe seleccionar una caja para poder cobrar" isDismissible={false} className='my-1' /> 
        }

        { isSuspended && 
        <Alert type="danger" title="Error" text="Su cuenta está suspendida por falta de pago" isDismissible={false} className='my-1' /> 
        }

        { isCreditActive && isRestaurant(tenant?.system) &&
        <Alert type="danger" title="Error" text="Seleccione un cliente para otorgar crédito" isDismissible={false} className='my-1' /> 
        }

        { (!order?.client_id && (order?.invoice_assigned?.type == 3 || order?.invoice_assigned?.type == 4)) &&
        <Alert type="danger" title="Error" text={`Seleccione un cliente para el ${order?.invoice_assigned?.type == 3 ? "CCF" : "Sujeto Excluido"}`} isDismissible={false} /> 
        }

        { fieldsRequired && fieldsRequired.length > 0 &&
          <div className="rounded-lg border border-danger/20 bg-danger/10 p-2.5 text-sm text-text-base">
            Faltan los siguientes campos del cliente para facturar:
            <span className="ml-1 font-semibold text-danger">{`${fieldsRequired.join(', ')}.`}</span>
          </div>
        }
    </div>
  );
}
