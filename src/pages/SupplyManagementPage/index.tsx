import {
  ActionIcon,
  Badge,
  Button,
  Card,
  CloseButton,
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
  IconX,
} from "@tabler/icons-react";
import type { MRT_ColumnDef } from "mantine-react-table";
import Table from "../../components/Table";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../constants/path.constants";
import { useState } from "react";
type SupplyType = {
  id: string; // Mã vật tư
  name: string; // Tên vật tư
  supplier: string; // Nhà cung cấp
  type: string;
};
export const supplyTypes: SupplyType[] = [
  {
    id: "VT003",
    name: "Bạt phủ nilon đen",
    supplier: "Cửa hàng Vật tư nông nghiệp Tân Phú",
    type: "Vật tư nông nghiệp",
  },
  {
    id: "VT004",
    name: "Chai nhựa 500ml",
    supplier: "CTCP Bao bì An Phát",
    type: "Vật tư đóng gói",
  },
];

const SupplyManagementPage = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const supplyTypeColumns: MRT_ColumnDef<SupplyType>[] = [
    {
      accessorKey: "id",
      header: "Mã vật tư",
    },
    {
      accessorKey: "name",
      header: "Tên vật tư",
    },
    {
      accessorKey: "type",
      header: "Loại vật tư",
    },
    {
      accessorKey: "supplier",
      header: "Nhà cung cấp",
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
  const onAddSupply = () => {
    navigate(PATH.SUPPLY_ADD_MAIN);
  };
  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Title flex={1} order={2}>
          Quản lý vật tư
        </Title>
        <Group>
          <Button variant="outline" radius={4} leftSection={<IconFileExcel />}>
            Xuất File
          </Button>
          <Button radius={4} onClick={onAddSupply}>
            Thêm mới
          </Button>
        </Group>
      </Group>
      <Card withBorder shadow="sm" radius={4} p="md">
        {/* Header */}
        <Group justify="space-between" align="center" mb="xs">
          <Stack gap={0}>
            <Title order={4}>Tìm kiếm vật tư</Title>
            <Text c="dimmed" size="sm">
              Điền từ khóa hoặc chọn lọc loại vật tư, nhà cung cấp
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
            description="Ví dụ: Bạt phủ nilon"
            placeholder="Nhập thông tin"
            leftSection={<IconSearch size={16} />}
            value={keyword}
            onChange={(e) => setKeyword(e.currentTarget.value)}
          />

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="sm">
            <MultiSelect
              radius={4}
              label="Loại vật tư"
              description="Ví dụ: Vật tư A, Vật tư B"
              placeholder="Chọn thông tin"
              data={["Vật tư nông nghiệp", "Vật tư đóng gói", "Vật tư khác"]}
            />
            <MultiSelect
              radius={4}
              label="Nhà cung cấp"
              description="Ví dụ: Nhà cung cấp A, Nhà cung cấp B"
              placeholder="Chọn thông tin"
              data={["Nhà cung cấp 1", "Nhà cung cấp 2", "Nhà cung cấp 3"]}
            />
          </SimpleGrid>

          {/* Tóm tắt filter bằng chips (UI) */}
          {keyword && (
            <Group gap={8}>
              {keyword && (
                <Badge
                  variant="light"
                  rightSection={<CloseButton onClick={() => setKeyword("")} />}
                >
                  Từ khoá: {keyword}
                </Badge>
              )}

              <ActionIcon
                variant="subtle"
                onClick={() => {}}
                title="Xoá tất cả"
              >
                <IconX size={16} />
              </ActionIcon>
            </Group>
          )}
        </Stack>
      </Card>
      <Table columns={supplyTypeColumns} data={supplyTypes} />
    </Stack>
  );
};
export default SupplyManagementPage;
