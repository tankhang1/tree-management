import {
  ActionIcon,
  Button,
  Card,
  Group,
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
  IconRefresh,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../constants/path.constants";
type Fertilizer = {
  id: string;
  name: string; // Tên phân bón
  type: string; // Loại: ví dụ "Hữu cơ", "Vô cơ", "Vi sinh"
  nutrientContent: string; // Hàm lượng dinh dưỡng: "NPK 16-16-8", "Đạm 46%"
  unit: string; // Đơn vị tính: "kg", "bao", "gói"
  manufacturer: string; // Nhà sản xuất
  description?: string; // Ghi chú thêm
};
const mockFertilizers: Fertilizer[] = [
  {
    id: "F001",
    name: "Phân NPK tổng hợp",
    type: "Vô cơ",
    nutrientContent: "NPK 16-16-8",
    unit: "kg",
    manufacturer: "Công ty Phân bón Miền Nam",
    description: "Phù hợp cho cây ăn trái và rau màu",
  },
  {
    id: "F002",
    name: "Phân hữu cơ vi sinh",
    type: "Hữu cơ",
    nutrientContent: "Hữu cơ 30%",
    unit: "bao",
    manufacturer: "Công ty Hữu Cơ Việt",
    description: "Cải tạo đất, tăng độ tơi xốp",
  },
  {
    id: "F003",
    name: "Phân Urê",
    type: "Vô cơ",
    nutrientContent: "Đạm 46%",
    unit: "kg",
    manufacturer: "Đạm Phú Mỹ",
    description: "Cung cấp đạm giai đoạn phát triển thân lá",
  },
];
const FertilizerManagementMainPage = () => {
  const navigate = useNavigate();
  const fertilizerColumns: MRT_ColumnDef<Fertilizer>[] = [
    {
      accessorKey: "id",
      header: "Mã phân bón",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "name",
      header: "Tên phân bón",
      Cell: ({ cell }) => <Text fw={600}>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "type",
      header: "Loại",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "nutrientContent",
      header: "Hàm lượng dinh dưỡng",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "unit",
      header: "Đơn vị",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "manufacturer",
      header: "Nhà sản xuất",
      Cell: ({ cell }) => <Text>{cell.getValue<string>()}</Text>,
    },
    {
      accessorKey: "description",
      header: "Ghi chú",
      Cell: ({ cell }) => (
        <Text>{cell.getValue<string>() || "Không có ghi chú"}</Text>
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
  const onFertilizerAdd = () => {
    navigate(PATH.FERTILIZER_MAIN_ADD);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý thông tin phân bón
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onFertilizerAdd}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm phân bón</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc loại phân bón, nhà sản xuất
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
            description="Ví dụ: Phân NPK"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <MultiSelect
              label="Loại phân"
              description="Ví dụ: Phân NPK, Phân hữu cơ"
              data={["Phân NPK", "Phân hữu cơ", "Phân vi sinh"]}
              placeholder="Chọn thông tin"
              searchable
              clearable
              radius={4}
            />
            <MultiSelect
              label="Nhà sản xuất"
              description="Ví dụ: Công ty A, Công ty B"
              data={["Công ty A", "Công ty B", "Công ty C"]}
              placeholder="Chọn thông tin"
              searchable
              clearable
              radius={4}
            />
          </SimpleGrid>
        </Stack>
      </Card>
      <Table columns={fertilizerColumns} data={mockFertilizers} />
    </Stack>
  );
};
export default FertilizerManagementMainPage;
