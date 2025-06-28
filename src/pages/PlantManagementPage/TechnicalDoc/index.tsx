import {
  ActionIcon,
  Button,
  Group,
  Image,
  Menu,
  Modal,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import AddTechnicalDocForm from "./components/AddTechnicalDocForm";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";

type TechnicalDoc = {
  id: string;
  imageUrl: string; // Hình ảnh minh hoạ
  templateCode: string; // Mã mẫu cây (nếu có)
  cultivationTechniques: string; // Kỹ thuật canh tác
  standards: string; // Tiêu chuẩn chất lượng
  pestSolutions: string; // Các loại sâu bệnh và giải pháp
};
const varietyDetails: TechnicalDoc[] = [
  {
    id: "VRI-001",
    imageUrl: "https://img.freepik.com/free-vector/tree_1308-36471.jpg",
    templateCode: "TMP-01",
    cultivationTechniques: "Trồng theo mô hình VietGAP, bón phân hữu cơ",
    standards: "VietGAP, GlobalGAP",
    pestSolutions: "Rầy nâu - sử dụng thuốc sinh học; Thối rễ - xử lý vôi bột",
  },
  {
    id: "VRI-002",
    imageUrl: "https://img.freepik.com/free-vector/tree_1308-36471.jpg",
    templateCode: "TMP-02",
    cultivationTechniques: "Chăm sóc bằng phân chuồng hoai mục, tưới nhỏ giọt",
    standards: "UTZ Certified",
    pestSolutions:
      "Sâu đục thân - cắt tỉa cành; Bệnh gỉ sắt - phun thuốc gốc đồng",
  },
];
const PlantManagementTechnicalDocPage = () => {
  const [
    openedAddTechnicalDocForm,
    { open: openAddTechnicalDocForm, close: closeAddTechnicalDocForm },
  ] = useDisclosure(false);
  const varietyDetailColumns: MRT_ColumnDef<TechnicalDoc>[] = [
    {
      accessorKey: "imageUrl",
      header: "Hình ảnh",
      Cell: ({ row }) => (
        <Image
          src={row.original.imageUrl}
          alt="Cây trồng"
          width={60}
          radius="md"
        />
      ),
      size: 80,
    },
    { accessorKey: "templateCode", header: "Mẫu cây" },
    { accessorKey: "cultivationTechniques", header: "Kỹ thuật canh tác" },
    { accessorKey: "standards", header: "Tiêu chuẩn, chất lượng" },
    { accessorKey: "pestSolutions", header: "Sâu bệnh & Giải pháp" },

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
          Quản lý nhóm cây trồng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={openAddTechnicalDocForm}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={varietyDetailColumns} data={varietyDetails} />
      <Modal
        opened={openedAddTechnicalDocForm}
        onClose={closeAddTechnicalDocForm}
        title={<Text fw={500}>Tạo mới loại cây</Text>}
      >
        <AddTechnicalDocForm />
      </Modal>
    </Stack>
  );
};

export default PlantManagementTechnicalDocPage;
