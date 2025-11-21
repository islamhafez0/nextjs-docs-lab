import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import { Suspense } from "react";
import Table from "@/app/ui/invoices/table";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { fetchInvoicesPages } from "@/app/lib/data";
import Pagination from "@/app/ui/invoices/pagination";

export default async function Page(props: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="flex mt-4 items-center gap-2 md:mt-8 justify-between">
        <Search placeholder="Search Invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table currentPage={currentPage} query={query} />
      </Suspense>
      <div className="flex w-full justify-center mt-5">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
