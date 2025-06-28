import { Button, Group, Stack, Title } from "@mantine/core";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { IconFileExcel } from "@tabler/icons-react";

type HistoryLog = {
  id: string;
  timestamp: string; // ISO format
  action: string; // mô tả ngắn
  entityType: "Region" | "Area" | "Lot" | "Row" | "Tree";
  entityId: string;
  user?: string;
};
const historyLogs: HistoryLog[] = [
  {
    id: "log001",
    timestamp: "2025-06-27T22:01:00",
    action: "Tạo mới lô LO001 tại KV001",
    entityType: "Lot",
    entityId: "LO001",
    user: "Nguyễn Văn A",
  },
  {
    id: "log002",
    timestamp: "2025-06-27T22:05:00",
    action: "Thêm hàng HR001 gồm 20 cây Xoài",
    entityType: "Row",
    entityId: "HR001",
    user: "Nguyễn Văn A",
  },
  {
    id: "log003",
    timestamp: "2025-06-27T22:10:00",
    action: "Cập nhật tọa độ GPS cho lô LO001",
    entityType: "Lot",
    entityId: "LO001",
    user: "Nguyễn Văn A",
  },
];

const AreaManagementHistoryPage = () => {
  const historyColumns: MRT_ColumnDef<HistoryLog>[] = [
    {
      accessorKey: "timestamp",
      header: "Thời gian",
      Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleString(),
    },
    {
      accessorKey: "action",
      header: "Hành động",
    },
    {
      accessorKey: "entityType",
      header: "Loại đối tượng",
    },
    {
      accessorKey: "entityId",
      header: "Mã đối tượng",
    },
    {
      accessorKey: "user",
      header: "Người thao tác",
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
export default AreaManagementHistoryPage;
