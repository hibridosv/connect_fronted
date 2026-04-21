import { Alert } from "@/components/Alert/Alert";
import { Popper } from "@/components/popper/Popper";
import { useOrderRestaurantFnLogic } from "@/hooks/order/restaurant/useOrderRestaurantFnLogic";
import { requiredFieldsCCF, validateInvoiceFields } from "@/lib/validator-functions";
import useConfigStore from "@/stores/configStore";
import ordersStore from "@/stores/orders/ordersStore";
import useTempStorage from "@/stores/useTempStorage";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdOptions } from "react-icons/io";
import Keyboard from 'react-simple-keyboard';
// @ts-ignore
import 'react-simple-keyboard/build/css/index.css';
import { Buttons } from "./Buttons";
import { PayButton } from "./Buttons/PayButton";
import { PrintOrderButton } from "./Buttons/PrintOrderButton";
import { SaveButton } from "./Buttons/SaveButton";

interface Props {
  order: any;
  isSplit?: boolean;
}


export function RestaurantButtons({ order, isSplit = false}: Props) {
  const { collecting, sending } = ordersStore();
  const { pay, paySplit } = useOrderRestaurantFnLogic();
  const { cashdrawer, activeConfig } =useConfigStore();
  const { register, handleSubmit, reset, setFocus, setValue, watch, formState: { errors } } = useForm();
  const { getElement} = useTempStorage();
  const payMethod = getElement('payMethod') ?? 1;
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState<boolean>(false);
  const [keyboard, setKeyboard] = useState<any>(null);
  const invoice = order;

  useEffect(() => {
    if (payMethod == 1 && activeConfig && activeConfig.includes("input-sales-focus")) {
        setFocus('cash')
    }
  }, [setFocus, order, payMethod, activeConfig])


  const validateFields = ()=>{
    if (invoice?.client_id && invoice?.invoice_assigned?.type == 3) {
      return validateInvoiceFields(invoice?.client, requiredFieldsCCF)
    }
  }

  let fieldsRequired = validateFields();
  
  const handlePay = async (data: any) => {
    if(isSplit){
      await paySplit(data);
    } else {
      await pay(data);
    }
    reset(); // Resetea el estado del formulario en react-hook-form
    if (activeConfig && activeConfig.includes("input-sales-keyboard")) {
        setInput(''); // Resetea el estado del input
        if (keyboard) {
            keyboard.clearInput(); // Resetea el teclado virtual
        }
        setShowInput(false)
    }
  }


//////keyboard
const handleKeyboardChange = (inputValue: string) => {
    // Actualiza el estado del campo de entrada y el valor en react-hook-form
    setInput(inputValue);
    setValue('cash', inputValue, { shouldValidate: true });
  };

  const handleKeyPress = (button: string) => {
    if (button === '{bksp}') {
      handleKeyboardChange(input.slice(0, -1));
    } else if (button === '.') {
      // Solo agrega el punto si no existe ya uno en el input
      if (!input.includes('.')) {
        handleKeyboardChange(input + button);
      }
    } else if (button === '{submit}') {
      handleSubmit(pay)();
    } else {
      handleKeyboardChange(input + button);
    }
  };
//////// termina keyboard

  if (!order) return null;

    return (
        <div className="w-full space-y-3 px-3 pt-3 pb-4">

        { !cashdrawer &&
        <Alert type="danger" title="Error" text="Debe seleccionar una caja para poder cobrar" isDismissible={false} /> }

        { (!invoice?.client_id && (invoice?.invoice_assigned?.type == 3 || invoice?.invoice_assigned?.type == 4)) &&
        <Alert type="danger" title="Error" text={`Seleccione un cliente para el ${invoice?.invoice_assigned?.type == 3 ? "CCF" : "Sujeto Excluido"}`} isDismissible={false} /> }

        { fieldsRequired && fieldsRequired.length > 0 &&
          <div className="rounded-lg border border-danger/20 bg-danger/10 p-2.5 text-sm text-text-base">
            Faltan los siguientes campos del cliente para facturar:
            <span className="ml-1 font-semibold text-danger">{`${fieldsRequired.join(', ')}.`}</span>
          </div>
        }
        <form id="restaurant-pay-form" onSubmit={handleSubmit(handlePay)}>
        { payMethod == 1 && cashdrawer && <>
          { activeConfig && activeConfig.includes("input-sales-keyboard") ? <div>
          { showInput &&
            <Keyboard inputName='cash' display={{'{bksp}': '<'}} layout={{ default: ["1 2 3", "4 5 6", "7 8 9", ". 0 {bksp}"] }}  onKeyPress={handleKeyPress} keyboardRef={r => setKeyboard(r)}/> }
            <div onClick={()=>setShowInput(!showInput)} className='clickeable p-1'>
                <input className="input-disabled" type="text" {...register('cash')} value={input} placeholder="Ingrese una cantidad" readOnly />
            </div>
          </div> :
          <input type="number" step="any" min={0} readOnly={sending || collecting} className="input" placeholder='Ingrese una cantidad' {...register("cash")} />
          }
        </>}
        <div className={`${ isSplit ? 'flex justify-end' : 'grid grid-cols-[2fr_1fr_2fr]'}`}>
          { !isSplit &&
            <Popper label={
            <div className="button-grey clickeable">
              <IoMdOptions className="mr-1.5" /> Opciones
            </div>
          }>
            <Buttons order={order} />
          </Popper> }

          { isSplit ? <PrintOrderButton /> : <SaveButton />}
          <PayButton isSplit={isSplit} />
        </div>
      </form>
      </div>
    );

}
