import {
  ActionIcon,
  Button,
  Group,
  Stack,
  Title,
  Image,
  Menu,
  Text,
  Card,
  TextInput,
  Tooltip,
  Modal,
  Badge,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconTrash,
  IconCheck,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/path.constants";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import {
  useCertificateStore,
  type Certificate,
} from "../zustand/certificateStore";

const CertificatePage = () => {
  const navigate = useNavigate();

  // 1. KẾT NỐI STORE
  const { certificates, deleteCertificate } = useCertificateStore();

  // 2. LOCAL STATE

  // Modal Xóa
  const [openedDelete, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 3. NAVIGATION
  const onAddCertificate = () => navigate(PATH.CERTIFICATION_ADD);
  // Giả định dùng chung trang Add để Edit (kèm ID) nếu cần
  // const onEditCertificate = (id: string) => navigate(`${PATH.CERTIFICATION_ADD}/${id}`);

  // 4. LOGIC DELETE
  const confirmDelete = (id: string) => {
    setSelectedId(id);
    openDelete();
  };

  const handleDelete = () => {
    if (selectedId) {
      deleteCertificate(selectedId);
      notifications.show({
        title: "Đã xóa chứng nhận",
        color: "green",
        icon: <IconCheck />,
        message: "",
      });
      closeDelete();
      setSelectedId(null);
    }
  };

  // 6. CẤU HÌNH CỘT
  const certificateColumns: MRT_ColumnDef<Certificate>[] = [
    {
      accessorKey: "orgLogo",
      header: "Tổ chức",
      size: 100,
      Cell: ({ cell, row }) => (
        <Group gap="xs">
          <Image
            src={
              cell.getValue<string>() || "https://placehold.co/40x40?text=Logo"
            }
            alt="Logo"
            h={40}
            w={40}
            fit="contain"
            radius="sm"
          />
          <Text size="xs" c="dimmed" lineClamp={1} w={100}>
            {row.original.orgName}
          </Text>
        </Group>
      ),
    },
    {
      accessorKey: "certCode",
      header: "Mã số",
      Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
    },
    { accessorKey: "certName", header: "Tên chứng nhận", size: 200 },
    {
      accessorKey: "issueDate",
      header: "Ngày cấp",
      Cell: ({ cell }) => dayjs(cell.getValue<string>()).format("DD/MM/YYYY"),
    },
    {
      accessorKey: "validYears",
      header: "Hiệu lực",
      Cell: ({ cell }) => (
        <Badge variant="light" color="blue">
          {cell.getValue<number>()} năm
        </Badge>
      ),
    },
    {
      id: "targets", // Thay thế scopeType bằng số lượng đối tượng áp dụng
      header: "Phạm vi",
      Cell: ({ row }) => (
        <Text size="sm">
          Áp dụng cho {row.original.targets?.length || 0} đối tượng
        </Text>
      ),
    },
    {
      accessorKey: "content",
      header: "Tài liệu",
      Cell: ({ row }) => {
        const type = row.original.contentType;
        return type === "file" ? (
          <Text c="blue" td="underline" style={{ cursor: "pointer" }}>
            Tải PDF
          </Text>
        ) : (
          <Text c="dimmed">Nội dung HTML</Text>
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
            <Menu.Item leftSection={<IconEye size={18} color="gray" />}>
              Chi tiết
            </Menu.Item>
            <Menu.Item leftSection={<IconEdit size={18} color="green" />}>
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
          Quản lý giấy chứng nhận
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất Excel
          </Button>
          <Button
            radius={4}
            onClick={onAddCertificate}
            leftSection={<IconPlus size={18} />}
          >
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table
        //@ts-expect-error no check
        columns={certificateColumns}
        //@ts-expect-error no check
        data={certificates}
      />

      {/* MODAL DELETE */}
      <Modal
        opened={openedDelete}
        onClose={closeDelete}
        title="Xác nhận xóa"
        centered
      >
        <Text>Bạn có chắc chắn muốn xóa chứng nhận này không?</Text>
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

export default CertificatePage;
