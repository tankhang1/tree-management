import {
  ActionIcon,
  Button,
  Card,
  Group,
  Image,
  Menu,
  Modal,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconRefresh,
  IconSearch,
  IconTrash,
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
export const seedDataset: SeedInfo[] = [
  {
    id: "DN-DT84",
    name: "Đậu nành DT84",
    supplier: "Trung tâm Giống cây trồng Việt Nam",
    origin: "Việt Nam",
    germinationRate: 90,
    uniformity: 70,
    yield: "2,5 tấn/ha",
    note: "Giống đậu nành ngắn ngày (90–100 ngày), chịu hạn tốt, hạt vàng sáng, dễ canh tác.",
    technicalDoc: "dau-nanh-dt84.pdf",
    imgUrl:
      "https://lh6.googleusercontent.com/proxy/MkmLTr7RaC47H6aLuMX0yGGlXhtKf77bRQ0sEwVhPiHI01aj7WPJYpuBWIbN422tMgVbH5Z67gqzUj9h-LmQpjem8pVrKg",
  },
  {
    id: "DN-DX11",
    name: "Đậu nành ĐX11",
    supplier: "Công ty Mekong Seed",
    origin: "Việt Nam",
    germinationRate: 88,
    uniformity: 72,
    yield: "2,8 tấn/ha",
    note: "Giống cho năng suất cao, hạt to, vỏ vàng, phù hợp nhiều vùng sinh thái khác nhau.",
    technicalDoc: "dau-nanh-dx11.pdf",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxNvmzOr65QezHLAx9jp82a_wLJNjCzSuexA&s",
  },
  {
    id: "BP-LVN10",
    name: "Bắp LVN10",
    supplier: "Viện Nghiên cứu Ngô Trung ương",
    origin: "Việt Nam",
    germinationRate: 93,
    uniformity: 80,
    yield: "9,5 tấn/ha",
    note: "Giống bắp lai LVN10 sinh trưởng khỏe, kháng sâu bệnh tốt, thời gian sinh trưởng 100–115 ngày.",
    technicalDoc: "bap-lvn10.pdf",
    imgUrl:
      "https://storage.ssc.com.vn/Data/2021/05/18/lvn10-3-637569497051796680.jpg?w=620&h=350",
  },
  {
    id: "BP-NK66",
    name: "Bắp NK66",
    supplier: "Syngenta Việt Nam",
    origin: "Thái Lan",
    germinationRate: 91,
    uniformity: 78,
    yield: "10 tấn/ha",
    note: "Giống bắp NK66 chịu hạn tốt, phù hợp vùng Đông Nam Bộ và Tây Nguyên, chất lượng hạt cao.",
    technicalDoc: "bap-nk66.pdf",
    imgUrl: "https://static.tuoitre.vn/tto/i/s626/2015/03/24/AgwPWLuq.jpg",
  },
  {
    id: "BP-HN68",
    name: "Bắp nếp HN68",
    supplier: "Công ty Giống Cây trồng Trung ương",
    origin: "Việt Nam",
    germinationRate: 89,
    uniformity: 75,
    yield: "8,5 tấn/ha",
    note: "Giống bắp nếp chất lượng cao, hạt dẻo thơm, trắng sữa, thời gian sinh trưởng 95 ngày.",
    technicalDoc: "bap-hn68.pdf",
    imgUrl:
      "https://storage.vinaseed.com.vn/Data/2020/03/10/2-ngo-hn68-637194768462517218.jpg?w=620&h=350",
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
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm hạt giống cây</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc nhà cung cấp, xuất xứ
            </Text>
          </Stack>

          <Group>
            <Tooltip label="Xoá tất cả bộ lọc">
              <Button
                radius={4}
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={() => {}}
              >
                Làm mới
              </Button>
            </Tooltip>
            <Button radius={4} leftSection={<IconSearch size={16} />}>
              Lọc thông tin
            </Button>
          </Group>
        </Group>

        {/* Form */}
        <Stack gap="sm">
          {/* Khung tìm kiếm (keyword) */}
          <TextInput
            radius={4}
            label="Khung tìm kiếm"
            description="Ví dụ: Giống Ri6, Giống Xoài Miền Tây"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <MultiSelect
              radius={4}
              label="Nhà cung cấp"
              description="Ví dụ: Công ty TNHH ABC, Công ty CP XYZ"
              placeholder="Chọn thông tin"
              data={[
                "Công ty TNHH ABC",
                "Công ty CP XYZ",
                "Công ty TNHH MTV DEF",
                "Công ty TNHH GHI",
              ]}
            />
            <MultiSelect
              radius={4}
              label="Xuất xứ"
              description="Ví dụ: Việt Nam, Thái Lan, Indonesia"
              placeholder="Chọn thông tin"
              data={[
                "Việt Nam",
                "Thái Lan",
                "Indonesia",
                "Malaysia",
                "Campuchia",
              ]}
            />
          </SimpleGrid>
        </Stack>
      </Card>
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
