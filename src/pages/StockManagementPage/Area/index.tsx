import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

// IMPORT STORE
import {
  useStockAreaStore,
  type Area,
  type SubArea,
} from "../../zustand/stockAreaStore";

const StockManagementAreaPage = () => {
  const navigate = useNavigate();

  // 1. KẾT NỐI STORE
  const { areas, deleteArea } = useStockAreaStore();

  // 2. STATE CHO MODAL XÓA
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 3. NAVIGATION HANDLERS
  const onAddArea = () => {
    navigate(PATH.STOCK_ADD_AREA);
  };

  const onAreaDetail = (id: string) => {
    navigate(`${PATH.STOCK_AREA_DETAIL}/${id}`);
  };

  // 4. LOGIC DELETE
  const confirmDelete = (id: string) => {
    setSelectedId(id);
    openDelete();
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteArea(selectedId);
      notifications.show({
        title: "Đã xóa khu vực",
        color: "green",
        message: "",
      });
      closeDelete();
      setSelectedId(null);
    }
  };

  // 5. CẤU HÌNH CỘT
  const areaColumns: MRT_ColumnDef<Area>[] = [
    { accessorKey: "id", header: "ID", size: 100 },
    { accessorKey: "name", header: "Tên khu vực" },
    { accessorKey: "latitude", header: "Vĩ độ" },
    { accessorKey: "longitude", header: "Kinh độ" },
    { accessorKey: "area", header: "Diện tích (m²)" },
    {
      accessorKey: "note",
      header: "Ghi chú",
      Cell: ({ cell }) => (
        <Text c="dimmed" size="sm" lineClamp={1}>
          {cell.getValue<string>()}
        </Text>
      ),
    },
    {
      accessorKey: "subAreas",
      header: "Số khu phụ",
      Cell: ({ cell }) => {
        const subAreas = cell.getValue<SubArea[]>();
        return subAreas?.length ?? 0;
      },
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
              onClick={() => onAreaDetail(row.original.id)}
            >
              Chi tiết
            </Menu.Item>

            <Menu.Item
              leftSection={<IconEdit size={18} color="green" />}
              onClick={() => onAreaDetail(row.original.id)} // Vào chi tiết để sửa
            >
              Chỉnh sửa
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
          Khu vực quản lí
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddArea}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      {/* Truyền dữ liệu từ Store vào Table */}
      <Table
        //@ts-expect-error no check
        columns={areaColumns}
        //@ts-expect-error no check
        data={areas}
      />

      {/* Modal xác nhận xóa */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Xác nhận xóa"
        centered
      >
        <Text>Bạn có chắc chắn muốn xóa khu vực này không?</Text>
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

export default StockManagementAreaPage;
