import {
  ActionIcon,
  Button,
  Card,
  Group,
  Image,
  Menu,
  MultiSelect,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconFileExcel,
  IconGrowth,
  IconRefresh,
  IconSearch,
  IconSeedling,
  IconTractor,
  IconTrash,
} from "@tabler/icons-react";
import Table from "../../../components/Table";
import type { MRT_ColumnDef } from "mantine-react-table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
export type TreeCrop = {
  id: string;
  name: string;
  seedType: string; // chọn II.2
  harvestMethod: string; // chọn II.5
  growthCycle: string; // chọn II.4
  note?: string;
  imgUrl?: string;
};
export const treeCropData: TreeCrop[] = [
  {
    id: "TREE001",
    name: "Đậu nành",
    seedType: "Hạt giống DT84",
    harvestMethod: "Thu hoạch bằng máy gặt liên hợp",
    growthCycle: "Chu kỳ ngắn (85–110 ngày)",
    note: "Ưa đất tơi xốp, pH 5.5–6.5; tránh ngập úng.",
    imgUrl:
      "https://lh6.googleusercontent.com/proxy/MkmLTr7RaC47H6aLuMX0yGGlXhtKf77bRQ0sEwVhPiHI01aj7WPJYpuBWIbN422tMgVbH5Z67gqzUj9h-LmQpjem8pVrKg",
  },
  {
    id: "TREE002",
    name: "Bắp",
    seedType: "Hạt lai F1 LVN10",
    harvestMethod: "Thu hoạch bằng tay hoặc máy tuốt bắp",
    growthCycle: "Chu kỳ trung bình (95–120 ngày)",
    note: "Ưa sáng, cần nhiều dinh dưỡng giai đoạn sinh trưởng.",
    imgUrl:
      "https://storage.vinaseed.com.vn/Data/2020/02/14/ngo-lai-don-lvn10-700-3-637172784104183900.jpg?w=620&h=350",
  },
  {
    id: "TREE003",
    name: "Đậu phộng",
    seedType: "Giống LDH01",
    harvestMethod: "Nhổ tay, phơi khô",
    growthCycle: "Chu kỳ ngắn (90–100 ngày)",
    note: "Phù hợp đất cát pha, tưới đủ ẩm trong giai đoạn tạo củ.",
    imgUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxv9jM0OAuz5DBK8pwHMinlOObu6ND6f52JQ&s",
  },
  {
    id: "TREE004",
    name: "Lạc đỏ",
    seedType: "Hạt giống địa phương",
    harvestMethod: "Thu hoạch thủ công",
    growthCycle: "Chu kỳ ngắn (95 ngày)",
    note: "Trồng xen canh tăng độ phì cho đất.",
    imgUrl:
      "https://vn-test-11.slatic.net/p/83d571a8224ce1eb268b1ff6bdf57e4a.jpg",
  },
  {
    id: "TREE005",
    name: "Đậu xanh",
    seedType: "Giống HL89",
    harvestMethod: "Thu hoạch bằng tay",
    growthCycle: "Chu kỳ ngắn (70–80 ngày)",
    note: "Thích hợp trồng vụ hè thu, chịu hạn tốt.",
    imgUrl: "https://harc-ias.vn/upload/products/Kha_nang_dau_trai_2.jpg",
  },
];

const PlantManagementTreePage = () => {
  const navigate = useNavigate();
  const onAddTree = () => {
    navigate(PATH.PLANT_ADD_TREE);
  };
  const onTreeDetail = () => {
    navigate(PATH.PLANT_TREE_DETAIL);
  };
  const treeCropColumns: MRT_ColumnDef<TreeCrop>[] = [
    { accessorKey: "id", header: "Mã cây" },
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
    { accessorKey: "name", header: "Tên cây" },
    { accessorKey: "seedType", header: "Hạt giống" },
    { accessorKey: "harvestMethod", header: "Hình thức thu hoạch" },
    { accessorKey: "growthCycle", header: "Chu kỳ sinh trưởng" },
    {
      accessorKey: "note",
      header: "Ghi chú",
      Cell: ({ row }) => row.original.note || "—",
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
              onClick={onTreeDetail}
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
          Quản lý cây trồng
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddTree}>
            Thêm mới
          </Button>
        </Group>
      </Group>

      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm cây trồng</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc loại cây, hình thức thu hoạch, chu kỳ
              sinh trưởng
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
            description="Ví dụ: Sầu riêng, Xoài"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <MultiSelect
              searchable
              clearable
              radius={4}
              leftSection={<IconSeedling size={18} />}
              label="Loại cây"
              description="Ví dụ: Hạt lai F1, Ghép cành"
              placeholder="Chọn thông tin"
              data={[
                "Hạt lai F1",
                "Ghép cành",
                "Chồi cây",
                "Hạt giống Robusta",
                "Hạt giống Thái",
              ]}
            />
            <MultiSelect
              searchable
              clearable
              radius={4}
              leftSection={<IconTractor size={18} />}
              label="Hình thức thu hoạch"
              description="Ví dụ: Thu hoạch thủ công, Thu hoạch bằng sào"
              placeholder="Chọn thông tin"
              data={[
                "Thu hoạch thủ công",
                "Thu hoạch bằng sào",
                "Thu hoạch cuống",
                "Thu hoạch bằng tay",
              ]}
            />
            <MultiSelect
              searchable
              clearable
              radius={4}
              leftSection={<IconGrowth size={18} />}
              label="Chu kỳ sinh trưởng"
              description="Ví dụ: Chu kỳ dài (5-7 năm), Chu kỳ trung bình (3-5 năm)"
              placeholder="Chọn thông tin"
              data={[
                "Chu kỳ dài (5-7 năm)",
                "Chu kỳ trung bình (3-5 năm)",
                "Chu kỳ ngắn (9-12 tháng)",
                "Chu kỳ dài (4-5 năm)",
                "Chu kỳ trung bình (3-4 năm)",
              ]}
            />
          </SimpleGrid>
        </Stack>
      </Card>
      <Table columns={treeCropColumns} data={treeCropData} />
    </Stack>
  );
};

export default PlantManagementTreePage;
