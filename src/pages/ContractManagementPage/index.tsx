import {
  ActionIcon,
  Button,
  Card,
  Group,
  Menu,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  Modal,
  Badge,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconCalendar,
  IconDotsVertical,
  IconEye,
  IconFileExcel,
  IconRefresh,
  IconSearch,
  IconTrash,
  IconPlus,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/path.constants";
import { useState, useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useContractStore, type Contract } from "../zustand/contractStore";

// IMPORT STORE

const ContractManagementPage = () => {
  const navigate = useNavigate();
  // 1. KẾT NỐI STORE
  const { contracts, deleteContract } = useContractStore();

  // State local
  const [keyword, setKeyword] = useState("");
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  // Modal delete
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Handlers
  const onAddContract = () => navigate(PATH.CONTRACT_ADD_MANAGEMENT);
  const onDetailContract = (id: string) =>
    navigate(`${PATH.CONTRACT_MANAGEMENT_DETAIL}/${id}`);

  const confirmDelete = (id: string) => {
    setSelectedId(id);
    openDelete();
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteContract(selectedId);
      notifications.show({
        title: "Đã xóa hợp đồng",
        color: "green",
        message: "",
      });
      closeDelete();
      setSelectedId(null);
    }
  };

  const handleResetFilters = () => {
    setKeyword("");
    setSelectedPartners([]);
    setSelectedTypes([]);
    setSelectedStatus([]);
    setDateRange([null, null]);
  };

  // Logic lọc dữ liệu
  const filteredData = useMemo(() => {
    return contracts.filter((c) => {
      const matchKw =
        !keyword ||
        c.name.toLowerCase().includes(keyword.toLowerCase()) ||
        c.id.toLowerCase().includes(keyword.toLowerCase());
      const matchPartner =
        !selectedPartners.length || selectedPartners.includes(c.partner);
      const matchType =
        !selectedTypes.length || selectedTypes.includes(c.contractType);
      const matchStatus =
        !selectedStatus.length || selectedStatus.includes(c.status);

      let matchDate = true;
      if (dateRange[0] && dateRange[1]) {
        const contractDate = new Date(c.startDate);
        matchDate =
          contractDate >= dateRange[0] && contractDate <= dateRange[1];
      }

      return matchKw && matchPartner && matchType && matchStatus && matchDate;
    });
  }, [
    contracts,
    keyword,
    selectedPartners,
    selectedTypes,
    selectedStatus,
    dateRange,
  ]);

  const contractColumns: MRT_ColumnDef<Contract>[] = [
    { accessorKey: "id", header: "Mã HĐ", size: 100 },
    { accessorKey: "name", header: "Tên hợp đồng", size: 250 },
    { accessorKey: "partner", header: "Đối tác" },
    {
      accessorKey: "contractType",
      header: "Loại",
      Cell: ({ cell }) => (
        <Badge variant="outline">{cell.getValue<string>()}</Badge>
      ),
    },
    {
      accessorKey: "summary",
      header: "Tóm tắt",
      size: 300,
      Cell: ({ cell }) => (
        <Text lineClamp={1} size="sm">
          {cell.getValue<string>()}
        </Text>
      ),
    },
    {
      accessorKey: "value",
      header: "Giá trị",
      Cell: ({ row }) =>
        `${row.original.value?.toLocaleString() || 0} ${row.original.currency}`,
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      Cell: ({ cell }) => {
        const val = cell.getValue<string>();
        let color = "gray";
        if (val === "Đang hiệu lực") color = "green";
        if (val === "Chờ duyệt") color = "yellow";
        return <Badge color={color}>{val}</Badge>;
      },
    },
    { accessorKey: "startDate", header: "Ngày hiệu lực" },
    { accessorKey: "endDate", header: "Ngày kết thúc" },

    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
      enableColumnActions: false,
      size: 60,
      Cell: ({ row }) => (
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="transparent" c={"gray"}>
              <IconDotsVertical />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={() => onDetailContract(row.original.id)}
            >
              Chi tiết / Sửa
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={18} />}
              color="red"
              onClick={() => confirmDelete(row.original.id)}
            >
              Xoá
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý hợp đồng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất Excel
          </Button>
          <Button
            radius={4}
            onClick={onAddContract}
            leftSection={<IconPlus size={18} />}
          >
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Card withBorder shadow="sm" radius={4} p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm hợp đồng</Title>
            <Text c="dimmed" size="sm">
              Lọc theo tên, đối tác, loại hoặc thời gian
            </Text>
          </Stack>

          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={handleResetFilters}
              >
                Làm mới
              </Button>
            </Tooltip>
            <Button radius={4} leftSection={<IconSearch size={16} />}>
              Tìm kiếm
            </Button>
          </Group>
        </Group>

        <Stack gap="sm">
          <TextInput
            radius={4}
            label="Khung tìm kiếm"
            placeholder="Nhập tên hợp đồng, mã hợp đồng..."
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <DatePickerInput
              leftSection={<IconCalendar size={18} />}
              label="Khoảng thời gian"
              placeholder="Chọn khoảng ngày"
              radius={4}
              clearable
              type="range"
              value={dateRange}
              //@ts-expect-error no check
              onChange={setDateRange}
            />
            <MultiSelect
              radius={4}
              searchable
              clearable
              label="Đối tác"
              placeholder="Chọn đối tác"
              data={[
                "Công ty Nông sản ABC",
                "Công ty Thiết bị Nông nghiệp DEF",
              ]}
              value={selectedPartners}
              onChange={setSelectedPartners}
            />
            <MultiSelect
              radius={4}
              searchable
              clearable
              label="Loại hợp đồng"
              placeholder="Chọn loại"
              data={["Mua hàng", "Bán hàng", "Dịch vụ", "Thuê"]}
              value={selectedTypes}
              onChange={setSelectedTypes}
            />
            <MultiSelect
              radius={4}
              searchable
              clearable
              label="Trạng thái"
              placeholder="Chọn trạng thái"
              data={["Chờ duyệt", "Đang hiệu lực", "Đã kết thúc"]}
              value={selectedStatus}
              onChange={setSelectedStatus}
            />
          </SimpleGrid>
        </Stack>
      </Card>

      <Table
        //@ts-expect-error no check
        columns={contractColumns}
        //@ts-expect-error no check
        data={filteredData}
      />

      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Xác nhận xóa"
        centered
      >
        <Text>Bạn có chắc chắn muốn xóa hợp đồng này không?</Text>
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={closeDelete}>
            Hủy
          </Button>
          <Button color="red" onClick={handleDelete}>
            Xóa ngay
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};

export default ContractManagementPage;
