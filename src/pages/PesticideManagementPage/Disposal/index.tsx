import { Button, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { IconFileExcel } from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddDisposalForm from "./components/AddDisposalForm";

type PesticideDisposalDetail = {
  id: string;
  pesticideId: string; // Mã thuốc
  disposalDate: string; // Ngày huỷ
  staffId: string; // Người thực hiện
  reason: string; // Lý do huỷ
  quantity: number; // Số lượng huỷ
  notes: string; // Ghi chú
};

const pesticideDisposalDetails: PesticideDisposalDetail[] = [
  {
    id: "PD001",
    pesticideId: "PST001",
    disposalDate: "2024-07-01T09:00:00",
    staffId: "EMP002",
    reason: "Thuốc hết hạn sử dụng",
    quantity: 12,
    notes: "12 chai thuốc trừ sâu hết hạn tháng 6/2024",
  },
  {
    id: "PD002",
    pesticideId: "PST003",
    disposalDate: "2024-07-08T15:30:00",
    staffId: "EMP004",
    reason: "Bao bì rách, không đảm bảo chất lượng",
    quantity: 5,
    notes: "5 gói thuốc vi sinh bị thấm nước",
  },
];

const PesticideManagementDisposalPage = () => {
  const [
    openedAddDisposal,
    { open: openAddDisposal, close: closeAddDisposal },
  ] = useDisclosure(false);

  const columns: MRT_ColumnDef<PesticideDisposalDetail>[] = [
    {
      accessorKey: "id",
      header: "Mã phiếu huỷ",
    },
    {
      accessorKey: "pesticideId",
      header: "Mã thuốc",
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
          Danh sách thuốc huỷ
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

      <Table columns={columns} data={pesticideDisposalDetails} />
      <Modal
        opened={openedAddDisposal}
        onClose={closeAddDisposal}
        title={<Text fw={"bold"}>Tạo phiếu huỷ thuốc</Text>}
      >
        <AddDisposalForm />
      </Modal>
    </Stack>
  );
};

export default PesticideManagementDisposalPage;
