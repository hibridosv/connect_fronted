'use client';
import { useContactsAddLogic } from "@/hooks/contacts/useContactsAddLogic";
import { useCountries } from "@/hooks/locations/useCountries";
import { useEconomicActivities } from "@/hooks/locations/useEconomicActivities";
import { useDepartaments } from "@/hooks/locations/useDepartaments";
import { useRecintosFiscales, useRegimenesExportacion } from "@/hooks/locations/useExportCatalogs";
import { useTownByDepartament } from "@/hooks/locations/useTownByDepartaments";
import { Contact } from "@/interfaces/contact";
import useConfigStore from "@/stores/configStore";
import useContactStore from "@/stores/ContactStore";
import useUserStore from "@/stores/UserStore";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Preset } from "../button/button";
import { SkeletonContactAddSV } from "../skeleton/SkeletonContactAddSV";
import { CatalogSearchSelect } from "./CatalogSearchSelect";
import { EconomicActivitySelect } from "./EconomicActivitySelect";
import { getParamString } from "./utils";
import { FiAlertTriangle } from "react-icons/fi";

// marca de un campo que Hacienda rechazo (contacts/[id]/edit?dte=, contactFieldHints de DteDiagnosisList)
const markClass = (hint?: string) => hint ? ' border-danger ring-2 ring-danger/30' : '';

function FieldHint({ hint }: { hint?: string }) {
  if (!hint) return null;
  return (
    <p className="text-xs text-danger mt-1 flex items-start gap-1">
      <FiAlertTriangle size={12} className="shrink-0 mt-0.5" /> {hint}
    </p>
  );
}

// orden del formulario: se hace scroll al primero que este marcado
const MARK_ORDER: [string, string][] = [
  ['id_number', 'id_number'], ['email', 'email'], ['document', 'document'], ['register', 'register'], ['activity_code', 'activity_code_search'],
  ['roar', 'roar'], ['address_doc', 'address_doc'], ['departament_doc', 'departament_doc'], ['town_doc', 'town_doc'],
];

export interface ContactAddSVPropd {
  isShow: boolean;
  record: Contact;
  highlight?: Record<string, string>; // campos a marcar con su indicacion (solo la pagina de editar contacto)
}

export function ContactAddSV(props: ContactAddSVPropd) {
  const { isShow, record, highlight } = props;
  const { system, activeConfig } = useConfigStore();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } = useForm();
  const { departaments } = useDepartaments();
  const { countries } = useCountries();
  const { activities } = useEconomicActivities();
  const { recintos } = useRecintosFiscales();
  const { regimenes } = useRegimenesExportacion();
  let selectDepartament =  (watch("departament_doc")) ? watch("departament_doc") : departaments && departaments.departamentos[0].id;
  const { townsExtracted } = useTownByDepartament(departaments, selectDepartament);
  let regex =  (watch("country") == "SV") ? "^([0-9]{8}-[0-9]{1}|[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]{1})?$" : "^[a-zA-Z0-9-]+$";
  const { onSubmit } = useContactsAddLogic(isShow, record, setValue, departaments, countries, townsExtracted,  getParamString(pageParam));
  const { saving } = useContactStore();
  const { users, loading: loadingUsers} = useUserStore();

  // datos de exportacion (CAT-027/028/033): colapsados salvo que el contacto ya tenga alguno cargado
  const [showExportFields, setShowExportFields] = useState(false);
  useEffect(() => {
    if (record && (record.recinto_fiscal || record.tipo_regimen || record.regimen)) {
      setShowExportFields(true);
    }
  }, [record]);

  const isSellerActive = activeConfig && activeConfig.includes("contact-user-seller");
  const isCountryActive = activeConfig && activeConfig.includes("contact-country");
  const isContactExcluded = activeConfig && activeConfig.includes("contact-excluded");
  const isContactCodeActive = activeConfig &&  activeConfig.includes("contact-code");

  const isLoading = !departaments || !countries || !activities || !townsExtracted.length || (isSellerActive && loadingUsers);

  // con campos marcados, al terminar de cargar se lleva al primero (una sola vez, no mientras se escribe)
  const scrolledToMark = useRef(false);
  useEffect(() => {
    if (isLoading || !highlight || scrolledToMark.current) return;
    const first = MARK_ORDER.find(([field]) => highlight[field]);
    const element = first ? window.document.getElementById(first[1]) : null;
    if (!element) return;
    scrolledToMark.current = true;
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    (element as HTMLElement).focus({ preventScroll: true });
  }, [isLoading, highlight]);

  if (!isShow) return null;

  if (isLoading) return <SkeletonContactAddSV />;

  return (
    <div className="p-2"> 
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap -mx-3">

            <div className="w-full md:w-full px-3 mb-2 flex justify-between">
                <div><input className="bg-lime-600 rounded-full" type="checkbox" {...register("is_client", {})} /> 
                <span className="ml-2 font-medium">Cliente</span></div>
                <div><input className="bg-lime-600 rounded-full" type="checkbox" {...register("is_provider", {})} /> 
                <span className="ml-2 font-medium">Proveedor</span></div>
                <div><input className="bg-lime-600 rounded-full" type="checkbox" {...register("is_employee", {})} /> 
                <span className="ml-2 font-medium">Repartidor</span></div>
                <div><input className="bg-lime-600 rounded-full" type="checkbox" {...register("is_referred", {})} /> 
                <span className="ml-2 font-medium">Referido</span></div>
            </div>

            <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="name" className="input-label">Nombre completo *</label>
                <input type="text" id="name" {...register("name", { required: true })} 
                onBlur={(e) => setValue('taxpayer', e.target.value)} className="input" />
            </div>

            {
              isContactCodeActive && 
              <div className="w-full md:w-full px-3 mb-2">
                  <label htmlFor="code" className="input-label">{ system?.contact_search ?? "Código"}</label>
                  <input type="text" id="code" {...register("code")} className="input" />
              </div> 
            }
            <div className="w-full md:w-1/2 px-3 mb-2">
                <label htmlFor="id_number" className="input-label">Numero de documento</label>
                <input type="text" id="id_number" {...register("id_number")} 
                 onBlur={(e) => setValue('document', e.target.value)} placeholder="0207-210690-102-9" pattern={regex} className={`input${markClass(highlight?.id_number)}`} />
                <FieldHint hint={highlight?.id_number} />
            </div> 

            <div className="w-full md:w-1/2 px-3 mb-2">
                <label htmlFor="phone" className="input-label">Tel&eacute;fono</label>
                <input type="text" id="phone" {...register("phone")} placeholder="22509885" pattern="(^[a-zA-Z0-9\+\(\)]{8,30}$|^$)" className="input" />
            </div> 

            <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="address" className="input-label">Dirección</label>
                <input type="text" id="address" {...register("address")} 
                onBlur={(e) => setValue('address_doc', e.target.value)} className="input" />
            </div>

            <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="email" className="input-label">Email</label>
                <input type="email" id="email" {...register("email")} className={`input${markClass(highlight?.email)}`} />
                <FieldHint hint={highlight?.email} />
            </div>

                            
            <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="birthday" className="input-label"> Fecha de nacimiento </label>
                <input type="date" id="birthday" {...register("birthday")} className="input" />
            </div>

           </div>

            <div className="w-full uppercase px-2 border-2 rounded-lg text-base font-bold text-center">Datos de contribuyente</div>
    
            <div className="mt-2">
                <div className="flex flex-wrap -mx-3">

                    <div className="w-full md:w-full px-3 mb-2">
                        <label htmlFor="taxpayer" className="input-label">Nombre del contribuyente</label>
                        <input type="text" id="taxpayer" {...register("taxpayer")} className="input" />
                    </div>
                
                    <div className="w-full md:w-1/2 px-3 mb-2">
                        <label htmlFor="document" className="input-label">Documento</label>
                        <input type="text" id="document" {...register("document")} placeholder="0207-210690-102-9" pattern={regex} className={`input${markClass(highlight?.document)}`} />
                        <FieldHint hint={highlight?.document} />
                    </div>

                    <div className="w-full md:w-1/2 px-3 mb-2">
                        <label htmlFor="register" className="input-label">Registro</label>
                        <input type="text" id="register" {...register("register")} placeholder="021545-9" pattern="^[0-9]{1,6}-[0-9]{1}?$" className={`input${markClass(highlight?.register)}`} />
                        <FieldHint hint={highlight?.register} />
                    </div>

                    <div className="w-full md:w-full px-3 mb-2">
                        <label htmlFor="activity_code_search" className="input-label">Actividad económica (MH)</label>
                        <input type="hidden" {...register("activity_code")} />
                        <div className={highlight?.activity_code ? 'rounded-lg ring-2 ring-danger/30' : ''}>
                        <EconomicActivitySelect activities={activities ?? []} value={watch("activity_code")}
                          onChange={(activity) => {
                            setValue("activity_code", activity ? activity.code : null);
                            if (activity) setValue("roar", activity.activity); // el giro toma la descripcion del CAT-019
                          }} />
                        </div>
                        <FieldHint hint={highlight?.activity_code} />
                    </div>

                    <div className="w-full md:w-full px-3 mb-2">
                        <label htmlFor="roar" className="input-label">Giro</label>
                        <input type="text" id="roar" {...register("roar")} maxLength={150} className={`input${markClass(highlight?.roar)}`} />
                        <FieldHint hint={highlight?.roar} />
                    </div>

                    <div className="w-full md:w-full px-3 mb-2">
                        <label htmlFor="address_doc" className="input-label">Dirección</label>
                        <input type="text" id="address_doc" {...register("address_doc")} className={`input${markClass(highlight?.address_doc)}`} />
                        <FieldHint hint={highlight?.address_doc} />
                    </div>

                    {!showExportFields && (
                      <div className="w-full px-3 mb-2">
                        <button type="button" onClick={() => setShowExportFields(true)}
                          className="text-sm text-primary hover:underline">
                          + Agregar datos de exportación
                        </button>
                      </div>
                    )}

                    {showExportFields && (
                      <>
                        <div className="w-full uppercase px-2 text-sm font-bold text-center text-text-muted">Datos de exportación (MH)</div>

                        <div className="w-full md:w-full px-3 mb-2">
                          <label htmlFor="tipo_regimen" className="input-label">Tipo de régimen (CAT-033)</label>
                          <select defaultValue="" id="tipo_regimen" {...register("tipo_regimen")} className="input-select">
                            <option value="">Sin definir</option>
                            <option value="EX-1">EX-1 - Exportación Definitiva</option>
                            <option value="EX-2">EX-2 - Exportación Temporal</option>
                            <option value="EX-3">EX-3 - Reexportación</option>
                            <option value="TA-1">TA-1 - Tránsito Aduanero</option>
                          </select>
                        </div>

                        <div className="w-full md:w-full px-3 mb-2">
                          <label htmlFor="recinto_fiscal_search" className="input-label">Recinto fiscal (CAT-027)</label>
                          <input type="hidden" {...register("recinto_fiscal")} />
                          <CatalogSearchSelect id="recinto_fiscal_search" placeholder="Buscar por código o nombre"
                            entries={recintos ?? []} value={watch("recinto_fiscal")}
                            onChange={(entry) => setValue("recinto_fiscal", entry ? entry.code : null)} />
                        </div>

                        <div className="w-full md:w-full px-3 mb-2">
                          <label htmlFor="regimen_search" className="input-label">Régimen (CAT-028)</label>
                          <input type="hidden" {...register("regimen")} />
                          <CatalogSearchSelect id="regimen_search" placeholder="Buscar por código o nombre"
                            entries={regimenes ?? []} value={watch("regimen")}
                            onChange={(entry) => setValue("regimen", entry ? entry.code : null)} />
                        </div>
                      </>
                    )}

                    <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="departament_doc" className="input-label"> Departamento </label>
                    <select defaultValue={departaments && departaments.departamentos[0].id } id="departament_doc" {...register("departament_doc")} className={`input-select${markClass(highlight?.departament_doc)}`}>
                        {departaments && departaments?.departamentos?.map((value: any) => {
                            return (<option key={value.id} value={value.id}> {value.nombre}</option>)
                        })}
                    </select>
                    <FieldHint hint={highlight?.departament_doc} />
                    </div>

                    <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="town_doc" className="input-label"> Municipio </label>
                    <select id="town_doc" {...register("town_doc")} className={`input-select${markClass(highlight?.town_doc)}`}>
                        {townsExtracted && townsExtracted?.map((value: any) => {
                            return (<option key={value.id_mun} value={value.id_mun}> {value.nombre}</option>)
                        })}
                    </select>
                    <FieldHint hint={highlight?.town_doc} />
                    </div>

                    <div className={`w-full ${ isContactExcluded ? 'md:w-1/2' : 'md:w-full'} px-3 mb-2`}>
                    <label htmlFor="taxpayer_type" className="input-label"> Tipo de contribuyente </label>
                    <select defaultValue={1} id="taxpayer_type" {...register("taxpayer_type")} className="input-select">
                        <option value="1">CONTRIBUYENTE</option>
                        <option value="2">GRAN CONTRIBUYENTE</option>
                    </select>
                    </div>

                  { isContactExcluded && 
                    <div className="w-full md:w-1/2 px-3 mb-2 flex justify-between">
                      <div>
                    <input className="bg-lime-600 rounded-full" type="checkbox" {...register("excluded", {})} /> 
                      <span className="ml-2 font-medium">Cliente Exento</span></div>
                    </div>
                  }
                    
                  { watch("is_client") == 1 &&
                    <div className="w-full md:w-1/2 px-3 mb-2 flex justify-between">
                      <div><input className="bg-lime-600 rounded-full" type="checkbox" {...register("is_credit_block", {})} /> 
                      <span className="ml-2 font-medium">Bloquear Credito al cliente</span></div>
                    </div>
                  }

                  { watch("is_client") == 1 &&
                    <div className="w-full md:w-1/2 px-3 mb-2">
                      <label htmlFor="credit_limit" className="input-label"> Límite de crédito (vacío sin límite) </label>
                      <input type="number" step="any" min={0} id="credit_limit" {...register("credit_limit")} className="input" />
                    </div>
                  }

                  { isCountryActive && countries &&
                    <div className="w-full md:w-full px-3 mb-2">
                      <label htmlFor="country" className="input-label"> Seleccione un pais </label>
                      <select defaultValue={"SV"} id="country" {...register("country")} className="input-select">
                        {countries?.map((value: any) => {
                            return (<option key={value.code} value={value.code}> {value.country}</option>)
                        })}
                    </select>
                    </div>
                  }

                  
                  { isSellerActive &&
                    <div className={`w-full px-3 mb-2`}>
                    <label htmlFor="employee_id" className="input-label"> Asignar Vendedor </label>
                    <select defaultValue={record?.employee?.name ? record?.employee?.id : ""} id="employee_id" {...register("employee_id")} className="input-select">
                        <option value="">Seleccionar...</option>
                        {users?.map((value: any) => <option key={value.id} value={value.id}> {value.name}</option>)}
                    </select>
                    </div>
                  }

                </div>
            </div>


              <div className="flex justify-center mt-4">
              <Button type="submit" disabled={saving} preset={saving ? Preset.saving : Preset.save} />
              </div>

            </form>
    </div>
  );
}