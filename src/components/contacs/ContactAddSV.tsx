'use client';
import { useContactsAddLogic } from "@/hooks/contacts/useContactsAddLogic";
import { useCountries } from "@/hooks/locations/useCountries";
import { useDepartaments } from "@/hooks/locations/useDepartaments";
import { useTownByDepartament } from "@/hooks/locations/useTownByDepartaments";
import { Contact } from "@/interfaces/contact";
import useConfigStore from "@/stores/configStore";
import useContactStore from "@/stores/ContactStore";
import useUserStore from "@/stores/UserStore";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button, Preset } from "../button/button";
import { SkeletonContactAddSV } from "../skeleton/SkeletonContactAddSV";
import { getParamString } from "./utils";

export interface ContactAddSVPropd {
  isShow: boolean;
  record: Contact;
}

export function ContactAddSV(props: ContactAddSVPropd) {
  const { isShow, record } = props;
  const { system, activeConfig } = useConfigStore();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } = useForm();
  const { departaments } = useDepartaments();
  const { countries } = useCountries();
  let selectDepartament =  (watch("departament_doc")) ? watch("departament_doc") : departaments && departaments.departamentos[0].id;
  const { townsExtracted } = useTownByDepartament(departaments, selectDepartament);
  let regex =  (watch("country") == "9300") ? "^([0-9]{8}-[0-9]{1}|[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]{1})?$" : "^[a-zA-Z0-9-]+$";
  const { onSubmit } = useContactsAddLogic(isShow, record, setValue, departaments, countries, townsExtracted,  getParamString(pageParam));
  const { saving } = useContactStore();
  const { users } = useUserStore();

  const isLoading = !departaments || !countries || !townsExtracted.length;

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
              activeConfig &&  activeConfig.includes("contact-code") && 
              <div className="w-full md:w-full px-3 mb-2">
                  <label htmlFor="code" className="input-label">{ system?.contact_search ?? "Código"}</label>
                  <input type="text" id="code" {...register("code")} className="input" />
              </div> 
            }
            <div className="w-full md:w-1/2 px-3 mb-2">
                <label htmlFor="id_number" className="input-label">Numero de documento</label>
                <input type="text" id="id_number" {...register("id_number")} 
                 onBlur={(e) => setValue('document', e.target.value)} placeholder="0207-210690-102-9" pattern={regex} className="input" />
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
                <input type="email" id="email" {...register("email")} className="input" />
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
                        <input type="text" id="document" {...register("document")} placeholder="0207-210690-102-9" pattern={regex} className="input" />
                    </div>

                    <div className="w-full md:w-1/2 px-3 mb-2">
                        <label htmlFor="register" className="input-label">Registro</label>
                        <input type="text" id="register" {...register("register")} placeholder="021545-9" pattern="^[0-9]{1,6}-[0-9]{1}?$" className="input" />
                    </div>

                    <div className="w-full md:w-full px-3 mb-2">
                        <label htmlFor="roar" className="input-label">Giro</label>
                        <input type="text" id="roar" {...register("roar")} className="input" />
                    </div>

                    <div className="w-full md:w-full px-3 mb-2">
                        <label htmlFor="address_doc" className="input-label">Dirección</label>
                        <input type="text" id="address_doc" {...register("address_doc")} className="input" />
                    </div>

                    <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="departament_doc" className="input-label"> Departamento </label>
                    <select defaultValue={departaments && departaments.departamentos[0].id } id="departament_doc" {...register("departament_doc")} className="input-select">
                        {departaments && departaments?.departamentos?.map((value: any) => {
                            return (<option key={value.id} value={value.id}> {value.nombre}</option>)
                        })}
                    </select>
                    </div>

                    <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="town_doc" className="input-label"> Municipio </label>
                    <select id="town_doc" {...register("town_doc")} className="input-select">
                        {townsExtracted && townsExtracted?.map((value: any) => {
                            return (<option key={value.id_mun} value={value.id_mun}> {value.nombre}</option>)
                        })}
                    </select>
                    </div>

                    <div className={`w-full ${activeConfig && activeConfig.includes("contact-excluded") ? 'md:w-1/2' : 'md:w-full'} px-3 mb-2`}>
                    <label htmlFor="taxpayer_type" className="input-label"> Tipo de contribuyente </label>
                    <select defaultValue={1} id="taxpayer_type" {...register("taxpayer_type")} className="input-select">
                        <option value="1">CONTRIBUYENTE</option>
                        <option value="2">GRAN CONTRIBUYENTE</option>
                    </select>
                    </div>

                  {activeConfig && activeConfig.includes("contact-excluded") && 
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

                  {activeConfig && activeConfig.includes("contact-country") && countries &&
                    <div className="w-full md:w-full px-3 mb-2">
                      <label htmlFor="country" className="input-label"> Seleccione un pais </label>
                      <select defaultValue={"9300"} id="country" {...register("country")} className="input-select">
                        {countries?.map((value: any) => {
                            return (<option key={value.code} value={value.code}> {value.country}</option>)
                        })}
                    </select>
                    </div>
                  }

                  
                  {activeConfig && activeConfig.includes("contact-user-seller") &&
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