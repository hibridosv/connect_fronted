import { Contact } from "@/interfaces/contact";
import { formatDuiWithAll } from "@/lib/utils";
import { BiCheckCircle } from "react-icons/bi";

export interface ContactDetailsHNProps {
  isShow: boolean;
  record: Contact;
}

export function ContactDetailsHN(props: ContactDetailsHNProps) {
  const { isShow, record } = props;

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

      <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-2">
        <h3 className="text-lg font-semibold text-text-base mb-2">Información General</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {record?.name && (
            <div className="md:col-span-2">
              <div className="text-text-muted text-xs uppercase font-medium">Nombre completo</div>
              <div className="text-text-base text-sm font-semibold">{record.name}</div>
            </div>
          )}
          {record?.id_number && (
            <div>
              <div className="text-text-muted text-xs uppercase font-medium">RTN</div>
              <div className="text-text-base text-sm font-semibold">{formatDuiWithAll(record.id_number)}</div>
            </div>
          )}
          {record?.phone && (
            <div>
              <div className="text-text-muted text-xs uppercase font-medium">Teléfono</div>
              <div className="text-text-base text-sm font-semibold">{record.phone}</div>
            </div>
          )}
          {record?.address && (
            <div className="md:col-span-2">
              <div className="text-text-muted text-xs uppercase font-medium">Dirección</div>
              <div className="text-text-base text-sm font-semibold">{record.address}</div>
            </div>
          )}
          {record?.email && (
            <div className="md:col-span-2">
              <div className="text-text-muted text-xs uppercase font-medium">Email</div>
              <div className="text-text-base text-sm font-semibold">{record.email}</div>
            </div>
          )}
        </div>
      </div>

      {record?.taxpayer && (
        <div className="bg-bg-content rounded-lg shadow-sm border border-bg-subtle p-2">
          <h3 className="text-lg font-semibold text-text-base mb-2">Contacto</h3>
          <div className="text-text-muted text-xs uppercase font-medium">Nombre del contacto</div>
          <div className="text-text-base text-sm font-semibold">{record.taxpayer}</div>
        </div>
      )}

    </div>
  );
}
