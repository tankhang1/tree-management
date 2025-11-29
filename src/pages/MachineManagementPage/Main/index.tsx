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
  Box,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconRefresh,
  IconSearch,
  IconTrash,
  IconPlus,
  IconFileText,
  IconCertificate,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { useState, useMemo } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

// IMPORT STORE
import { useMachineStore, type Machine } from "../../zustand/machineStore";

const MachineManagementMainPage = () => {
  const navigate = useNavigate();

  // 1. KẾT NỐI STORE
  const { machines, deleteMachine } = useMachineStore();

  // 2. STATE BỘ LỌC
  const [keyword, setKeyword] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  // State Modal Xóa
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // State Modal Xem File (PDF/Ảnh)
  const [openedViewer, { open: openViewer, close: closeViewer }] =
    useDisclosure(false);
  const [viewingFile, setViewingFile] = useState<{
    url: string;
    title: string;
  } | null>(null);

  // 3. NAVIGATION HANDLERS
  const onAddMachine = () => navigate(PATH.MACHINE_ADD_MAIN);
  const onEditMachine = (id: string) =>
    navigate(`${PATH.MACHINE_ADD_MAIN}/${id}`);
  const onDetailMachine = (id: string) =>
    navigate(`${PATH.MACHINE_MAIN_DETAIL}/${id}`);

  // 4. LOGIC DELETE
  const confirmDelete = (id: string) => {
    setSelectedId(id);
    openDelete();
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteMachine(selectedId);
      notifications.show({
        title: "Đã xóa máy móc",
        color: "green",
        message: "",
      });
      closeDelete();
      setSelectedId(null);
    }
  };

  const handleResetFilters = () => {
    setKeyword("");
    setSelectedTypes([]);
    setSelectedStatus([]);
  };

  // 5. LOGIC VIEW FILE
  const handleViewFile = (url: string, title: string) => {
    setViewingFile({ url, title });
    openViewer();
  };

  // 6. LOGIC FILTER
  const filteredData = useMemo(() => {
    return machines.filter((machine) => {
      // Lọc theo từ khóa
      const matchKeyword =
        !keyword ||
        machine.name.toLowerCase().includes(keyword.toLowerCase()) ||
        machine.id.toLowerCase().includes(keyword.toLowerCase());

      // Lọc theo Loại xe
      const matchType =
        !selectedTypes.length || selectedTypes.includes(machine.type);

      // Lọc theo Trạng thái
      const matchStatus =
        !selectedStatus.length || selectedStatus.includes(machine.status);

      return matchKeyword && matchType && matchStatus;
    });
  }, [machines, keyword, selectedTypes, selectedStatus]);

  // 7. CẤU HÌNH CỘT
  const machineColumns: MRT_ColumnDef<Machine>[] = [
    {
      accessorKey: "id",
      header: "Mã máy",
      size: 100,
      Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "name",
      header: "Tên máy móc",
      size: 200,
    },
    {
      accessorKey: "type",
      header: "Loại xe",
      size: 120,
    },
    {
      accessorKey: "status",
      header: "Tình trạng",
      size: 140,
      Cell: ({ cell }) => {
        const value = cell.getValue<string>();
        let color = "gray";
        if (value === "Đang vận hành") color = "green";
        if (value === "Đang bảo trì") color = "orange";
        return (
          <Badge color={color} variant="light">
            {value}
          </Badge>
        );
      },
    },
    {
      accessorKey: "price",
      header: "Giá trị",
      size: 140,
      Cell: ({ row }) =>
        (row.original.price || 0).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      accessorKey: "manualFile",
      header: "Sổ tay",
      size: 130,
      Cell: ({ row }) => {
        const file = row.original.manualFile;
        return file ? (
          <Button
            variant="subtle"
            size="compact-xs"
            leftSection={<IconFileText size={14} />}
            onClick={(e) => {
              e.stopPropagation();
              handleViewFile(file, `Sổ tay: ${row.original.name}`);
            }}
          >
            Xem sổ tay
          </Button>
        ) : (
          <Text size="sm" c="dimmed">
            -
          </Text>
        );
      },
    },
    {
      accessorKey: "inspectionFile",
      header: "Đăng kiểm",
      size: 130,
      Cell: ({ row }) => {
        const file = row.original.inspectionFile;
        return file ? (
          <Button
            variant="subtle"
            size="compact-xs"
            color="teal"
            leftSection={<IconCertificate size={14} />}
            onClick={(e) => {
              e.stopPropagation();
              handleViewFile(file, `Đăng kiểm: ${row.original.name}`);
            }}
          >
            Xem ĐK
          </Button>
        ) : (
          <Text size="sm" c="dimmed">
            -
          </Text>
        );
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
              onClick={() => onDetailMachine(row.original.id)}
            >
              Chi tiết
            </Menu.Item>
            <Menu.Item
              leftSection={<IconEdit size={18} color="blue" />}
              onClick={() => onEditMachine(row.original.id)}
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
          Quản lý máy móc
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất Excel
          </Button>
          <Button
            radius={4}
            onClick={onAddMachine}
            leftSection={<IconPlus size={18} />}
          >
            Thêm mới
          </Button>
        </Group>
      </Group>

      {/* --- FILTER CARD --- */}
      <Card withBorder shadow="sm" radius={4} p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm máy móc</Title>
            <Text c="dimmed" size="sm">
              Lọc theo tên, mã, loại xe hoặc trạng thái vận hành
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
            placeholder="Nhập tên máy hoặc mã máy..."
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="sm">
            <MultiSelect
              radius={4}
              searchable
              clearable
              label="Loại xe"
              placeholder="Chọn loại xe"
              data={["Xe tải", "Xe ben", "Xe con", "Máy cày", "Máy gặt"]}
              value={selectedTypes}
              onChange={setSelectedTypes}
            />
            <MultiSelect
              radius={4}
              searchable
              clearable
              label="Trạng thái"
              placeholder="Chọn trạng thái"
              data={[
                "Đang vận hành",
                "Đang bảo trì",
                "Ngừng hoạt động",
                "Đang trống",
              ]}
              value={selectedStatus}
              onChange={setSelectedStatus}
            />
          </SimpleGrid>
        </Stack>
      </Card>

      {/* --- TABLE --- */}
      <Table
        //@ts-expect-error no check
        columns={machineColumns}
        //@ts-expect-error no check
        data={filteredData}
      />

      {/* --- DELETE MODAL --- */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Xác nhận xóa"
        centered
      >
        <Text>Bạn có chắc chắn muốn xóa máy móc này không?</Text>
        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={closeDelete}>
            Hủy
          </Button>
          <Button color="red" onClick={handleDelete}>
            Xóa ngay
          </Button>
        </Group>
      </Modal>

      {/* --- DOCUMENT VIEWER MODAL --- */}
      <Modal
        opened={openedViewer}
        onClose={closeViewer}
        title={viewingFile?.title || "Xem tài liệu"}
        size="xl"
        radius="md"
      >
        <Box h={600} w="100%">
          {viewingFile?.url ? (
            <iframe
              src={viewingFile.url}
              title="Document Viewer"
              width="100%"
              height="100%"
              style={{
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#f8f9fa",
              }}
            />
          ) : (
            <Text ta="center" py="xl" c="dimmed">
              Không thể tải tài liệu
            </Text>
          )}
        </Box>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={closeViewer}>
            Đóng
          </Button>
        </Group>
      </Modal>
    </Stack>
  );
};

export default MachineManagementMainPage;
