import { Button, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { IconFileExcel } from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddDisposalForm from "./components/AddDisposalForm";

type DisposalDetail = {
  id: string;
  machineId: string; // Mã máy bị thanh lý
  disposalDate: string; // Ngày thanh lý
  staffId: string; // Người thực hiện
  reason: string; // Lý do thanh lý
  valueRecovered: number; // Giá trị thu hồi (nếu có)
  notes: string; // Ghi chú thêm
};

const disposalDetails: DisposalDetail[] = [
  {
    id: "DIS001",
    machineId: "MC001",
    disposalDate: "2024-07-01T09:00:00",
    staffId: "EMP005",
    reason: "Máy hỏng nặng, không thể sửa chữa",
    valueRecovered: 0,
    notes: "Đưa vào danh sách thanh lý tài sản cố định.",
  },
  {
    id: "DIS002",
    machineId: "MC003",
    disposalDate: "2024-07-10T14:00:00",
    staffId: "EMP007",
    reason: "Thanh lý do nâng cấp máy mới",
    valueRecovered: 3_000_000,
    notes: "Đã bán lại cho đối tác phụ tùng cũ.",
  },
];

const MachineManagementDisposalHistoryPage = () => {
  const [
    openedAddDisposal,
    { open: openAddDisposal, close: closeAddDisposal },
  ] = useDisclosure(false);

  const disposalDetailColumns: MRT_ColumnDef<DisposalDetail>[] = [
    {
      accessorKey: "id",
      header: "Mã phiếu",
    },
    {
      accessorKey: "machineId",
      header: "Mã máy",
    },
    {
      accessorKey: "disposalDate",
      header: "Ngày thanh lý",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleString("vi-VN"),
    },
    {
      accessorKey: "staffId",
      header: "Người thực hiện",
    },
    {
      accessorKey: "reason",
      header: "Lý do",
    },
    {
      accessorKey: "valueRecovered",
      header: "Giá trị thu hồi",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      accessorKey: "notes",
      header: "Ghi chú",
    },
  ];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Lịch sử thanh lý máy móc
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openAddDisposal}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={disposalDetailColumns} data={disposalDetails} />
      <Modal
        opened={openedAddDisposal}
        onClose={closeAddDisposal}
        title={<Text fw={"bold"}>Tạo phiếu thanh lý</Text>}
      >
        <AddDisposalForm />
      </Modal>
    </Stack>
  );
};

export default MachineManagementDisposalHistoryPage;
