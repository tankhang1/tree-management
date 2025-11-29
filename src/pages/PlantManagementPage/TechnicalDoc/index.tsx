import {
  ActionIcon,
  Button,
  Group,
  Image,
  Menu,
  Stack,
  Title,
  Modal,
  Text,
  Badge,
} from "@mantine/core";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
  IconPlus,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

// IMPORT STORE MỚI
import {
  useTreeTechnicalDocStore,
  type TechnicalDoc,
} from "../../zustand/treeTechnicalDocStore";

const PlantManagementTechnicalDocPage = () => {
  const navigate = useNavigate();
  // SỬ DỤNG HOOK MỚI
  const { docs, deleteDoc } = useTreeTechnicalDocStore();

  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const onAddDoc = () => navigate(PATH.PLANT_ADD_TECHNICAL_DOC);
  const onDetailDoc = (id: string) =>
    navigate(`${PATH.PLANT_TECHNICAL_DOC_DETAIL}/${id}`);

  const confirmDelete = (id: string) => {
    setSelectedId(id);
    openDelete();
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteDoc(selectedId);
      notifications.show({
        title: "Đã xóa tài liệu",
        color: "green",
        message: "",
      });
      closeDelete();
      setSelectedId(null);
    }
  };

  const columns: MRT_ColumnDef<TechnicalDoc>[] = [
    {
      accessorKey: "imageUrl",
      header: "Hình ảnh",
      size: 80,
      Cell: ({ row }) => (
        <Image
          src={row.original.imageUrl}
          h={50}
          w={50}
          radius="md"
          fit="cover"
          fallbackSrc="https://placehold.co/50x50?text=No+Img"
        />
      ),
    },
    { accessorKey: "templateCode", header: "Mã mẫu", size: 100 },
    {
      accessorKey: "cropName",
      header: "Cây trồng",
      Cell: ({ row }) => (
        <Stack gap={0}>
          <Text fw={500} size="sm">
            {row.original.cropName}
          </Text>
          <Text c="dimmed" size="xs">
            {row.original.variety}
          </Text>
        </Stack>
      ),
    },
    {
      accessorKey: "seasonality",
      header: "Mùa vụ",
      Cell: ({ cell }) => (
        <Group gap={4}>
          {cell.getValue<string[]>()?.map((s) => (
            <Badge key={s} size="xs" variant="light">
              {s}
            </Badge>
          ))}
        </Group>
      ),
    },
    {
      accessorKey: "lastUpdated",
      header: "Cập nhật cuối",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleDateString("vi-VN"),
    },
    {
      accessorKey: "actions",
      header: "Thao tác",
      enableColumnActions: false,
      size: 60,
      Cell: ({ row }) => (
        <Menu shadow="md" position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDotsVertical size={18} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={() => onDetailDoc(row.original.id)}
              leftSection={<IconEye size={18} color="blue" />}
            >
              Chi tiết / Sửa
            </Menu.Item>
            <Menu.Item
              onClick={() => confirmDelete(row.original.id)}
              leftSection={<IconTrash size={18} color="red" />}
            >
              Xóa
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
          Quản lý tài liệu kỹ thuật
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất Excel
          </Button>
          <Button
            radius={4}
            onClick={onAddDoc}
            leftSection={<IconPlus size={18} />}
          >
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table
        //@ts-expect-error no check
        columns={columns}
        //@ts-expect-error no check
        data={docs}
      />

      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Xác nhận xóa"
        centered
      >
        <Text>Bạn có chắc chắn muốn xóa tài liệu này không?</Text>
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

export default PlantManagementTechnicalDocPage;
