import { Button, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { IconFileExcel } from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddDisposalForm from "./components/AddDisposalForm";

type FertilizerDisposalDetail = {
  id: string;
  fertilizerId: string; // Mã phân bón
  disposalDate: string; // Ngày huỷ
  staffId: string; // Người thực hiện
  reason: string; // Lý do huỷ
  quantity: number; // Số lượng
  notes: string; // Ghi chú
};

const fertilizerDisposalDetails: FertilizerDisposalDetail[] = [
  {
    id: "FDIS001",
    fertilizerId: "FER001",
    disposalDate: "2024-07-01T09:00:00",
    staffId: "EMP002",
    reason: "Hết hạn sử dụng",
    quantity: 100,
    notes: "100 bao phân NPK hết hạn tháng 6/2024",
  },
  {
    id: "FDIS002",
    fertilizerId: "FER003",
    disposalDate: "2024-07-08T15:30:00",
    staffId: "EMP004",
    reason: "Bị vón cục, không đảm bảo chất lượng",
    quantity: 50,
    notes: "50 bao phân vi sinh bị hư trong kho do độ ẩm cao",
  },
];

const FertilizerManagementDisposalPage = () => {
  const [
    openedAddDisposal,
    { open: openAddDisposal, close: closeAddDisposal },
  ] = useDisclosure(false);

  const columns: MRT_ColumnDef<FertilizerDisposalDetail>[] = [
    {
      accessorKey: "id",
      header: "Mã phiếu huỷ",
    },
    {
      accessorKey: "fertilizerId",
      header: "Mã phân bón",
    },
    {
      accessorKey: "disposalDate",
      header: "Ngày huỷ",
      Cell: ({ cell }) =>
        new Date(cell.getValue<string>()).toLocaleString("vi-VN"),
    },
    {
      accessorKey: "staffId",
      header: "Người thực hiện",
    },
    {
      accessorKey: "reason",
      header: "Lý do huỷ",
    },
    {
      accessorKey: "quantity",
      header: "Số lượng",
      Cell: ({ cell }) => `${cell.getValue<number>()} đơn vị`,
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
          Danh sách phân bón huỷ
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

      <Table columns={columns} data={fertilizerDisposalDetails} />
      <Modal
        opened={openedAddDisposal}
        onClose={closeAddDisposal}
        title={<Text fw={"bold"}>Tạo phiếu huỷ phân bón</Text>}
      >
        <AddDisposalForm />
      </Modal>
    </Stack>
  );
};

export default FertilizerManagementDisposalPage;
