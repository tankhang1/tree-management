import { Badge, Card, Group, Stack, Text, Title, Button } from "@mantine/core";
import { IconFileExcel, IconTrash } from "@tabler/icons-react";
import { useMemo } from "react";
import Table from "../../../components/Table"; // Component Table của bạn
import { useHistoryStore, type HistoryLog } from "../../zustand/hrHistoryStore";
import type { MRT_ColumnDef } from "mantine-react-table";

const HRHistoryPage = () => {
  const { logs, clearLogs } = useHistoryStore();

  // Định nghĩa cột cho bảng
  const columns = useMemo<MRT_ColumnDef<HistoryLog>[]>(
    () => [
      {
        accessorKey: "timestamp",
        header: "Thời gian",
        Cell: ({ cell }) => {
          const date = new Date(cell.getValue<string>());
          return (
            <Stack gap={0}>
              <Text size="sm" fw={500}>
                {date.toLocaleDateString("vi-VN")}
              </Text>
              <Text size="xs" c="dimmed">
                {date.toLocaleTimeString("vi-VN")}
              </Text>
            </Stack>
          );
        },
        size: 120,
      },
      {
        accessorKey: "action",
        header: "Hành động",
        Cell: ({ row }) => (
          <Stack gap={2}>
            <Text size="sm" fw={600}>
              {row.original.action}
            </Text>
            <Text size="xs" c="dimmed">
              {row.original.details}
            </Text>
          </Stack>
        ),
      },
      {
        accessorKey: "entityType",
        header: "Phân loại",
        Cell: ({ cell }) => {
          const type = cell.getValue<string>();
          let color = "blue";
          if (type === "Employee") color = "green";
          if (type === "Team") color = "orange";
          if (type === "Department") color = "grape";
          return (
            <Badge color={color} variant="light">
              {type}
            </Badge>
          );
        },
        size: 100,
      },
      {
        accessorKey: "targetName",
        header: "Đối tượng",
        Cell: ({ cell }) => <Text fw={500}>{cell.getValue<string>()}</Text>,
      },
      {
        accessorKey: "performedBy",
        header: "Người thực hiện",
        size: 120,
      },
    ],
    []
  );

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

      <Table columns={columns} data={logs} />
    </Stack>
  );
};

export default HRHistoryPage;
