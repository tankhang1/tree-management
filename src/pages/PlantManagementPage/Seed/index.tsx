import {
  ActionIcon,
  Button,
  Group,
  Image,
  Menu,
  Modal,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconHome,
  IconTrash,
  IconWorld,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
import SeedDetailView from "./components/SeedDetailView";

type SeedInfo = {
  id: string; // Mã giống cây (hệ thống)
  name: string; // Tên giống
  supplier: string; // Nhà cung cấp
  origin: string; // Xuất xứ (quốc gia)
  germinationRate: number; // Tỷ lệ nảy mầm (%)
  yield: string; // Năng suất (ví dụ: "25 tấn/ha")
  uniformity: number;
  note: string; // Mô tả
  technicalDoc: string | null; // Link tài liệu kỹ thuật hoặc tên file
  imgUrl: string;
};
const seedDataset: SeedInfo[] = [
  {
    id: "SR-RI6",
    name: "Giống Ri6",
    supplier: "Công ty Nông sản Việt",
    origin: "Việt Nam",
    germinationRate: 85,
    yield: "25 tấn/ha",
    note: "Giống được kiểm định bởi Bộ NN&PTNT.",
    uniformity: 60,
    technicalDoc: "ri6-tech-guide.pdf",
    imgUrl:
      "https://giongcaytrongeakmat.com/wp-content/uploads/giong-sau-rieng-ri6.jpg",
  },
  {
    id: "X-MT01",
    name: "Xoài Miền Tây 01",
    supplier: "Công ty Mekong Seed",
    origin: "Việt Nam",
    germinationRate: 90,
    uniformity: 60,
    yield: "30 tấn/ha",
    note: "Chống chịu sâu bệnh tốt, phù hợp với khí hậu miền Tây.",
    technicalDoc: "xoai-mt01.pdf",
    imgUrl:
      "https://giongcaytrongeakmat.com/wp-content/uploads/giong-sau-rieng-ri6.jpg",
  },
  {
    id: "CH-BN01",
    name: "Chuối Bơ Năm 01",
    supplier: "Green Seed Co.",
    origin: "Thái Lan",
    germinationRate: 88,
    uniformity: 70,
    yield: "20 tấn/ha",
    note: "Giống chuối năng suất cao, phù hợp với khí hậu nhiệt đới.",
    technicalDoc: "chuoi-bn01.pdf",
    imgUrl:
      "data:image/jpeg;base64,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",
  },
  {
    id: "CF-ROB01",
    name: "Cà phê Robusta 01",
    supplier: "Công ty Mekong Seed",
    origin: "Indonesia",
    germinationRate: 92,
    uniformity: 75,
    yield: "35 tấn/ha",
    note: "Giống cà phê Robusta chất lượng cao, kháng bệnh tốt.",
    technicalDoc: "ca-phe-robusta01.pdf",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC3QhjzoitP1lcFx2sBiw51Bmm-dB5iS3X9A&s",
  },

  {
    id: "BR-DX01",
    name: "Bưởi Da Xanh 01",
    supplier: "Green Seed Co.",
    origin: "Việt Nam",
    germinationRate: 87,
    uniformity: 68,
    yield: "35 tấn/ha",
    note: "Giống bưởi da xanh chất lượng cao, phù hợp với nhiều vùng khí hậu.",
    technicalDoc: "buoi-dx01.pdf",
    imgUrl:
      "https://buoidaxanh.com/uploads/images/buoi-huu-co/untitled-1-01-2fe04f6409.png",
  },
];
const PlantManagementSeedPage = () => {
  const navigate = useNavigate();
  const [openedSeedForm, { open: openSeedForm, close: closeSeedForm }] =
    useDisclosure(false);
  const onAddSeed = () => {
    navigate(PATH.PLANT_ADD_SEED);
  };
  const seedColumns: MRT_ColumnDef<SeedInfo>[] = [
    {
      accessorKey: "imgUrl",
      header: "Hình ảnh",
      size: 80,
      Cell: ({ cell }) => {
        const url = cell.getValue<string>();
        return url ? (
          <Image
            src={url}
            alt="Ảnh giống cây"
            style={{
              width: 48,
              height: 48,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <Text size="xs" c="dimmed">
            Không có ảnh
          </Text>
        );
      },
    },
    { accessorKey: "id", header: "Mã giống" },
    { accessorKey: "name", header: "Tên giống" },
    { accessorKey: "supplier", header: "Nhà cung cấp" },
    { accessorKey: "origin", header: "Xuất xứ" },
    {
      accessorKey: "germinationRate",
      header: "Tỷ lệ nảy mầm (%)",
      Cell: ({ cell }) => `${cell.getValue()}%`,
    },
    {
      accessorKey: "uniformity",
      header: "Độ đồng đều (%)",
      Cell: ({ cell }) => `${cell.getValue()}%`,
    },
    { accessorKey: "yield", header: "Năng suất" },
    { accessorKey: "note", header: "Mô tả" },
    {
      accessorKey: "technicalDoc",
      header: "Tài liệu kỹ thuật",
      Cell: ({ cell }) =>
        cell.getValue() ? (
          <a
            href={`/${cell.getValue()}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Tài liệu tham khảo
          </a>
        ) : (
          "Không có"
        ),
    },
    {
      accessorKey: "actions",
      header: "Tuỳ chọn",
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
              onClick={openSeedForm}
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
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý hạt giống cây
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button onClick={onAddSeed} radius={4}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Group>
        <Select
          searchable
          clearable
          radius={4}
          leftSection={<IconHome size={18} />}
          placeholder="Nhà cung cấp"
          data={[
            "Công ty Nông sản Việt",
            "Công ty Mekong Seed",
            "Green Seed Co.",
            "Đại lý A",
            "Đại lý B",
            "Đại lý C",
          ]}
        />
        <Select
          searchable
          clearable
          radius={4}
          leftSection={<IconWorld size={18} />}
          placeholder="Xuất xứ"
          data={[
            "Việt Nam",
            "Thái Lan",
            "Indonesia",
            "Malaysia",
            "Philippines",
            "Ấn Độ",
            "Trung Quốc",
            "Nhật Bản",
          ]}
        />
      </Group>
      <Table columns={seedColumns} data={seedDataset} />
      <Modal
        opened={openedSeedForm}
        onClose={closeSeedForm}
        title={<Text fw={500}>Thông tin chi tiết giống hạt</Text>}
      >
        <SeedDetailView
          seed={{
            id: "SR-RI6",
            name: "Giống Ri6",
            supplier: "Green Seed Co.",
            origin: "Việt Nam",
            germinationRate: "85",
            yield: "25",
            note: "<p>Giống Ri6 nổi bật với năng suất cao và cơm vàng đậm.</p>",
            imageUrl:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1bNpDVSv6F-8H10X4SwSvoi_OF-XkLZZIdw&s",
            technicalDocUrl: "", // hoặc null nếu không có file
            technicalContent:
              "<p>Hướng dẫn trồng theo mật độ 6x6m, sử dụng phân NPK.</p>",
          }}
        />
      </Modal>
    </Stack>
  );
};

export default PlantManagementSeedPage;
