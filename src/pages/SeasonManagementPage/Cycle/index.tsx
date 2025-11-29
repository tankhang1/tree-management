import {
  ActionIcon,
  Badge,
  Button,
  Card,
  CloseButton,
  Group,
  Menu,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  Modal,
} from "@mantine/core";
import {
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconRefresh,
  IconSearch,
  IconTrash,
  IconPlus,
  IconCheck,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { useState, useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  useGrowthCycleStore,
  type GrowthCycle,
} from "../../zustand/growthCycleStore";

const SeasonManagementCyclePage = () => {
  const navigate = useNavigate();

  // 1. KẾT NỐI STORE
  const { cycles, deleteCycle, duplicateCycle } = useGrowthCycleStore();

  // 2. STATE
  const [keyword, setKeyword] = useState("");

  // Modal Delete
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 3. HANDLERS
  const onAddCycle = () => navigate(PATH.SEASON_ADD_CYCLE);
  const onCycleDetail = (id: string) =>
    navigate(`${PATH.SEASON_CYCLE_DETAIL}/${id}`);
  const onEditCycle = (id: string) =>
    navigate(`${PATH.SEASON_ADD_CYCLE}/${id}`); // Giả định dùng chung form

  const onClearAll = () => setKeyword("");

  const confirmDelete = (id: string) => {
    setSelectedId(id);
    openDelete();
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteCycle(selectedId);
      notifications.show({
        title: "Đã xóa chu kỳ",
        color: "green",
        icon: <IconCheck />,
        message: "",
      });
      closeDelete();
      setSelectedId(null);
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateCycle(id);
    notifications.show({
      title: "Đã sao chép chu kỳ",
      color: "blue",
      icon: <IconCopy />,
      message: "",
    });
  };

  // 4. FILTER LOGIC
  const filteredData = useMemo(() => {
    const kw = keyword.toLowerCase().trim();
    return cycles.filter(
      (c) =>
        !kw ||
        c.name.toLowerCase().includes(kw) ||
        c.varietyId.toLowerCase().includes(kw)
    );
  }, [cycles, keyword]);

  // 5. COLUMNS
  const growthStageColumns: MRT_ColumnDef<GrowthCycle>[] = [
    {
      accessorKey: "name",
      header: "Chu kì",
      Cell: ({ cell }) => <Text fw={600}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "duration",
      header: "Thời gian",
      Cell: ({ cell }) => (
        <Badge variant="light" color="blue">
          {cell.getValue<number>()} ngày
        </Badge>
      ),
    },
    {
      accessorKey: "stages",
      header: "Số giai đoạn",
      Cell: ({ row }) => <Text>{row.original.stages.length} giai đoạn</Text>,
    },
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
              onClick={() => onCycleDetail(row.original.id)}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item
              leftSection={<IconCopy size={18} color="blue" />}
              onClick={() => handleDuplicate(row.original.id)}
            >
              Sao chép
            </Menu.Item>
            <Menu.Item
              leftSection={<IconEdit size={18} color="green" />}
              onClick={() => onEditCycle(row.original.id)}
            >
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={18} color="red" />}
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
          Quản lý chu kì sinh trưởng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất Excel
          </Button>
          <Button
            radius={4}
            onClick={onAddCycle}
            leftSection={<IconPlus size={18} />}
          >
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table
        //@ts-expect-error no check
        columns={growthStageColumns}
        //@ts-expect-error no check
        data={filteredData}
      />

      {/* DELETE MODAL */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Xác nhận xóa"
        centered
        radius={4}
      >
        <Text>Bạn có chắc chắn muốn xóa chu kỳ này không?</Text>
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={closeDelete} radius={4}>
            Hủy
          </Button>
          <Button color="red" onClick={handleDelete} radius={4}>
            Xóa ngay
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};
export default SeasonManagementCyclePage;
