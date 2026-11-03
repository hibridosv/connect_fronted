import { getCountryProperty } from '@/lib/utils';
import useConfigStore from '@/stores/configStore';
import manageRestaurantStore from '@/stores/restaurant/manageRestaurantStore';
import useTempStorage from '@/stores/useTempStorage';



export function useRestaurantFnLogic() {
    const { system } = useConfigStore();
    const { getElement } = useTempStorage();
    const { productAdded, addProduct } = manageRestaurantStore();
    const selectedImage = getElement("productImage") || "default.png";

  const onSubmit = async (data: any) => {

    data.minimum_stock = 1;
    data.product_type = 3;
    data.image = selectedImage;
    data.taxes = getCountryProperty(parseInt(system?.country)).taxes;
    data.is_restaurant = 1;
    data.quantity = 1;

    if (data.work_station_id == "1" || !data.work_station_id) {
      data.work_station_id = null
    }
    if (!Array.isArray(data.options)) {
      data.options = data.options ? [data.options] : null;
    }
      return await addProduct("restaurant/products", data);
    }


    return { onSubmit };
}