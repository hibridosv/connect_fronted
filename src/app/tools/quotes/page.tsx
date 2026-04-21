'use client';
import { Pagination } from "@/components/Pagination";
import { SearchInput } from "@/components/Search";
import { QuotesDetailsModal } from "@/components/tools/QuotesDetailsModal";
import { QuotesTable } from "@/components/tools/QuotesTable";
import { ViewTitle } from "@/components/ViewTitle";
import { useQuotesLogic } from "@/hooks/tools/useQuotesLogic";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import useModalStore from "@/stores/modalStorage";
import quotesStore from "@/stores/tools/quotesStore";

export default function Page() {
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm(["client_name", "quote_number"], 500);
  const { modals, closeModal } = useModalStore();
  useQuotesLogic(currentPage, searchTerm, true);
  const { quotes, loading } = quotesStore();

  const data = quotes?.data || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-4 md:pb-10">
    <div className="md:col-span-7 md:border-r md:border-primary">
        <ViewTitle text="LISTA DE COTIZACIONES" />
        <div className="p-4">
          <QuotesTable records={data} isLoading={loading} />
          <Pagination records={quotes} handlePageNumber={handlePageNumber } />
        </div>
    </div>
    <div className="md:col-span-3">
        <ViewTitle text="DETALLES" />
        <div className="mt-2 p-2">
          <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar cotización" animating={loading} />
        </div>
    </div> 
    <QuotesDetailsModal isShow={modals.quoteDetail} onClose={() => closeModal('quoteDetail')} />
</div>
  );
}
