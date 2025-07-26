import { Button, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { IconFileExcel } from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddPesticideUsageForm from "./components/AddPesticideUsageForm";

type PesticideUsage = {
  id: string;
  pesticideId: string; // mã thuốc (liên kết danh mục thuốc)
  fieldId: string; // mã vùng sử dụng thuốc
  startTime: string; // thời gian bắt đầu sử dụng
  endTime: string; // thời gian kết thúc
  staffId: string; // nhân viên thực hiện
  reason: string; // lý do sử dụng
  amount: number; // số lượng sử dụng (ml hoặc lít/kg)
  description: string; // mô tả chi tiết
};

const pesticideUsageHistory: PesticideUsage[] = [
  {
    id: "PU001",
    pesticideId: "TYPE01",
    fieldId: "FIELD001",
    startTime: "2024-06-10T07:00:00",
    endTime: "2024-06-10T08:30:00",
    staffId: "EMP005",
    reason: "Phòng trừ sâu cuốn lá",
    amount: 1500,
    description: "Pha 1.5 lít thuốc với 200 lít nước, phun toàn bộ ruộng lúa.",
  },
  {
    id: "PU002",
    pesticideId: "TYPE02",
    fieldId: "FIELD002",
    startTime: "2024-06-12T15:00:00",
    endTime: "2024-06-12T16:00:00",
    staffId: "EMP007",
    reason: "Trị nấm bệnh đạo ôn",
    amount: 2000,
    description: "Sử dụng thuốc trừ bệnh đạo ôn, phun đều vùng nghi nhiễm.",
  },
];

const PesticideUsageHistoryPage = () => {
  const [
    openedAddPesticideUsage,
    { open: openAddPesticideUsage, close: closeAddPesticideUsage },
  ] = useDisclosure(false);

  const pesticideUsageColumns: MRT_ColumnDef<PesticideUsage>[] = [
    {
      accessorKey: "id",
      header: "Mã phiếu",
    },
    {
      accessorKey: "pesticideId",
      header: "Mã thuốc",
    },
    {
      accessorKey: "fieldId",
      header: "Vùng sử dụng",
    },
    {
      accessorKey: "startTime",
      header: "Bắt đầu",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleString("vi-VN"),
    },
    {
      accessorKey: "endTime",
      header: "Kết thúc",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleString("vi-VN"),
    },
    {
      accessorKey: "staffId",
      header: "Nhân viên",
    },
    {
      accessorKey: "reason",
      header: "Lý do",
    },
    {
      accessorKey: "amount",
      header: "Số lượng",
      Cell: ({ cell }) =>
        cell.getValue<number>().toLocaleString("vi-VN") + " ml",
    },
    {
      accessorKey: "description",
      header: "Mô tả",
    },
  ];

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Lịch sử sử dụng thuốc
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openAddPesticideUsage}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={pesticideUsageColumns} data={pesticideUsageHistory} />
      <Modal
        opened={openedAddPesticideUsage}
        onClose={closeAddPesticideUsage}
        title={<Text fw={"bold"}>Tạo phiếu sử dụng thuốc</Text>}
      >
        <AddPesticideUsageForm />
      </Modal>
    </Stack>
  );
};

export default PesticideUsageHistoryPage;
