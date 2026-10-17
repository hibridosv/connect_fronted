import { useCountries } from "@/hooks/locations/useCountries";
import { useDepartaments } from "@/hooks/locations/useDepartaments";
import { Contact } from "@/interfaces/contact";
import { formatDateAsDMY } from "@/lib/date-formats";
import { formatDuiWithAll, getCountryNameByCode, getDepartmentNameById, getMunicipioNameById, numberToMoney } from "@/lib/utils";
import useConfigStore from "@/stores/configStore";
import { BiCheckCircle } from "react-icons/bi";

export interface ContactDetailsSVPropd {
  isShow: boolean;
  record: Contact;
}

export function ContactDetailsSV(props: ContactDetailsSVPropd) {
  const { isShow, record } = props;
  const { system, activeConfig } = useConfigStore();
  const { departaments } = useDepartaments();
  const { countries } = useCountries();

  if (!isShow) return null;


  return (
    <div className="flex flex-col gap-2"> 
      <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-2">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center text-text-base">
            {record?.is_client ? <BiCheckCircle className="text-success mr-1" /> : null} 
            <span className={`font-medium ${!record?.is_client ? 'text-text-muted' : ''}`}>Cliente</span>
          </div>
          <div className="flex items-center text-text-base">
            {record?.is_provider ? <BiCheckCircle className="text-success mr-1" /> : null} 
            <span className={`font-medium ${!record?.is_provider ? 'text-text-muted' : ''}`}>Proveedor</span>
          </div>
          <div className="flex items-center text-text-base">
            {record?.is_employee ? <BiCheckCircle className="text-success mr-1" /> : null} 
            <span className={`font-medium ${!record?.is_employee ? 'text-text-muted' : ''}`}>Repartidor</span>
          </div>
          <div className="flex items-center text-text-base">
            {record?.is_referred ? <BiCheckCircle className="text-success mr-1" /> : null} 
            <span className={`font-medium ${!record?.is_referred ? 'text-text-muted' : ''}`}>Referido</span>
          </div>
        </div>
      </div>

      {/* Card 2: Información General */}
      <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-2">
        <h3 className="text-lg font-semibold text-text-base mb-2">Información General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2"> 
          {record?.name && (
            <div>
              <div className="text-text-muted text-xs uppercase font-medium">Nombre completo *</div>
              <div className="text-text-base text-sm font-semibold">{record?.name}</div>
            </div>
          )}

          {record?.code && (
            <div>
              <div className="text-text-muted text-xs uppercase font-medium">{system?.system?.contact_search ?? "Código"}</div>
              <div className="text-text-base text-sm font-semibold">{record?.code}</div>
            </div>
          )}

          {record?.id_number && (
            <div>
              <div className="text-text-muted text-xs uppercase font-medium">Numero de documento</div>
              <div className="text-text-base text-sm font-semibold">{formatDuiWithAll(record?.id_number)}</div>
            </div>
          )}

          {record?.phone && (
            <div>
              <div className="text-text-muted text-xs uppercase font-medium">Teléfono</div>
              <div className="text-text-base text-sm font-semibold">{record?.phone}</div>
            </div>
          )}

          {record?.address && (
            <div className="md:col-span-2">
              <div className="text-text-muted text-xs uppercase font-medium">Dirección</div>
              <div className="text-text-base text-sm font-semibold">{record?.address}</div>
            </div>
          )}

          {record?.email && (
            <div>
              <div className="text-text-muted text-xs uppercase font-medium">Email</div>
              <div className="text-text-base text-sm font-semibold">{record?.email}</div>
            </div>
          )}

          {record?.birthday && (
            <div>
              <div className="text-text-muted text-xs uppercase font-medium">Fecha de nacimiento</div>
              <div className="text-text-base text-sm font-semibold">{formatDateAsDMY(record?.birthday)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Card 3: Información Fiscal y Legal */}
      <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-2">
        <h3 className="text-lg font-semibold text-text-base mb-2">Información Fiscal</h3> 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2"> 
          {record?.taxpayer && (
            <div className="md:col-span-2">
              <div className="text-text-muted text-xs uppercase font-medium">Nombre del contribuyente</div>
              <div className="text-text-base text-sm font-semibold">{record?.taxpayer}</div>
            </div>
          )}

          {record?.document && (
            <div>
              <div className="text-text-muted text-xs uppercase font-medium">Documento</div>
              <div className="text-text-base text-sm font-semibold">{formatDuiWithAll(record?.document)}</div>
            </div>
          )}

          {record?.register && (
            <div>
              <div className="text-text-muted text-xs uppercase font-medium">Registro</div>
              <div className="text-text-base text-sm font-semibold">{formatDuiWithAll(record?.register)}</div>
            </div>
          )}

          {record?.activity_code && (
            <div className="md:col-span-2">
              <div className="text-text-muted text-xs uppercase font-medium">Código de actividad (MH)</div>
              <div className="text-text-base text-sm font-semibold">{record?.activity_code}</div>
            </div>
          )}

          {record?.roar && (
            <div className="md:col-span-2">
              <div className="text-text-muted text-xs uppercase font-medium">Giro</div>
              <div className="text-text-base text-sm font-semibold">{record?.roar}</div>
            </div>
          )}

          {record?.address_doc && (
            <div className="md:col-span-2">
              <div className="text-text-muted text-xs uppercase font-medium">Dirección</div>
              <div className="text-text-base text-sm font-semibold">{record?.address_doc}</div>
            </div>
          )}

          {record?.departament_doc && (
            <div>
              <div className="text-text-muted text-xs uppercase font-medium">Departamento</div>
              <div className="text-text-base text-sm font-semibold">{getDepartmentNameById(record?.departament_doc, departaments)}</div>
            </div>
          )}

          {record?.town_doc && (
            <div>
              <div className="text-text-muted text-xs uppercase font-medium">Municipio</div>
              <div className="text-text-base text-sm font-semibold">{getMunicipioNameById(`${record?.departament_doc}${record?.town_doc}`, departaments)}</div>
            </div>
          )}

          {record?.taxpayer_type && (
            <div className="md:col-span-2">
              <div className="text-text-muted text-xs uppercase font-medium">Tipo de contribuyente</div>
              <div className="text-text-base text-sm font-semibold">
                {record?.taxpayer_type == 1 ? "CONTRIBUYENTE" : "GRAN CONTRIBUYENTE"}
              </div>
            </div>
          )}

          {activeConfig && activeConfig.includes("contact-country") && record?.country && (
            <div>
              <div className="text-text-muted text-xs uppercase font-medium">Pais</div>
              <div className="text-text-base text-sm font-semibold">{getCountryNameByCode(`${record?.country}`, countries)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Card 4: Estado y Otros Detalles */}
      { (record?.is_credit_block == 1 || record?.excluded == 1 || record?.employee_id || record?.credit_limit != null) && (
      <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-2">
        <h3 className="text-lg font-semibold text-text-base mb-2">Estado y Otros Detalles</h3> {/* Reduced mb */} 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2"> {/* Reduced gap-y */} 
          {record?.is_credit_block == 1 && (
            <div className="md:col-span-2">
              <div className="text-text-muted text-xs uppercase font-medium">Estado de Crédito</div>
              <div className="text-danger font-semibold">Cliente Bloqueado para créditos</div>
            </div>
          )}

          {record?.credit_limit != null && (
            <div className="md:col-span-2">
              <div className="text-text-muted text-xs uppercase font-medium">Límite de Crédito</div>
              <div className="text-text-base text-sm font-semibold">{numberToMoney(record.credit_limit, system)}</div>
            </div>
          )}

          {record?.excluded == 1 && (
            <div className="md:col-span-2">
              <div className="text-text-muted text-xs uppercase font-medium">Exención de Impuestos</div>
              <div className="text-danger font-semibold">Cliente Exento de impuestos</div>
            </div>
          )}

          {record?.employee_id && (
            <div className="md:col-span-2">
              <div className="text-text-muted text-xs uppercase font-medium">Vendedor Asignado</div>
              <div className="text-text-base text-sm font-semibold">{record?.employee?.name}</div>
            </div>
          )}
        </div>
      </div> 
      )}
    </div>
  );
}