import {
  ActionIcon,
  Autocomplete,
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
          Quản lý giống cây
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
        <Autocomplete
          radius={4}
          leftSection={<IconHome size={18} />}
          placeholder="Nhà cung cấp"
          data={["Đại lí A"]}
        />
        <Autocomplete
          radius={4}
          leftSection={<IconWorld size={18} />}
          placeholder="Xuất xứ"
          data={["Việt nam"]}
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
