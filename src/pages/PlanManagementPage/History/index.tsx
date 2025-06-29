import { Button, Group, Stack, Title } from "@mantine/core";
import { IconFileExcel } from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
type AssignmentHistory = {
  id: string;
  assignmentName: string;
  action: "Tạo mới" | "Chỉnh sửa" | "Xoá" | "Cập nhật trạng thái";
  performedBy: string;
  performedAt: string; // ISO Date string
  note?: string;
};

const assignmentHistoryData: AssignmentHistory[] = [
  {
    id: "1",
    assignmentName: "Phun thuốc trừ sâu đợt 1",
    action: "Tạo mới",
    performedBy: "Nguyễn Quản Lý",
    performedAt: "2025-07-01T09:00:00",
    note: "Khởi tạo phiếu giao việc lần đầu",
  },
  {
    id: "2",
    assignmentName: "Phun thuốc trừ sâu đợt 1",
    action: "Chỉnh sửa",
    performedBy: "Trần Văn Sửa",
    performedAt: "2025-07-02T14:20:00",
    note: "Cập nhật thời gian bắt đầu công việc",
  },
  {
    id: "3",
    assignmentName: "Phun thuốc trừ sâu đợt 1",
    action: "Cập nhật trạng thái",
    performedBy: "Lê Thị Giám Sát",
    performedAt: "2025-07-04T17:00:00",
    note: "Đã hoàn thành công việc",
  },
];

const PlanManagementHistoryPage = () => {
  const assignmentHistoryColumns: MRT_ColumnDef<AssignmentHistory>[] = [
    {
      accessorKey: "performedAt",
      header: "Thời gian",
      Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleString(),
    },
    {
      accessorKey: "assignmentName",
      header: "Tên phiếu",
    },
    {
      accessorKey: "action",
      header: "Hành động",
    },
    {
      accessorKey: "performedBy",
      header: "Người thực hiện",
    },
    {
      accessorKey: "note",
      header: "Ghi chú",
    },
  ];

  return (
    <Stack gap="lg">
      <Group justify="space-between" px={"sm"}>
        <Title flex={1} order={2}>
          Lịch sử điều chỉnh
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
        </Group>
      </Group>

      <Table columns={assignmentHistoryColumns} data={assignmentHistoryData} />
    </Stack>
  );
};
export default PlanManagementHistoryPage;
