import { Button, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { IconFileExcel } from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useDisclosure } from "@mantine/hooks";
import AddDisposalForm from "./components/AddDisposalForm";

type MaterialDisposalDetail = {
  id: string;
  materialId: string; // Mã vật tư
  disposalDate: string; // Ngày thanh lý
  staffId: string; // Người thực hiện
  reason: string; // Lý do thanh lý
  quantity: number; // Số lượng thanh lý
  notes: string; // Ghi chú
};

const materialDisposalDetails: MaterialDisposalDetail[] = [
  {
    id: "MDIS001",
    materialId: "MAT001",
    disposalDate: "2024-07-01T09:00:00",
    staffId: "EMP002",
    reason: "Hết hạn sử dụng",
    quantity: 100,
    notes: "100 kg phân NPK hết hạn tháng 6/2024",
  },
  {
    id: "MDIS002",
    materialId: "MAT003",
    disposalDate: "2024-07-08T15:30:00",
    staffId: "EMP004",
    reason: "Bị ẩm, mốc, không đảm bảo chất lượng",
    quantity: 20,
    notes: "20 bao vật tư bị ẩm do rò rỉ kho",
  },
];

const SupplyManagementDisposalPage = () => {
  const [
    openedAddDisposal,
    { open: openAddDisposal, close: closeAddDisposal },
  ] = useDisclosure(false);

  const columns: MRT_ColumnDef<MaterialDisposalDetail>[] = [
    {
      accessorKey: "id",
      header: "Mã phiếu thanh lý",
    },
    {
      accessorKey: "materialId",
      header: "Mã vật tư",
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
      header: "Lý do thanh lý",
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
          Danh sách vật tư thanh lý
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

      <Table columns={columns} data={materialDisposalDetails} />
      <Modal
        opened={openedAddDisposal}
        onClose={closeAddDisposal}
        title={<Text fw={"bold"}>Tạo phiếu thanh lý vật tư</Text>}
      >
        <AddDisposalForm />
      </Modal>
    </Stack>
  );
};

export default SupplyManagementDisposalPage;
