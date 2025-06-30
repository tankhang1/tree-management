import { ActionIcon, Button, Group, Menu, Stack, Title } from "@mantine/core";
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
type FarmingMethod = {
  id: string;
  name: string;
  documentUrl?: string; // đường dẫn file PDF
};
const farmingMethods: FarmingMethod[] = [
  {
    id: "ORGANIC",
    name: "Hữu cơ",
    documentUrl: "/docs/farming/organic.pdf",
  },
  {
    id: "TRADITIONAL",
    name: "Truyền thống",
    documentUrl: "/docs/farming/traditional.pdf",
  },
  {
    id: "HI_TECH",
    name: "Công nghệ cao",
    documentUrl: "/docs/farming/hi_tech.pdf",
  },
];
const AreaManagementCultivationMethodPage = () => {
  const navigate = useNavigate();
  const onAddCultivationMethod = () => {
    navigate(PATH.AREA_ADD_CULTIVATION_METHOD);
  };
  const rowColumns: MRT_ColumnDef<FarmingMethod>[] = [
    {
      accessorKey: "id",
      header: "Mã phương pháp",
    },
    {
      accessorKey: "name",
      header: "Tên phương pháp",
    },
    {
      accessorKey: "documentUrl",
      header: "Tài liệu hướng dẫn",
      Cell: ({ cell }) => {
        const url = cell.getValue<string>();
        return url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "green" }}
          >
            📄 Xem tài liệu
          </a>
        ) : (
          "Không có"
        );
      },
    },
    {
      accessorKey: "actions",
      header: "",
      enableColumnActions: false,
      size: 10,
      Cell: () => (
        <Menu shadow="md">
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
            <Menu.Item leftSection={<IconTrash size={18} />} color="red">
              Xoá
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  return (
    <Stack gap="lg">
      <Group justify="space-between" px={"sm"}>
        <Title flex={1} order={2}>
          Quản lý phương thức canh tác
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddCultivationMethod}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={rowColumns} data={farmingMethods} />
    </Stack>
  );
};
export default AreaManagementCultivationMethodPage;
