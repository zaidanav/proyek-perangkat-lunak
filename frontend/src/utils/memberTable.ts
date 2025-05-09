import { ref, watch } from 'vue';
import { deleteMemberById, updateUserData } from '@/services/memberServices';
import { fetchMembers } from '@/services/templateServices';
import { type Member } from '@/types/member';

export function useMemberTable() {
  const perPage = ref(10);
  const currentPage = ref(0);
  const lastFetch = ref<Member[]>([]);
  const maxPage = ref(false);
  const sortBy = ref("id");
  const order = ref("asc");
  const searchQuery = ref("");
  const selectedRole = ref("");
  const totalPages = ref(1);
  const editingMember = ref<number | null>(null);
  const originalName = ref<string | null>(null);
  const originalPhone = ref<string | null>(null);
  const showDeleteColumn = ref(false);

// memberTable.ts

async function dataFetcher(page: number, append = false) {
  try {
    const response = await fetchMembers(
      perPage.value,
      page,
      sortBy.value,
      order.value,
      searchQuery.value,
      selectedRole.value
    );

    if (append) {
      lastFetch.value = [...lastFetch.value, ...response.data]; // append mode
    } else {
      lastFetch.value = response.data; // reset mode
    }

    totalPages.value = response.pagination.totalPages;
    maxPage.value = response.pagination.totalPages <= page + 1;
  } catch (error) {
    console.error("Failed to fetch members:", error);
  }
}

  watch(perPage, async () => {
    currentPage.value = 0;
    await dataFetcher(0);
  });

  const handleSort = (column: string, reverse: boolean) => {
    sortBy.value = column;
    order.value = reverse ? "desc" : "asc";
    refresh(0);
  };

  const handleSearch = (query: string) => {
    searchQuery.value = query;
    refresh(0);
  };

  const handleFilter = (role: string) => {
    selectedRole.value = role;
    refresh(0);
  };

  const refresh = async (page = 0, append = false) => {
    currentPage.value = page;
    await dataFetcher(page, append);
  };

  const deleteMember = async (id: number) => {
    const confirmed = confirm('Are you sure you want to delete this member?');
    if (confirmed) {
      await deleteMemberById(id);
      dataFetcher(0);
    }
  };

  function editMember(item: Member) {
    editingMember.value = item.id;
    originalName.value = item.name;
    originalPhone.value = item.phone_no;
  }

  async function saveItem(item: Member) {
    editingMember.value = null;
    originalName.value = null;
    originalPhone.value = null;
    await updateUserData(item.id, item.name, item.phone_no);
    dataFetcher(0);
  }

  function cancelEdit(item: Member) {
    item.name = originalName.value ?? '';
    item.phone_no = originalPhone.value ?? '';
    editingMember.value = null;
    originalName.value = null;
    originalPhone.value = null;
  }

  function toggleDeleteColumn() {
    showDeleteColumn.value = !showDeleteColumn.value;
  }

  return {
    perPage,
    currentPage,
    lastFetch,
    maxPage,
    sortBy,
    order,
    searchQuery,
    selectedRole,
    totalPages,
    editingMember,
    showDeleteColumn,
    dataFetcher,
    refresh,
    deleteMember,
    editMember,
    saveItem,
    cancelEdit,
    toggleDeleteColumn,
    handleSort,
    handleSearch,
    handleFilter,
  };
}