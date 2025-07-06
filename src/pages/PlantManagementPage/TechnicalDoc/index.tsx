import {
  ActionIcon,
  Button,
  Group,
  Image,
  Menu,
  Stack,
  Title,
} from "@mantine/core";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";

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
  const navigate = useNavigate();

  const onTechnicalDocDetail = () => {
    navigate(PATH.PLANT_TECHNICAL_DOC_DETAIL);
  };
  const onAddTechnicalDoc = () => {
    navigate(PATH.PLANT_ADD_TECHNICAL_DOC);
  };
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
            <Menu.Item
              leftSection={<IconEye size={18} color="gray" />}
              onClick={onTechnicalDocDetail}
            >
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
          Quản lý tài liệu kĩ thuật
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddTechnicalDoc}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Table columns={varietyDetailColumns} data={varietyDetails} />
    </Stack>
  );
};

export default PlantManagementTechnicalDocPage;
