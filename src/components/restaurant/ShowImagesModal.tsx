"use client";
import { Button, Preset } from "@/components/button/button";
import Modal from "@/components/modal/Modal";
import { URL } from '@/constants';
import { useImagesSelectLogic } from "@/hooks/restaurant/useImagesSelectLogic";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import imagesStore from "@/stores/restaurant/imagesStore";
import useTempStorage from "@/stores/useTempStorage";
import Image from "next/image";
import { NothingHere } from "../NothingHere";
import { PaginationMin } from "../PaginationMin";
import { SearchInput } from "../Search";

export interface ShowImagesModalI {
  onClose: () => void;
  isShow: boolean;
  nameImage?: string;
  onSelect?: (item: any) => void; // funcion que se ejecuta al seleccionar imagen
}




export function ShowImagesModal(props: ShowImagesModalI) {
  const { onClose, isShow, nameImage = "productImage", onSelect } = props;
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm(["tags"], 500);
  useImagesSelectLogic(currentPage, searchTerm);
  const { loading, images } = imagesStore();
  const { setElement } = useTempStorage();


  const handleSelectImage = (image: string) => {
      setElement(nameImage, image);
      handleSearchTerm('');
      onSelect && onSelect(image);
      onClose();
  };

  const imageLoader = ({ src, width, quality }: any) => {
      return `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`
    }
    
    
    const listItems = images?.data && images.data.map((image: any, index: number) => (
        <div key={image?.id} className="clickeable opacity-0 animate-[slideUp_0.1s_ease_forwards]" style={{ animationDelay: `${index * 10}ms` }}>
            <div onClick={()=> { handleSelectImage(image?.image) }} className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                <Image loader={imageLoader} src={image?.image} alt="Icono de imagen" width={96} height={96} className="rounded-lg transition-transform duration-200 group-hover:scale-105" />
                <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-hover:ring-primary/40 transition-all duration-200" />
            </div>
        </div>
    ));


    const listMocks = () => {
          const items = [];
          for (let index = 0; index < 28; index++) {
            items.push(
              <div key={index} className="opacity-0 animate-[slideUp_0.3s_ease_forwards]" style={{ animationDelay: `${index * 30}ms` }}>
                <div className="w-24 h-24 rounded-lg bg-bg-subtle/60 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bg-content/60 to-transparent animate-shimmer" />
                </div>
              </div>
            );
          }
          return <>{items}</>;
      };

  return (
    <Modal show={isShow} onClose={onClose} size="xl4" headerTitle="Seleccione una imagen" removeTitle={true} closeOnOverlayClick={true} >
      <Modal.Body>
        <div className="mx-1">
          <div className="flex flex-wrap justify-center gap-3">
            {loading ? listMocks() : listItems }
            {((!images?.data || images.data.length === 0) && !loading) && <div><NothingHere text="No se encontraron imágenes" /></div> }
          </div>
          <PaginationMin records={images} handlePageNumber={handlePageNumber } />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex items-center justify-between w-full">
            <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar imagenes" animating={loading} />
            <Button onClick={onClose} preset={Preset.close} disabled={false} /> 
        </div>
      </Modal.Footer>
    </Modal>
  );

}
