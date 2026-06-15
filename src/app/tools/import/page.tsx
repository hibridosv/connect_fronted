"use client"

import { useState } from "react"
import { Button, Preset } from "@/components/button/button";
import { Alert } from "@/components/Alert/Alert";
import { FaSpinner } from "react-icons/fa";
import { ViewTitle } from "@/components/ViewTitle"
import { postFormData } from "@/services/OtherServices"

export default function Page() {

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [ uploads, setUploads ] = useState([] as any);
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setMessage("Seleccione un archivo Excel para importar")
      return
    }

    try {
      setLoading(true)
      setMessage("")
      const formData = new FormData()
      formData.append("file", file)
      const response = await postFormData(`imports/products`, formData);
      if (response.type == "error") {
        setMessage("Error al importar archivo")
      } else {
        setUploads(response)
        setLoading(false)
      }
    } catch (error) {
      setMessage("Error al importar archivo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 md:border-r md:border-primary">
            <ViewTitle text="IMPORTAR PRODUCTOS A INVENTARIO" />
          {
            loading &&
            <div className="flex flex-col items-center">
            <Alert type="info" text="En este momento se estan importanto los productos, por favor no salga de esta pagina y espere que el proceso haya finalizado, es probable que esto tarde unos pocos minutos"  className="m-4"  />
            <FaSpinner size={24} className="animate-spin" />
            </div>
          }
          {
           !loading && !uploads?.data &&
            <div>
              <Alert type="info"  text="La importación de productos debe ser desde un documento de Excel y debe llevar el formato correcto, de lo contrario fallará o la información no se agregaran los productos correctamente"  className="m-4" />
            </div>
          }

          {
          !loading &&uploads?.data && uploads.data.length > 0 &&
            <Alert type="info"  text="Importación completada con éxito, por favor revise su inventario"  className="m-4" />
          }

        {
          !loading &&uploads?.data && uploads.data.length === 0 &&
            <Alert type="info" text="La importacion finalizó pero sin nuevos productos agregados, es posible que estos productos ya esten registrados en su sistema, por favor revise su inventario"  className="m-4" />
          }
        </div>
        <div className="flex flex-col items-center col-span-3 m-4">

        <ViewTitle text="Agregar archivo" />

        <form
            onSubmit={handleSubmit}
            className="w-full m-4 flex flex-col gap-4"
        >
        {
          message && (
            <Alert type="info"  text={message} />
          )
        }
            <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0])
                }
            }}
            className="border rounded-lg p-2"
            />

            <Button isFull={true}  type="submit" preset={loading ? Preset.saving : Preset.save} text="Iniciar Importación" />

        </form>

        </div>
    </div>
  )
}
