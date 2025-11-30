import { ActionIcon, Button, Group, Menu, Stack, Title } from "@mantine/core";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";

type HistoryLog = {
  id: string;
  timestamp: string; // ISO format
  action: string; // mô tả ngắn
  entityType: string;
  entityId: string;
  user?: string;
};
const historyLogs: HistoryLog[] = [
  {
    id: "log_ent_001",
    timestamp: "2025-07-01T08:30:00",
    action: "Thêm mới đối tác doanh nghiệp",
    entityType: "Enterprise",
    entityId: "0312345678", // Mã số thuế
    user: "Admin System",
  },
  {
    id: "log_ent_002",
    timestamp: "2025-07-01T09:15:00",
    action: "Ký hợp đồng liên kết canh tác",
    entityType: "Household",
    entityId: "079090001234", // CCCD chủ hộ
    user: "Nguyễn Văn A",
  },
  {
    id: "log_ent_003",
    timestamp: "2025-07-01T10:45:00",
    action: "Thêm mới Hợp tác xã (HTX)",
    entityType: "Enterprise",
    entityId: "0108889999",
    user: "Trần Thị B",
  },
  {
    id: "log_ent_004",
    timestamp: "2025-07-02T14:20:00",
    action: "Cập nhật trạng thái: Ngừng hợp tác",
    entityType: "Household",
    entityId: "072091005678",
    user: "Admin System",
  },
];

const CompanyHistoryPage = () => {
  const historyColumns: MRT_ColumnDef<HistoryLog>[] = [
    {
      accessorKey: "timestamp",
      header: "Thời gian thực hiện",
      Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleString(),
    },
    {
      accessorKey: "action",
      header: "Hành động",
    },
    {
      accessorKey: "entityType",
      header: "Loại thông tin",
    },
    {
      accessorKey: "entityId",
      header: "Mã thông tin",
    },
    {
      accessorKey: "user",
      header: "Người thực hiện",
    },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
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
          Quản lý lịch sử thay đổi
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
        </Group>
      </Group>

      <Table columns={historyColumns} data={historyLogs} />
    </Stack>
  );
};
export default CompanyHistoryPage;
