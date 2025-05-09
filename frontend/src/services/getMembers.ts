import { ref } from "vue";
import { type Member } from "@/types/member";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface FetchOptions {
  search?: string;
  sortBy?: "name" | "join_date";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
  filterBy?: string;
}

export function useFetchMembers() {
  const members = ref<Member[]>([]);
  const pagination = ref<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const fetchMembers = async (filters: FetchOptions = {}) => {
    isLoading.value = true;
    error.value = null;

    try {
      const params = new URLSearchParams({
        search: filters.search || "",
        sortBy: filters.sortBy || "name",
        order: filters.order || "asc",
        page: filters.page?.toString() || "1",
        limit: filters.limit?.toString() || "10",
        filterBy: filters.filterBy || "",
      });

      const response = await fetch(`/api/members?${params.toString()}`);  
      if (!response.ok) throw new Error("Failed to fetch members");

      const data = await response.json();

      members.value = data.data;
      pagination.value = data.pagination;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      isLoading.value = false;
    }
  };

  return { members, pagination, isLoading, error, fetchMembers };
}
